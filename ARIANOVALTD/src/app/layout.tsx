import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/shared/Navbar";
import CartSidebar from "@/components/shared/CartSidebar";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arianova | The Pinnacle of Viticulture",
  description: "Curated vintage collections reserved for the modern connoisseur.",
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
            actionLink: 'Join the Membership'
          }
        },
        signUp: {
          start: {
            title: 'JOIN THE MEMBERSHIP',
            subtitle: 'Acquire exclusive allocations from the world\'s finest estates.',
            actionText: 'Already a member?',
            actionLink: 'Access the Collection'
          }
        }
      }}
      appearance={{
        variables: {
          colorPrimary: "#4A0404",
          colorBackground: "#F5F5DC",
        },
        elements: {
          card: "bg-[#F5F5DC]",
          headerTitle: "font-serif text-[#4A0404]",
          headerSubtitle: "text-[#4A0404]/80",
          formButtonPrimary: "bg-[#4A0404] hover:bg-[#3A0303] text-[#F5F5DC]",
        },
      }}
    >
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col font-serif">
          <CartProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <CartSidebar />
            <Toaster 
              position="bottom-center"
              toastOptions={{
                style: { background: '#F9F6EE', color: '#4A0404', borderColor: 'rgba(74, 4, 4, 0.1)', flexWrap: 'nowrap' }
              }}
            />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
