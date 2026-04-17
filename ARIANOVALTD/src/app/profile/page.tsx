import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { groq } from "next-sanity"
import MembershipCard from "@/components/profile/MembershipCard"
import PalatePreferences from "@/components/profile/PalatePreferences"
import { UserProfile } from "@clerk/nextjs"

export const revalidate = 0 

export default async function DossierPage() {
  const { userId } = await auth();
  
  // Hard interception block securely enforcing unauthenticated routing bounds structurally
  if (!userId) {
    redirect('/sign-in');
  }

  const customerId = `customer-${userId}`
  const user = await currentUser();

  // Retrieve exact Order Integer parameters and current customer structures completely
  const [customer, orderCount] = await Promise.all([
    sanityFetch<any>({
      query: groq`*[_type == "customer" && _id == $customerId][0]`,
      params: { customerId }
    }),
    sanityFetch<number>({
      query: groq`count(*[_type == "order" && customer._ref == $customerId])`,
      params: { customerId }
    })
  ]);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="font-serif text-4xl text-brand-foreground mb-2 tracking-wide">Member Dossier</h1>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/60 mb-8">
          Confidential Profile Settings
        </p>
        
        <MembershipCard 
          fullName={user?.fullName || customer?.fullName || "Arianova Member"}
          joinDate={user?.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()}
          orderCount={orderCount || 0}
        />
      </div>

      {/* Synchronized Palate Preferences Segments */}
      <div className="bg-brand-surface border border-brand-border rounded-sm shadow-2xl p-8">
        <h3 className="font-serif text-2xl text-brand-foreground mb-2">Palate Preferences</h3>
        <p className="text-sm text-brand-foreground/60 mb-8 font-medium">
          Configure your dossiers exclusively aligning personalized vintage layouts.
        </p>
        
        <PalatePreferences 
          initialPreferences={customer?.palatePreferences || []} 
          frequency={customer?.tastingFrequency || 'collector'} 
        />
      </div>

      {/* Explicit Security Integration Boundaries Custom Theme Mapping */}
      <div className="bg-brand-surface border border-brand-border rounded-sm shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 pb-0 border-b border-brand-border bg-brand-bg/40">
            <h3 className="font-serif text-2xl text-brand-foreground mb-2">Security Integrations</h3>
            <p className="text-sm text-brand-foreground/60 mb-6 font-medium">Native authentication parameters mapping safely mapped.</p>
        </div>
        <UserProfile 
          routing="hash"
          appearance={{
            elements: {
              card: "shadow-none border-none bg-transparent w-full max-w-none m-0",
              navbar: "hidden", // Completely strips sidebars natively
              pageScrollBox: "px-8 py-4",
              headerTitle: "hidden", 
              headerSubtitle: "hidden",
              profileSectionContent: "border-b border-brand-border pb-6 mb-6",
            }
          }}
        />
      </div>

    </div>
  )
}
