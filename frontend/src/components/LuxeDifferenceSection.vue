<script setup lang="ts">
import { ShieldCheck, UserCheck, Sparkles, Utensils, Compass, Award, ArrowRight } from 'lucide-vue-next';
import { usePropertyStore } from '../stores/properties';

const propertyStore = usePropertyStore();

const pillars = [
  {
    icon: ShieldCheck,
    title: '300+ Point Inspection',
    badge: 'Certified Quality',
    description:
      'Every home is personally evaluated in person across 300+ design, safety, and quality standards—from architectural integrity and water pressure to premium thread counts and acoustic privacy.',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Trip Designer',
    badge: 'Included With Stay',
    description:
      'A personal luxury concierge coordinates your entire journey: private airport chauffeur, bespoke itineraries, equipment rental, childcare, and on-demand helicopter or yacht charters.',
  },
  {
    icon: Utensils,
    title: 'Bespoke In-Villa Services',
    badge: 'Tailored Luxury',
    description:
      'Indulge with Michelin-trained private chefs, pre-stocked artisan pantries, licensed massage therapists, sommelier wine tastings, and daily housekeeping discreetly tailored to your rhythm.',
  },
];
</script>

<template>
  <section class="py-16 bg-neutral-50 text-neutral-900 relative overflow-hidden my-12 rounded-3xl mx-4 sm:mx-6 lg:mx-8 border border-neutral-200 shadow-xs">
    <!-- Subtle architectural background glow -->
    <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#BA0934]/5 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-200">
        <div class="space-y-3 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold tracking-wide shadow-xs">
            <Sparkles class="w-3.5 h-3.5 text-[#BA0934]" />
            <span>The Airbnb Luxe Standard</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Extraordinary retreats, <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-[#BA0934]">
              elevated by human craft.
            </span>
          </h2>
          <p class="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Airbnb Luxe represents the absolute pinnacle of vacation living. Every sanctuary is hand-selected and paired with a personal Trip Designer to craft an effortless, unforgettable escape.
          </p>
        </div>

        <button
          @click="propertyStore.openTripDesigner()"
          class="self-start md:self-auto px-6 py-3 rounded-full bg-[#BA0934] hover:bg-[#960729] text-white text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
        >
          <span>Connect With Trip Designer</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <!-- 3 Pillars Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-12">
        <div
          v-for="(pillar, idx) in pillars"
          :key="idx"
          class="p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-300 transition-all hover:-translate-y-1 space-y-4 min-w-0 shadow-xs"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-[#BA0934] shrink-0">
              <component :is="pillar.icon" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 shrink-0">
              {{ pillar.badge }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-neutral-900 tracking-tight break-words">
            {{ pillar.title }}
          </h3>

          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed break-words">
            {{ pillar.description }}
          </p>
        </div>
      </div>

      <!-- Inspection Assurance Strip -->
      <div class="mt-12 p-4 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-600 min-w-0 shadow-xs">
        <div class="flex items-center gap-3 min-w-0">
          <Award class="w-5 h-5 text-amber-500 shrink-0" />
          <span class="break-words">
            <strong class="text-neutral-900">Guaranteed Architectural Integrity:</strong>
            All properties are verified for authentic designer blueprints, soundproofing, and pristine maintenance.
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-neutral-500 font-medium shrink-0">
          <span>• 24/7 Concierge</span>
          <span>• Full-Refund Guarantee</span>
          <span>• High-Speed Starlink</span>
        </div>
      </div>
    </div>
  </section>
</template>
