import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/shared/Navbar";
import CartSidebar from "@/components/shared/CartSidebar";
import { Toaster } from "sonner";
import Footer from "@/components/shared/Footer";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Arianova | Curation of Emotion & Italian Excellence",
  description: "We don't just select wines — we design experiences. Every bottle is chosen to match a feeling, to elevate a moment, to turn a gathering into something rare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        formButtonPrimary: 'ACCESS THE COLLECTION',
        signIn: {
          start: {
            title: 'MEMBER ACCESS | ARIANOVA CURATORS',
            subtitle: 'Welcome back to the Portfolio. Enter the cellar to view your private collection.',
            actionText: 'New to the curation?',
            actionLink: 'Join the Curation'
          }
        },
        signUp: {
          start: {
            title: 'JOIN THE CURATION',
            subtitle: 'Acquire exclusive allocations from the world\'s finest estates.',
            actionText: 'Already a member?',
            actionLink: 'Access the Collection'
          }
        }
      }}
      appearance={{
        variables: {
          colorPrimary: "#D4AF37",
          colorBackground: "#0B0B0B",
          colorText: "#F5F5F5",
          colorInputText: "#F5F5F5",
          colorInputBackground: "#1A1A1A",
        },
        elements: {
          card: "bg-brand-surface border border-brand-border",
          headerTitle: "font-serif text-brand-foreground",
          headerSubtitle: "text-brand-foreground/80",
          formButtonPrimary: "bg-brand-foreground hover:bg-brand-accent text-brand-bg font-bold tracking-widest uppercase transition-colors",
        },
      }}
    >
      <html lang="en" className={`h-full antialiased dark ${inter.variable} ${cormorant.variable}`}>
        <body className="min-h-full flex flex-col font-sans selection:bg-brand-accent/30 selection:text-brand-accent">
          <CartProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <CartSidebar />
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: { background: '#1A1A1A', color: '#F5F5F5', borderColor: 'rgba(245, 245, 245, 0.1)', flexWrap: 'nowrap' }
              }}
            />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
