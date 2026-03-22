import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/studio(.*)', '/account(.*)', '/profile(.*)', '/cellar(.*)'])
const isOnboardingRoute = createRouteMatcher(['/onboarding'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // Custom Metadata Claim Parse
  const metadata = sessionClaims?.metadata as { hasOnboardingCompleted?: boolean } | undefined;
  const hasOnboardingCompleted = metadata?.hasOnboardingCompleted === true;
  
  // Block un-onboarded users securely enforcing `/onboarding`
  if (userId && !hasOnboardingCompleted && !isOnboardingRoute(req)) {
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
  }

  // Prevent onboarded users from looping back
  if (userId && hasOnboardingCompleted && isOnboardingRoute(req)) {
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl);
  }

  // Protect designated layouts natively
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
