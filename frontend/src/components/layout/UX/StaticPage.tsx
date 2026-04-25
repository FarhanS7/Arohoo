"use client";

import React from "react";
import PageLayout from "./PageLayout";

interface StaticPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function StaticPage({ title, subtitle, children }: StaticPageProps) {
  return (
    <PageLayout>
      <div className="bg-white min-h-screen pt-32 pb-20">
        <div className="responsive-container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 mb-6 uppercase italic">
                {title}
              </h1>
              {subtitle && (
                <p className="text-neutral-500 text-sm md:text-lg font-medium tracking-widest uppercase">
                  {subtitle}
                </p>
              )}
              <div className="mt-8 flex justify-center">
                <div className="w-20 h-1 bg-neutral-900 rounded-full"></div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-neutral prose-sm md:prose-base max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-headings:font-black prose-p:text-neutral-600 prose-p:leading-relaxed prose-li:text-neutral-600">
              {children}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
