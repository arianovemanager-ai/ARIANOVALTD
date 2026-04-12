import FadeInView from "@/components/shared/FadeInView"
import Link from "next/link"
import Image from "next/image"
import VideoBackground from "@/components/shared/VideoBackground"
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import { sanityFetch } from "@/sanity/lib/fetch"

export default async function VineyardPage() {
  const settings = await sanityFetch<any>({ query: SITE_SETTINGS_QUERY });
  
  // Fallbacks
  const headline = settings?.vineyardHeadline || "Partner Estates";
  const videoUrl = settings?.vineyardVideoUrl || "/media/Panoramic_side.mp4";
  const posterUrl = settings?.vineyardPosterUrl || "";

  return (
    <div className="w-full bg-brand-bg">
      {/* 1. The Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <VideoBackground 
          src={videoUrl} 
          overlayOpacity={0.5} 
          poster={posterUrl}
        />
        
        <FadeInView direction="up" delay={0.2} duration={0.8} className="relative z-20 text-center px-6">
          <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-brand-foreground/80 mb-6 font-semibold">
            Arianova Curators
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-brand-foreground tracking-wide drop-shadow-2xl mb-8">
            {headline}
          </h1>
        </FadeInView>
      </section>

      {/* 2. Partner One Showcase */}
      <section className="py-32 px-6 bg-brand-bg w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInView direction="up" className="order-2 lg:order-1">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-foreground mb-4">Tenute Dello Jato</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/60 mb-8 mt-2">
              Exclusively Partnered with the Dello Jato Estate
            </p>
            <div className="w-12 h-px bg-brand-surface/30 mb-8" />
            <p className="font-sans text-lg text-brand-foreground/80 leading-relaxed font-light mb-8">
              Situated in the heart of the Italian countryside, Tenute Dello Jato represents the essence of sustainable, low-yield viticulture. ARIANOVA serves as the exclusive distribution partner for their most sought-after reserves, guaranteeing a direct pipeline from their historic cellars to your premium retail and hospitality venues.
            </p>
            <Link 
              href="/" 
              className="inline-block border border-brand-border text-brand-foreground hover:bg-brand-surface hover:text-brand-foreground px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all"
            >
              Explore the Collection
            </Link>
          </FadeInView>
          <FadeInView direction="left" className="order-1 lg:order-2 h-96 lg:h-[500px] relative overflow-hidden rounded-sm">
            <Image 
              src="/images/grape_macro_noir.png"
              alt="Macro Grapes Tenute Dello Jato"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </FadeInView>
        </div>
      </section>

      {/* 3. Partner Two Showcase */}
      <section className="py-32 px-6 bg-brand-surface text-brand-foreground w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInView direction="right" className="h-96 lg:h-[500px] relative overflow-hidden rounded-sm">
            <Image 
              src="/images/cellar_editorial_noir.png"
              alt="Private Cellar Tenute Fosca"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </FadeInView>
          <FadeInView direction="up">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Tenute Fosca</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/60 mb-8 mt-2">
              Exclusively Sourced from the Fosca Vineyards
            </p>
            <div className="w-12 h-px bg-brand-bg/30 mb-8" />
            <p className="font-sans text-lg text-brand-foreground/80 leading-relaxed font-light mb-8">
              A fiercely independent estate renowned for its uncompromising quality and terroir-driven expressions. We secure deep allocations of Tenute Fosca's flagship vintages, managing complex compliance and temperature-controlled logistics to supply your business with zero friction.
            </p>
            <Link 
              href="/" 
              className="inline-block border border-brand-border text-brand-foreground hover:bg-brand-bg hover:text-brand-foreground px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all"
            >
              Explore the Collection
            </Link>
          </FadeInView>
        </div>
      </section>
    </div>
  )
}
