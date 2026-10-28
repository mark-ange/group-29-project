"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { getMotion, useReducedMotion } from "@/lib/motion";

export function AnimatedPropertyGrid({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !root.current) return;
    const { gsap } = getMotion();
    const context = gsap.context(() => {
      const cards = root.current?.querySelectorAll<HTMLElement>("[data-property-card]");
      if (!cards?.length) return;
      gsap.fromTo(cards, { autoAlpha: 0, y: 22 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return <div ref={root}>{children}</div>;
}
