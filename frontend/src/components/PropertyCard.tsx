import React, { useState } from 'react';
import { Heart, Star, Box, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onLaunch3D: (property: Property) => void;
  currency: 'Mex$' | 'USD';
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onLaunch3D,
  currency,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (priceInMex: number) => {
    if (currency === 'USD') {
      const usd = Math.round(priceInMex / 18.5);
      return `$${usd.toLocaleString()}`;
    }
    return `Mex$${priceInMex.toLocaleString()}`;
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div
      onClick={() => onSelect(property)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col space-y-3 transition-all"
    >
      {/* Image Container with Soft Shadow and Glass Overlays */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-300">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* 3D Tour Badge (Matches Image 1) */}
        {property.has3dTour && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-xs text-[11px] font-bold text-neutral-900">
            <span className="w-2 h-2 rounded-full bg-[#BA0934] animate-pulse" />
            <span>3D TOUR</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(property.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-neutral-700 hover:text-[#BA0934] transition-all shadow-xs"
          title="Save to favorites"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#BA0934] text-[#BA0934]' : 'stroke-neutral-800'
            }`}
          />
        </button>

        {/* Image Carousel Controls on Hover */}
        {property.images.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 flex items-center justify-center hover:bg-white shadow-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 flex items-center justify-center hover:bg-white shadow-sm transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1">
            {property.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quick Launch 3D Walkthrough Button on Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLaunch3D(property);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#BA0934] hover:bg-[#a00829] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Launch Interactive 3D Tour</span>
          </button>
        </div>
      </div>

      {/* Property Details (Editorial Typography) */}
      <div className="flex flex-col space-y-0.5 px-0.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
            {property.location}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
            <Star className="w-3.5 h-3.5 fill-[#BA0934] text-[#BA0934]" />
            <span>{property.rating.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 font-normal truncate">
          {property.subtitle || property.title}
        </p>

        <p className="text-xs text-neutral-500 font-normal">
          {property.datesAvailable}
        </p>

        <div className="pt-1 flex items-baseline gap-1">
          <span className="text-sm font-bold text-neutral-900">
            {formatPrice(property.pricePerNight)}
          </span>
          <span className="text-xs font-normal text-neutral-500">
            night
          </span>
        </div>
      </div>
    </div>
  );
};
