import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Minus,
  Maximize2,
  Compass,
  Layers,
  MapPin,
  Sparkles,
  Info,
  ChevronDown,
  Box,
  Eye,
  Camera,
} from 'lucide-react';
import { Property, VirtualTourRoom, VirtualHotspot } from '../types';
import { ThreeVillaViewer } from './ThreeVillaViewer';

interface VirtualTourModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const rooms: VirtualTourRoom[] = property.virtualTourRooms && property.virtualTourRooms.length > 0
    ? property.virtualTourRooms
    : [
        {
          id: 'room-1',
          name: 'Villa Kinkaku - Living Space',
          subtitle: 'Double-height sunken lounge with panoramic ocean view',
          imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85',
          floor: 1,
          hotspots: [
            { id: 'hs-1', title: 'Acoustic Wood Paneling', description: 'Hand-milled Japanese white cedar slat walls with integrated soft-glow LED backlighting.', x: 28, y: 44 },
            { id: 'hs-2', title: 'Sunken Seating Lounge', description: 'Custom Italian mohair sectional wrapping an open floating hearth.', x: 52, y: 68 },
            { id: 'hs-3', title: 'Motorized Glazing', description: '24-foot motorized glass panes that retract completely into the concrete wall pocket.', x: 78, y: 35 },
          ],
        },
        {
          id: 'room-2',
          name: 'Cantilever Infinity Terrace',
          subtitle: 'Suspended travertine deck over the Pacific surf',
          imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=85',
          floor: 1,
          hotspots: [
            { id: 'hs-4', title: 'Zero-Edge Saline Pool', description: 'Heated to a consistent 86°F with perimeter fiber-optic underwater lighting.', x: 45, y: 55 },
          ],
        },
      ];

  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<VirtualHotspot | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showFloorplan, setShowFloorplan] = useState(false);
  const [viewMode, setViewMode] = useState<'360-tour' | '3d-mesh'>('360-tour');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  const currentRoom = rooms[activeRoomIndex];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(2.5, z + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel((z) => Math.max(1, z - 0.25));
    if (zoomLevel <= 1.25) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Top Header Bar (Matches Image 5) */}
        <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
          {/* Room Selector Pill */}
          <div className="pointer-events-auto relative">
            <button
              onClick={() => setShowRoomDropdown(!showRoomDropdown)}
              className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-neutral-900 text-xs font-bold backdrop-blur-md shadow-lg flex items-center gap-2 border border-white/60 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#BA0934]" />
              <span>{currentRoom.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {showRoomDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl border border-neutral-100 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400">
                  Select Space
                </div>
                {rooms.map((room, idx) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoomIndex(idx);
                      setActiveHotspot(null);
                      setShowRoomDropdown(false);
                      setZoomLevel(1);
                      setPanPosition({ x: 0, y: 0 });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeRoomIndex === idx
                        ? 'bg-[#BA0934]/10 text-[#BA0934]'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <p className="font-bold">{room.name}</p>
                    <p className="text-[10px] text-neutral-400">{room.subtitle}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mode Switcher & Close Button */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center text-xs">
              <button
                onClick={() => setViewMode('360-tour')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  viewMode === '360-tour' ? 'bg-[#BA0934] text-white' : 'text-neutral-300 hover:text-white'
                }`}
              >
                360° Interior
              </button>
              <button
                onClick={() => setViewMode('3d-mesh')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  viewMode === '3d-mesh' ? 'bg-[#BA0934] text-white' : 'text-neutral-300 hover:text-white'
                }`}
              >
                3D Architecture Mesh
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Viewport */}
        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
          {viewMode === '3d-mesh' ? (
            <div className="w-full h-full">
              <ThreeVillaViewer showControls={true} />
            </div>
          ) : (
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`w-full h-full relative overflow-hidden flex items-center justify-center ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Panoramic Background Image */}
              <div
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
                className="w-full h-full relative"
              >
                <img
                  src={currentRoom.imageUrl}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />

                {/* Hotspot Interactive Markers (Matches Image 5) */}
                {currentRoom.hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot?.id === hs.id ? null : hs);
                      }}
                      className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-[#BA0934] text-white shadow-lg cursor-pointer hover:scale-115 transition-transform"
                    >
                      <span className="absolute inset-0 rounded-full bg-[#BA0934] animate-ping opacity-50" />
                      <Sparkles className="w-3.5 h-3.5 relative z-10" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Active Hotspot Tooltip Card */}
              {activeHotspot && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 max-w-sm w-[90%] p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl text-neutral-900 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#BA0934]">
                      Architectural Detail
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-neutral-400 hover:text-neutral-700 text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">{activeHotspot.title}</h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {activeHotspot.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floorplan Overlay Modal (Matches Floorplan button in Image 5) */}
        {showFloorplan && (
          <div className="absolute inset-x-8 inset-y-16 z-30 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 border border-neutral-200 shadow-2xl flex flex-col justify-between animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#BA0934]" />
                <h3 className="text-base font-bold text-neutral-900">
                  Architectural Floor Plan • Level 01
                </h3>
              </div>
              <button
                onClick={() => setShowFloorplan(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Floorplan Blueprint Graphic */}
            <div className="flex-1 my-4 rounded-2xl bg-neutral-900 p-6 flex items-center justify-center relative overflow-hidden border border-neutral-800">
              {/* Subtle grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

              <svg viewBox="0 0 600 380" className="w-full max-w-lg h-auto stroke-neutral-300 fill-none stroke-[1.5]">
                {/* Outer walls */}
                <rect x="50" y="50" width="500" height="280" rx="4" className="stroke-white stroke-[2.5]" />
                {/* Sunken Lounge Room */}
                <rect x="50" y="50" width="260" height="280" className="stroke-neutral-500 stroke-dasharray-[4,4]" />
                <text x="180" y="190" fill="#BA0934" fontSize="14" fontWeight="bold" textAnchor="middle">
                  Sunken Living Space
                </text>
                {/* Infinity Pool deck */}
                <rect x="310" y="50" width="240" height="150" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" />
                <text x="430" y="130" fill="#06b6d4" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Zero-Edge Pool (60ft)
                </text>
                {/* Master Suite */}
                <rect x="310" y="200" width="240" height="130" className="stroke-neutral-500" />
                <text x="430" y="270" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Ocean Suite & Spa
                </text>
              </svg>
            </div>

            <p className="text-xs text-neutral-500 text-center">
              Total Interior: 7,800 sq ft • Exterior Cantilever Deck: 3,400 sq ft
            </p>
          </div>
        )}

        {/* Bottom Floating Control Bar (Matches Image 5: Zoom -/+, Reset, Floorplan) */}
        <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-2xl border border-white/60">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-neutral-800 w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-4 bg-neutral-200" />

            {/* Reset view */}
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanPosition({ x: 0, y: 0 });
              }}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 transition-colors"
              title="Reset View Orientation"
            >
              <Compass className="w-4 h-4 text-[#BA0934]" />
            </button>

            {/* Floorplan toggle */}
            <button
              onClick={() => setShowFloorplan(!showFloorplan)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                showFloorplan
                  ? 'bg-[#BA0934] text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Floorplan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
