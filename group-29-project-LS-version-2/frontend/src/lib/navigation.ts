import { startTransition } from "react";

type Router = { push: (href: string) => void };
type TransitionDocument = Document & { startViewTransition?: (callback: () => void) => unknown };

export function propertyImageViewTransitionName(slug: string) {
  return `property-image-${slug.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`;
}

export function navigateWithTransition(router: Router, href: string, reducedMotion = false) {
  const transitionDocument = document as TransitionDocument;
  if (!reducedMotion && transitionDocument.startViewTransition) {
    transitionDocument.startViewTransition(() => startTransition(() => router.push(href)));
    return;
  }
  router.push(href);
}
