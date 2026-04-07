"use client";

import { useRef, useState } from "react";
import { useToastContext } from "@/components/providers/ToastProvider";

interface ImageUploadProps {
  productId?: string;
  onUpload: (files: File[]) => Promise<void>;
  onChange?: (files: File[]) => void;
  existingImages?: { id?: string; url: string; order: number }[];
  loading: boolean;
}

export default function ImageUpload({ productId, onUpload, onChange, existingImages = [], loading }: ImageUploadProps) {
  const { addToast } = useToastContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCount = existingImages.length + selectedFiles.length + files.length;

    if (totalCount > 5) {
      addToast("error", "Maximum 5 images allowed per product");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);
    setPreviews([...previews, ...newPreviews]);
    if (onChange) onChange(updatedFiles);
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    if (onChange) onChange(newFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-bold text-gray-900">Product Images</h3>
        <span className="text-xs font-semibold text-gray-500 uppercase">
          {existingImages.length + selectedFiles.length} / 5 Images
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Existing Images */}
        {existingImages.map((img, idx) => (
          <div key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-neutral-100 relative">
            <img 
               src={img.url} 
               alt="Product" 
               className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black/60 px-2 py-0.5 rounded text-white text-[8px] font-bold uppercase">
               Stored
            </div>
          </div>
        ))}

        {/* New Selected Previews */}
        {previews.map((preview, idx) => (
          <div key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-purple-500 relative">
            <img 
              src={preview} 
              alt="Preview" 
              loading="lazy"
              className="w-full h-full object-cover" 
            />
            <button
              onClick={() => removeSelectedFile(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg"
            >
              &times;
            </button>
          </div>
        ))}

        {/* Upload Trigger */}
        {(existingImages.length + selectedFiles.length < 5) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50"
          >
            <span className="text-2xl mb-1">+</span>
            <span className="text-[10px] font-bold uppercase">Add Photo</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      {selectedFiles.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || !productId}
          className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl disabled:opacity-50"
        >
          {loading ? "Uploading..." : `Upload ${selectedFiles.length} Image(s)`}
          {!productId && " (Save product first)"}
        </button>
      )}

      <p className="text-[10px] text-gray-400 italic text-center">
        Max 5MB per image. Supports JPG, PNG, GIF.
      </p>
    </div>
  );
}
