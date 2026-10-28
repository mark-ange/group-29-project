export default function Loading() {
  return <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-16 sm:px-8" aria-busy="true" aria-label="Loading StayNest"><div className="h-8 w-48 animate-pulse rounded bg-stone-200" /><div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="animate-pulse"><div className="aspect-[4/3] rounded-2xl bg-stone-200" /><div className="mt-4 h-4 w-2/3 rounded bg-stone-200" /></div>)}</div></main>;
}
