"use client";

import { useState } from "react";
import { 
  ArrowLeft, Store, Package, ShoppingBag, 
  TrendingUp, Mail, Phone, MapPin, 
  Settings, ExternalLink, Loader2, Save
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface MerchantDetailViewProps {
  merchant: any;
  onBack: () => void;
  onUpdateProduct: (id: string, data: any) => Promise<void>;
  onUpdateOrderStatus: (id: string, status: string) => Promise<void>;
  loadingDetails: boolean;
}

export default function MerchantDetailView({ 
  merchant, 
  onBack, 
  onUpdateProduct, 
  onUpdateOrderStatus,
  loadingDetails 
}: MerchantDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  if (loadingDetails && !merchant) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-neutral-300" />
        <p className="text-sm font-black uppercase tracking-widest text-neutral-400">Fetching Intel...</p>
      </div>
    );
  }

  const { profile, products, orders, stats } = merchant;

  const handleStatusUpdate = async (orderItemId: string, status: string) => {
    setUpdatingId(orderItemId);
    try {
      await onUpdateOrderStatus(orderItemId, status);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const startEditing = (p: any) => {
    setEditingProductId(p.id);
    setEditFormData({
      basePrice: p.basePrice,
      name: p.name
    });
  };

  const handleProductUpdate = async (productId: string) => {
    setUpdatingId(productId);
    try {
      await onUpdateProduct(productId, editFormData);
      setEditingProductId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Merchants
        </button>
        <div className="flex items-center gap-4">
          <a 
            href={`/merchants/${profile.id}`} 
            target="_blank" 
            className="flex items-center gap-2 px-6 py-3 bg-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all text-neutral-600"
          >
            <ExternalLink className="w-3 h-3" /> Public Profile
          </a>
        </div>
      </div>

      {/* Brand Header */}
      <section className="bg-white rounded-[3rem] border border-neutral-100 shadow-2xl shadow-neutral-100 overflow-hidden">
        <div className="relative h-48 bg-neutral-900 overflow-hidden">
          {profile.bannerUrl ? (
            <Image src={profile.bannerUrl} alt="Banner" fill className="object-cover opacity-60" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-700 text-[10px] font-black uppercase tracking-[0.4em]">No Banner Set</div>
          )}
        </div>
        <div className="px-12 pb-12 -mt-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="relative w-32 h-32 rounded-[2.5rem] bg-white border-4 border-white shadow-2xl overflow-hidden shadow-neutral-200">
              {profile.logo ? (
                <Image src={profile.logo} alt="Logo" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black text-white text-3xl font-black">{profile.storeName.charAt(0)}</div>
              )}
            </div>
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-5xl font-black text-neutral-900 tracking-tighter uppercase italic">{profile.storeName}</h2>
                {profile.isTrending && (
                  <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {profile.user.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {profile.user.phone || 'N/A'}</div>
                <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {profile.address || 'Global Store'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-xl shadow-neutral-200">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">M-Revenue</p>
          <h3 className="text-3xl font-black">৳{stats.totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Items Sold</p>
          <h3 className="text-3xl font-black text-neutral-900">{stats.totalSales}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Product Items</p>
          <h3 className="text-3xl font-black text-neutral-900">{stats.totalItems}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Fulfillment</p>
          <h3 className="text-3xl font-black text-neutral-900">{stats.fulfillmentRate}%</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 border-b border-neutral-100">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`pb-6 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === "overview" ? "text-black" : "text-neutral-400"}`}
        >
          Insights
          {activeTab === "overview" && <div className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("products")}
          className={`pb-6 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === "products" ? "text-black" : "text-neutral-400"}`}
        >
          Catalog ({products.length})
          {activeTab === "products" && <div className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={`pb-6 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === "orders" ? "text-black" : "text-neutral-400"}`}
        >
          Operations ({orders.length})
          {activeTab === "orders" && <div className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full" />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-neutral-50 p-10 rounded-[2.5rem] border border-neutral-100">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-neutral-400">About the Merchant</h4>
               <p className="text-neutral-700 font-medium leading-relaxed italic">"{profile.description || 'No store description provided.'}"</p>
               <div className="mt-8 pt-8 border-t border-neutral-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Member Since</p>
                  <p className="text-sm font-black text-black">{format(new Date(profile.createdAt), "MMMM d, yyyy")}</p>
               </div>
            </div>
            {/* Future: Quick actions or risk meter */}
            <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 flex flex-col items-center justify-center text-center opacity-40">
               <Settings className="w-10 h-10 mb-4 text-neutral-300" />
               <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Merchant Health Metrics Soon</p>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white border border-neutral-100 rounded-[2.5rem] overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-100 text-left">
              <thead className="bg-neutral-50/50">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Product</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                        {p.images?.[0]?.url && <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-neutral-900 tracking-tighter uppercase italic leading-none">{p.name}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{p.category?.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">৳</span>
                        {editingProductId === p.id ? (
                          <input 
                            type="number"
                            value={editFormData.basePrice}
                            onChange={(e) => setEditFormData({ ...editFormData, basePrice: Number(e.target.value) })}
                            className="w-20 bg-neutral-100 border-none rounded-lg px-2 py-1 text-sm font-black outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        ) : (
                          <span className="text-sm font-black text-neutral-900">{p.basePrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       {editingProductId === p.id ? (
                         <div className="flex items-center gap-2 ml-auto">
                            <button 
                              onClick={() => handleProductUpdate(p.id)}
                              disabled={updatingId === p.id}
                              className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all flex items-center gap-2"
                            >
                              {updatingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingProductId(null)}
                              className="px-4 py-2 bg-neutral-100 text-neutral-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-black transition-all"
                            >
                              Cancel
                            </button>
                         </div>
                       ) : (
                         <button 
                           onClick={() => startEditing(p)}
                           className="text-[10px] font-black uppercase tracking-widest text-neutral-300 hover:text-black transition-colors flex items-center gap-1 ml-auto"
                         >
                           <Settings className="w-3 h-3" /> Edit Item
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white border border-neutral-100 rounded-[2.5rem] overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-100 text-left">
              <thead className="bg-neutral-50/50">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Order ID & Item</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Customer</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">#{o.order.id.slice(0, 8)}</p>
                      <p className="text-sm font-black text-neutral-900 tracking-tighter uppercase italic leading-none">{o.product.name}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs font-black text-neutral-900 uppercase tracking-tighter">{o.order.user.name}</p>
                       <p className="text-[10px] font-bold text-neutral-400">{o.order.user.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        o.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border border-green-100' :
                        o.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' :
                        'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <select 
                        className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer"
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
