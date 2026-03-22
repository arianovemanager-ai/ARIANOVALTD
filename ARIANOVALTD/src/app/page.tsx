import { WINE_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import WineGrid from "@/components/shared/WineGrid";
import { MotionButton } from "@/components/shared/MotionElements";

export const revalidate = 0; // Hard SSR bypass ensuring storefront grids update natively on backend database overrides

// Using explicit any[] for now until we auto-generate types from Sanity
export default async function Home() {
  const wines = await sanityFetch<any[]>({ query: WINE_QUERY });

  return (
    <div className="flex-1 flex flex-col bg-[#F9F6EE]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-40 min-h-[60vh]">
        <div className="max-w-3xl flex flex-col items-center">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4A0404]/60 mb-6">
            Established 1984
          </h2>
          <h1 className="font-serif text-5xl md:text-7xl text-[#4A0404] mb-8 tracking-tight">
            The Pinnacle of Viticulture
          </h1>
          <p className="text-lg md:text-xl text-[#4A0404]/80 tracking-wide mb-12 leading-relaxed font-light">
            Browse our exclusive reserves and limited vintage collections. Curated for the modern connoisseur, accessible directly from our private cellars to your table.
          </p>
          <MotionButton 
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-[#4A0404] text-[#F9F6EE] tracking-widest text-xs font-semibold uppercase hover:bg-[#3A0303] transition-all rounded-sm shadow-md hover:shadow-lg"
          >
            Explore The Cellar
          </MotionButton>
        </div>
      </section>

      {/* Wine Grid */}
      <section className="container mx-auto px-6 py-20 border-t border-[#4A0404]/10">
        <div className="flex items-center justify-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-[#4A0404] tracking-wider text-center">
            New Arrivals
          </h2>
        </div>

          <WineGrid wines={wines} />
      </section>
    </div>
  );
}
