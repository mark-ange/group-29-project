import React from 'react';
import { Box } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-200/80 bg-white py-8 mt-16 text-neutral-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Copyright (Matches Image 1) */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#BA0934] text-white flex items-center justify-center">
            <Box className="w-3 h-3" />
          </div>
          <span className="font-extrabold text-neutral-900">
            Luxe<span className="text-[#BA0934]">Stay</span>
          </span>
          <span className="text-neutral-300">•</span>
          <span className="text-neutral-400">© 2026 LuxeStay Inc. All rights reserved.</span>
        </div>

        {/* Editorial links (Matches Image 1) */}
        <div className="flex flex-wrap items-center gap-6 text-neutral-500">
          <a href="#privacy" className="hover:text-neutral-900 transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-neutral-900 transition-colors">
            Terms
          </a>
          <a href="#sitemap" className="hover:text-neutral-900 transition-colors">
            Sitemap
          </a>
          <a href="#company" className="hover:text-neutral-900 transition-colors">
            Company Details
          </a>
        </div>
      </div>
    </footer>
  );
};
