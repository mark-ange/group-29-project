"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import { getMotion, useReducedMotion } from "@/lib/motion";

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const touchDevice = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
    if (reducedMotion || touchDevice) return;

    const { gsap, ScrollTrigger } = getMotion();
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    const update = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return children;
}
