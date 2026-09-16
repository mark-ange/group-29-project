import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  Share2,
  Box,
  Users,
  Bed,
  Bath,
  Maximize2,
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunch3D: (property: Property) => void;
  currency: 'Mex$' | 'USD';
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onLaunch3D,
  currency,
  isFavorite = false,
  onToggleFavorite,
}) => {
  if (!isOpen || !property) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [nights, setNights] = useState(5);
  const [guests, setGuests] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const formatPrice = (priceInMex: number) => {
    if (currency === 'USD') {
      const usd = Math.round(priceInMex / 18.5);
      return `$${usd.toLocaleString()}`;
    }
    return `Mex$${priceInMex.toLocaleString()}`;
  };

  const basePrice = currency === 'USD' ? Math.round(property.pricePerNight / 18.5) : property.pricePerNight;
  const subtotal = basePrice * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const cleaningFee = currency === 'USD' ? 450 : 8500;
  const total = subtotal + serviceFee + cleaningFee;

  const handleBook = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 my-auto">
        {/* Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#BA0934] uppercase tracking-wider">
              {property.architecturalStyle}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs text-neutral-500">{property.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite?.(property.id)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#BA0934] text-[#BA0934]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Main Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-2xl overflow-hidden shadow-md bg-neutral-900 group">
              <img
                src={property.images[activeImageIdx]}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* 3D Walkthrough Floating Overlay Button */}
              {property.has3dTour && (
                <div className="absolute bottom-4 right-4 z-10">
                  <button
                    onClick={() => onLaunch3D(property)}
                    className="px-5 py-3 rounded-xl bg-[#BA0934] hover:bg-[#a00829] text-white text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer hover:scale-105"
                  >
                    <Box className="w-4 h-4" />
                    <span>Launch 3D Spatial Walkthrough</span>
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx ? 'border-[#BA0934] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Grid: Details & Booking Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Architectural Story */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {property.title}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">{property.subtitle}</p>

                {/* Micro Key Metrics */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-700 mt-4 py-3 border-y border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#BA0934]" />
                    <span>{property.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-[#BA0934]" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-[#BA0934]" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-[#BA0934]" />
                    <span>{property.sqft.toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Architectural Narrative
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Curated Villa Amenities
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs font-medium text-neutral-800"
                    >
                      <Check className="w-3.5 h-3.5 text-[#BA0934]" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Profile */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={property.host.avatar}
                    alt={property.host.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-neutral-900">
                        Hosted by {property.host.name}
                      </h4>
                      {property.host.isSuperhost && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#BA0934] text-[10px] font-bold">
                          Superhost
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400">Response: {property.host.responseRate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                  <Star className="w-4 h-4 fill-[#BA0934] text-[#BA0934]" />
                  <span>{property.rating} ({property.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Reservation Widget */}
            <div className="lg:col-span-5 sticky top-24 p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-lg space-y-5">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-neutral-900">
                    {formatPrice(property.pricePerNight)}
                  </span>
                  <span className="text-xs text-neutral-500">/ night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
                  <Star className="w-3.5 h-3.5 fill-[#BA0934] text-[#BA0934]" />
                  <span>{property.rating}</span>
                </div>
              </div>

              {/* Dates and Guests Input Box */}
              <div className="rounded-2xl border border-neutral-200 overflow-hidden divide-y divide-neutral-200 text-xs">
                <div className="grid grid-cols-2 divide-x divide-neutral-200 p-3 bg-neutral-50/50">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Check-in</span>
                    <p className="font-bold text-neutral-900 mt-0.5">Oct 12, 2024</p>
                  </div>
                  <div className="pl-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Check-out</span>
                    <p className="font-bold text-neutral-900 mt-0.5">Oct 17, 2024</p>
                  </div>
                </div>
                <div className="p-3 bg-neutral-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Guests</span>
                    <p className="font-bold text-neutral-900 mt-0.5">{guests} Adults (up to {property.maxGuests})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                      className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-neutral-600 border-b border-neutral-100 pb-4">
                <div className="flex justify-between">
                  <span>{formatPrice(property.pricePerNight)} x {nights} nights</span>
                  <span className="font-semibold text-neutral-900">{currency === 'USD' ? `$${subtotal.toLocaleString()}` : `Mex$${subtotal.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Concierge & Spatial Scan fee</span>
                  <span className="font-semibold text-neutral-900">{currency === 'USD' ? `$${serviceFee.toLocaleString()}` : `Mex$${serviceFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Villa turnover service</span>
                  <span className="font-semibold text-neutral-900">{currency === 'USD' ? `$${cleaningFee.toLocaleString()}` : `Mex$${cleaningFee.toLocaleString()}`}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between text-sm font-extrabold text-neutral-900">
                <span>Total</span>
                <span className="text-base text-[#BA0934]">
                  {currency === 'USD' ? `$${total.toLocaleString()}` : `Mex$${total.toLocaleString()}`}
                </span>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                className="w-full py-3.5 rounded-xl bg-[#BA0934] hover:bg-[#a00829] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#BA0934]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {bookingSuccess ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Reservation Confirmed!
                  </span>
                ) : (
                  <span>Reserve with 3D Guarantee</span>
                )}
              </button>

              <p className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>You won't be charged yet. 100% money-back 3D accuracy guarantee.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
