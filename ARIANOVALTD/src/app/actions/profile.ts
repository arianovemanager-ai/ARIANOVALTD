"use server"

import { auth, clerkClient } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import { revalidatePath } from 'next/cache'

export async function completeOnboarding(palatePreferences: string[], tastingFrequency: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1. Update Clerk Metadata securely bypassing generic sessions
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      hasOnboardingCompleted: true
    }
  });

  // 2. Lock the Sanity API Client explicitly writing to the mapped customer id
  // Utilize a transaction with createIfNotExists to absolutely prevent Race Conditions dynamically
  const customerId = `customer-${userId}`;
  const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });
  
  try {
    await writeClient.transaction()
      .createIfNotExists({ _id: customerId, _type: 'customer', clerkId: userId })
      .patch(customerId, p => p.setIfMissing({ palatePreferences: [] }).set({ palatePreferences, tastingFrequency }))
      .commit();
  } catch (sanityError) {
    console.error("Sanity Write Transaction Failed:", sanityError);
    throw new Error("Dossier syncing securely interrupted, please try again.");
  }

  // 3. Clear Next.js caching barriers ensuring the frontend syncs
  revalidatePath('/', 'layout');

  return { success: true };
}
