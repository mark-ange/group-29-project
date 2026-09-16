import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { ThreeVillaViewer } from './ThreeVillaViewer';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenVirtualTour: () => void;
  onOpenLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onOpenVirtualTour,
  onOpenLearnMore,
}) => {
  return (
    <section className="relative w-full pt-8 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Editorial Copy (Matches Image 1) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#BA0934]" />
              <span className="text-xs font-bold text-[#BA0934] uppercase tracking-wider">
                Virtual Spatial Architecture
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-neutral-900 tracking-tight leading-[1.08]">
              Experience Homes in{' '}
              <span className="text-[#BA0934]">Full 3D</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl">
              Explore interactive 3D floor plans and virtual tours before you book your stay.
              Step inside your next luxury getaway from anywhere.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-xl bg-[#BA0934] hover:bg-[#a00829] text-white text-sm font-bold shadow-md shadow-[#BA0934]/25 hover:shadow-lg hover:shadow-[#BA0934]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore 3D Listings</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLearnMore}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold border border-neutral-200 shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                Learn More
              </button>
            </div>

            {/* Micro Stats / Trust indicators */}
            <div className="pt-4 flex items-center gap-6 text-xs text-neutral-500 border-t border-neutral-100">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-800">100%</span> Verified 3D Scans
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-300" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-800">8K</span> Virtual Panoramas
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-300" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-800">24/7</span> Private Concierge
              </div>
            </div>
          </div>

          {/* Right Live 3D Preview (Matches Image 1) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-neutral-200/50 to-neutral-100/30 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-200/60">
              <div className="h-[420px] sm:h-[460px] w-full rounded-2xl overflow-hidden relative">
                <ThreeVillaViewer onExpand={onOpenVirtualTour} />
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#BA0934]/5 rounded-full blur-3xl pointer-events-none -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
