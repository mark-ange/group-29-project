import React, { useState } from 'react';
import { X, Box, Check, Sparkles } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  currency: 'Mex$' | 'USD';
}

const AMENITY_OPTIONS = [
  'Infinity Pool & Spa',
  'Private Beach Access',
  'Chef-grade Kitchen',
  '3D Architectural Walkthrough',
  'Tesla EV Chargers',
  'Private Helipad Access',
  'Butler & Concierge Service',
  'Private Cedar Onsen',
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  currency,
}) => {
  if (!isOpen) return null;

  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const toggleAmenity = (amenity: string) => {
    setLocalFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-bold text-neutral-900">Filters</h2>
          <button
            onClick={() => {
              onResetFilters();
              setLocalFilters({
                category: 'all',
                only3DTours: false,
                minPrice: 0,
                maxPrice: 100000,
                bedrooms: 'any',
                amenities: [],
                searchQuery: '',
              });
            }}
            className="text-xs font-semibold text-neutral-500 hover:text-[#BA0934] transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* Filter Options Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* 3D Tour Priority Toggle */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#BA0934] text-white flex items-center justify-center shadow-xs">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">3D Virtual Tours Only</h4>
                <p className="text-[11px] text-neutral-500">
                  Only show homes with verified interactive 3D spatial models.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setLocalFilters((prev) => ({ ...prev, only3DTours: !prev.only3DTours }))
              }
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                localFilters.only3DTours ? 'bg-[#BA0934]' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform ${
                  localFilters.only3DTours ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Price Range per night ({currency})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 font-semibold">Minimum</label>
                <input
                  type="number"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-800 focus:border-[#BA0934] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 font-semibold">Maximum</label>
                <input
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-800 focus:border-[#BA0934] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Bedrooms
            </h3>
            <div className="flex flex-wrap gap-2">
              {(['any', 2, 3, 4, 5, 6] as const).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setLocalFilters((prev) => ({ ...prev, bedrooms: num }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    localFilters.bedrooms === num
                      ? 'bg-[#BA0934] text-white shadow-xs'
                      : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {num === 'any' ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Featured Luxury Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const selected = localFilters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-[#BA0934] bg-rose-50/50 text-[#BA0934] font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span>{amenity}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-[#BA0934]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <button
            onClick={onClose}
            className="text-xs font-bold text-neutral-600 hover:underline cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-[#BA0934] hover:bg-[#a00829] text-white text-xs font-bold shadow-md shadow-[#BA0934]/20 transition-all cursor-pointer"
          >
            Show Properties
          </button>
        </div>
      </div>
    </div>
  );
};
