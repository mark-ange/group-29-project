<script setup lang="ts">
import { Sparkles, Layers, Box, Database, Shield, Server } from 'lucide-vue-next';
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    <!-- Header -->
    <div class="border-b border-neutral-200/80 pb-6">
      <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold mb-2">
        <Sparkles class="w-3.5 h-3.5 text-[#BA0934]" />
        <span>LuxeStay Editorial Design Tokens</span>
      </div>
      <h1 class="text-4xl font-extrabold tracking-tight text-[#1A1A1A]">Design System &amp; Stack Architecture</h1>
      <p class="text-base text-neutral-500 mt-2 max-w-3xl">
        A rigorous luxury design system pairing Swiss minimalist typography, high-contrast monochrome values, striking cherry red focal points, and hardware-accelerated 3D architectural rendering.
      </p>
    </div>

    <!-- Architecture Topology Card -->
    <div class="rounded-3xl bg-neutral-900 text-white p-8 shadow-xl border border-neutral-800 space-y-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-[#BA0934] flex items-center justify-center text-white">
          <Server class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold">End-to-End System Topology</h2>
          <p class="text-xs text-neutral-400">Strict client-mandated: Vue 3 + Laravel 10 + PostgreSQL 15</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-800">
        <!-- Frontend -->
        <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div class="flex items-center gap-2 text-[#BA0934] font-bold text-sm">
            <Box class="w-4 h-4" />
            <span>1. Frontend Layer</span>
          </div>
          <h3 class="text-lg font-bold text-white">Vue 3 + Three.js</h3>
          <p class="text-xs text-neutral-400 leading-relaxed">
            Reactive Pinia store, Vite HMR, procedural WebGL 3D villa rendering with customizable day/dusk/night lighting, and glassmorphism cards.
          </p>
        </div>

        <!-- Backend -->
        <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div class="flex items-center gap-2 text-[#BA0934] font-bold text-sm">
            <Shield class="w-4 h-4" />
            <span>2. Business Logic Layer</span>
          </div>
          <h3 class="text-lg font-bold text-white">Laravel 10 API</h3>
          <p class="text-xs text-neutral-400 leading-relaxed">
            BookingService with transactional concurrency control (`lockForUpdate()`), price calculation, date overlap validation, and host signature authorization.
          </p>
        </div>

        <!-- Database -->
        <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div class="flex items-center gap-2 text-[#BA0934] font-bold text-sm">
            <Database class="w-4 h-4" />
            <span>3. Source of Truth</span>
          </div>
          <h3 class="text-lg font-bold text-white">PostgreSQL 15</h3>
          <p class="text-xs text-neutral-400 leading-relaxed">
            Authoritative relational storage with ACID compliance, indexed booking date ranges, foreign key constraints, and zero client-side LocalStorage trust.
          </p>
        </div>
      </div>
    </div>

    <!-- Color Palette -->
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-[#1A1A1A]">Editorial Color System</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <!-- Cherry Red -->
        <div class="p-5 rounded-3xl bg-[#BA0934] text-white shadow-lg space-y-4">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">01</div>
          <div>
            <h4 class="font-extrabold text-base">Cherry Red</h4>
            <p class="text-xs text-white/80 font-mono">#BA0934</p>
            <p class="text-[11px] text-white/70 mt-1">Primary accent, reservation CTAs, active hotspots.</p>
          </div>
        </div>

        <!-- Deep Charcoal -->
        <div class="p-5 rounded-3xl bg-[#1A1A1A] text-white shadow-lg space-y-4">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">02</div>
          <div>
            <h4 class="font-extrabold text-base">Deep Charcoal</h4>
            <p class="text-xs text-white/80 font-mono">#1A1A1A</p>
            <p class="text-[11px] text-white/70 mt-1">Display headlines, high-contrast dark panels, footer.</p>
          </div>
        </div>

        <!-- Neutral Off-White -->
        <div class="p-5 rounded-3xl bg-white border border-neutral-200 text-neutral-900 shadow-sm space-y-4">
          <div class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs">03</div>
          <div>
            <h4 class="font-extrabold text-base">Pristine White</h4>
            <p class="text-xs text-neutral-500 font-mono">#FFFFFF / #FAFAFA</p>
            <p class="text-[11px] text-neutral-500 mt-1">Main surface canvas, card backgrounds, negative space.</p>
          </div>
        </div>

        <!-- Glassmorphism Token -->
        <div class="p-5 rounded-3xl glass-panel text-neutral-900 shadow-lg space-y-4">
          <div class="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-bold text-xs">04</div>
          <div>
            <h4 class="font-extrabold text-base">Glassmorphism</h4>
            <p class="text-xs text-neutral-500 font-mono">rgba(255,255,255,0.85)</p>
            <p class="text-[11px] text-neutral-500 mt-1">Blur 16px, 1px border. Floating UI cards and overlays.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Typography Scale -->
    <div class="rounded-3xl bg-white border border-neutral-200/80 p-8 shadow-sm space-y-6">
      <h3 class="text-lg font-bold text-[#1A1A1A]">Typography Scale (Manrope Geometric)</h3>
      <div class="space-y-4 divide-y divide-neutral-100 text-neutral-800">
        <div class="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <span class="text-xs font-mono text-neutral-400 w-32">Display XL (60px)</span>
          <span class="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1A1A1A]">Inhabiting the Edge</span>
        </div>
        <div class="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <span class="text-xs font-mono text-neutral-400 w-32">Heading L (30px)</span>
          <span class="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">The Pacific Monolith Malibu</span>
        </div>
        <div class="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <span class="text-xs font-mono text-neutral-400 w-32">Body (16px)</span>
          <span class="text-base text-neutral-600 max-w-xl">Curated private residences defined by radical modernist cantilevers and zero-edge reflection pools.</span>
        </div>
        <div class="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <span class="text-xs font-mono text-neutral-400 w-32">Micro Tracking (11px)</span>
          <span class="text-xs font-bold uppercase tracking-widest text-[#BA0934]">Architectural Sanctuary Collection</span>
        </div>
      </div>
    </div>
  </div>
</template>
