import React from 'react';
import { Box, Scan, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CalloutBannerProps {
  onLaunchExplorer: () => void;
}

export const CalloutBanner: React.FC<CalloutBannerProps> = ({ onLaunchExplorer }) => {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#18181b] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-neutral-800">
          {/* Subtle Ambient Red Light Effect */}
          <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 bg-[#BA0934]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-rose-300">
                <Sparkles className="w-3.5 h-3.5 text-[#BA0934]" />
                Next-Gen Pre-Arrival Experience
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Step Inside Before <br className="hidden sm:inline" />
                You Arrive
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Experience the layout, sightlines, and ambiance of our most premium listings
                with immersive, high-fidelity 3D walkthroughs. No surprises, just perfect anticipation.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onLaunchExplorer}
                  className="px-7 py-3.5 rounded-xl bg-[#BA0934] hover:bg-[#a00829] text-white text-sm font-bold shadow-lg shadow-[#BA0934]/30 hover:shadow-xl hover:shadow-[#BA0934]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>Launch 3D Explorer</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Right 3D Wireframe Hologram Visual (Matches Image 1) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Outer rotating rhombus/diamond */}
                <div className="absolute inset-4 border border-[#BA0934]/40 rounded-3xl rotate-45 animate-pulse" />
                
                {/* Secondary inner ring */}
                <div className="absolute inset-10 border border-white/10 rounded-2xl -rotate-12" />

                {/* Center Glowing Neon 3D Cube Icon */}
                <div className="relative z-10 w-24 h-24 rounded-2xl bg-black/60 border border-[#BA0934]/60 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(186,9,52,0.45)] group">
                  <Scan className="w-12 h-12 text-[#BA0934] stroke-[1.75] animate-bounce" />
                </div>

                {/* Floating Architectural Annotation Badges */}
                <div className="absolute top-4 left-0 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-300">
                  FOV: 84° • 0.02mm Tol.
                </div>
                <div className="absolute bottom-6 right-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-mono text-rose-400">
                  Spatial LiDaR Scan v4.2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
