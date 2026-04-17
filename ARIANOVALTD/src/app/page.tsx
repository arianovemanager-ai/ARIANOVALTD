import { WINE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import WineGrid from "@/components/shared/WineGrid";
import { MotionButton } from "@/components/shared/MotionElements";
import FadeInView from "@/components/shared/FadeInView";
import ScrollLink from "@/components/shared/ScrollLink";
import VideoBackground from "@/components/shared/VideoBackground";

export const revalidate = 0; // Hard SSR bypass ensuring storefront grids update natively on backend database overrides

// Using explicit any for now until we auto-generate types from Sanity
export default async function Home() {
  const [wines, settings] = await Promise.all([
    sanityFetch<any[]>({ query: WINE_QUERY }),
    sanityFetch<any>({ query: SITE_SETTINGS_QUERY })
  ]);

  // Fallback defaults if Sanity fields are empty
  const headline = settings?.homeHeadline || "We design experiences.";
  const subheadline = settings?.homeSubheadline || "Every bottle is chosen to match a feeling, to elevate a moment, to turn a simple gathering into something rare.";
  const videoUrl = settings?.homeVideoUrl || "/media/Panoramic_zoom_out.mp4";
  const posterUrl = settings?.homePosterUrl || ""; // Default to Noir black

  return (
    <div className="flex-1 flex flex-col bg-brand-bg">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 min-h-screen overflow-hidden">
        <VideoBackground
          src={videoUrl}
          poster={posterUrl}
          overlayOpacity={0.65}
        />

        <div className="max-w-3xl flex flex-col items-center relative z-20">
          <FadeInView direction="up">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-foreground/60 mb-6">
              Refined • Curated • Unapologetically Different
            </h2>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-brand-foreground mb-8 tracking-tight">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-brand-foreground/80 tracking-wide mb-12 leading-relaxed font-light">
              {subheadline}
            </p>
            <ScrollLink href="#wines">
              <MotionButton
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-brand-surface text-brand-foreground tracking-widest text-xs font-semibold uppercase hover:bg-brand-accent/80 transition-all rounded-sm shadow-md hover:shadow-lg"
              >
                Explore the Portfolio
              </MotionButton>
            </ScrollLink>
          </FadeInView>
        </div>
      </section>

      {/* Identity Section */}
      <section className="bg-brand-surface text-brand-foreground py-32 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeInView direction="up">
            <div className="w-12 h-px bg-brand-bg/30 mx-auto mb-12" />
            <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-12 font-light italic">
              "A new air — refined, curated, and unapologetically different because wine is never just wine."
            </h2>
            <p className="text-lg md:text-xl text-brand-foreground/80 leading-relaxed font-light max-w-3xl mx-auto">
              Rooted in hospitality, guided by instinct, with an inevitable Italian touch and shaped by a New Zealand entrepreneurial vision, Arianova redefines value in wine.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Wine Grid */}
      <section id="wines" className="container mx-auto px-6 py-20 border-t border-brand-border/10">
        <div className="flex items-center justify-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-foreground tracking-wider text-center">
            The Portfolio
          </h2>
        </div>

        <WineGrid wines={wines} />
      </section>
    </div>
  );
}
