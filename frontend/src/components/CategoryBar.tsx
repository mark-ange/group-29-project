import React from 'react';
import { Flame, Box, Waves, Home, Castle, Landmark, SlidersHorizontal } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenFilters: () => void;
  filtersCount?: number;
}

const CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: '3d-tours', label: '3D Tours', icon: Box },
  { id: 'beachfront', label: 'Beachfront', icon: Waves },
  { id: 'cabins', label: 'Cabins', icon: Home },
  { id: 'mansions', label: 'Mansions', icon: Castle },
  { id: 'modernist', label: 'Modernist', icon: Landmark },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenFilters,
  filtersCount = 0,
}) => {
  return (
    <div className="w-full border-b border-neutral-200/80 bg-[#FAFAFA] py-4 sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Category Icons */}
        <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 group relative pb-2 transition-all cursor-pointer whitespace-nowrap focus:outline-hidden ${
                  isActive ? 'text-[#BA0934]' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <div className="transition-transform group-hover:-translate-y-0.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                </div>
                <span className={`text-xs ${isActive ? 'font-bold text-neutral-900' : 'font-medium'}`}>
                  {cat.label}
                </span>

                {/* Active Indicator Bar (Cherry Red) */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#BA0934] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 shadow-2xs hover:shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {filtersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#BA0934] text-white text-[10px] flex items-center justify-center font-bold">
              {filtersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
