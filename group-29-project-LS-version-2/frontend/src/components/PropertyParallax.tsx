"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef } from "react";
import { getMotion, useReducedMotion } from "@/lib/motion";

export function PropertyParallax({ src, alt, viewTransitionName }: { src?: string; alt: string; viewTransitionName: string }) {
  const section = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !section.current || !image.current) return;
    const { gsap } = getMotion();
    const context = gsap.context(() => {
      gsap.fromTo(image.current, { yPercent: -4 }, {
        yPercent: 4,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, section);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div ref={section} className="relative h-[42vh] min-h-[300px] max-h-[560px] overflow-hidden rounded-3xl bg-stone-200 sm:h-[54vh]">
      <div ref={image} className="absolute -inset-y-[6%] inset-x-0" style={{ viewTransitionName } as CSSProperties}>
        {src ? <Image src={src} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover" unoptimized /> : <div className="h-full bg-[linear-gradient(145deg,#d9dfd4,#c5cabb_50%,#b4b8aa)]" role="img" aria-label={alt} />}
      </div>
    </div>
  );
}
