"use client";

import { useEffect, useRef } from "react";
import { getMotion, useReducedMotion } from "@/lib/motion";

export function AnimatedHeadline({ words, breakAfter, className = "" }: { words: string[]; breakAfter?: number; className?: string }) {
  const root = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !root.current) return;
    const { gsap } = getMotion();
    const context = gsap.context(() => {
      const items = root.current?.querySelectorAll<HTMLElement>("[data-headline-word]");
      if (!items?.length) return;
      gsap.fromTo(items, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.075, ease: "power2.out", clearProps: "transform,opacity,visibility" });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <h1 ref={root} className={className}>
      <span className="sr-only">{words.join(" ")}</span>
      <span aria-hidden="true">{words.map((word, index) => <span key={`${word}-${index}`}>{index === breakAfter && <br className="hidden sm:block" />}<span data-headline-word className="inline-block">{word}</span>{index < words.length - 1 ? " " : ""}</span>)}</span>
    </h1>
  );
}
