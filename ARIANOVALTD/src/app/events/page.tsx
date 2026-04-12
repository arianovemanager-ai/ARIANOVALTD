import { EVENTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import EventList from "@/components/events/EventList";
import FadeInView from "@/components/shared/FadeInView";

export const revalidate = 0; // Ensuring live capacities from Stripe bypass cache

// Using explicit any[] temporarily pending strict Sanity Typescript generation mapping
export default async function EventsPage() {
  const events = await sanityFetch<any[]>({ query: EVENTS_QUERY });

  return (
    <div className="flex-1 flex flex-col bg-brand-bg min-h-screen">
      {/* Immersive Hero Header */}
      <section className="relative px-6 py-32 md:py-48 flex flex-col items-center justify-center text-center bg-brand-bg">
        {/* Deep, moody background gradient/image simulation */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-brand-surface to-brand-bg opacity-90 z-0 pointer-events-none" />

        <div className="relative z-10 max-w-2xl flex flex-col items-center">
          <FadeInView direction="up">
            <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-foreground/60 mb-6 font-light">
              Exclusive Invitations
            </h2>
            <h1 className="font-serif text-5xl md:text-7xl text-brand-accent mb-8 tracking-tight">
              Experiences.
            </h1>
            <p className="text-lg md:text-xl text-brand-foreground/80 tracking-wide leading-relaxed font-light">
              Step into our world. A curation of private tastings, vineyard explorations, and culinary intersections designed to transcend the bottle.
            </p>
          </FadeInView>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-bg to-transparent z-10" />
      </section>

      {/* Events Presentation Area */}
      <section className="container mx-auto max-w-6xl px-6 py-24 md:py-32 relative z-20">
        <EventList events={events} />
      </section>
    </div>
  );
}
