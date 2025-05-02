// app/api/onboarding/complete/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/config/auth';
import prismaClient from '@/lib/prismadb';

const finalOnboardingSchema = z.object({
  role: z.enum(['INVESTOR', 'CREATOR']),
  name: z.string().min(2),
  bio: z.string().optional(),
  location: z.string().optional(),
  walletAddress: z.string().optional(),
  image: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.onboarded)
      return NextResponse.json(
        {
          message: 'onboarding already completed',
        },
        {
          status: 200,
        }
      );

    const body = await req.json();
    const validatedData = finalOnboardingSchema.parse(body);

    // Update user profile
    const updatedUser = await prismaClient.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        displayName: validatedData.name,
        role: validatedData.role,
        bio: validatedData.bio,
        location: validatedData.location,
        image: validatedData.image,
        walletAddress: validatedData.walletAddress,
        onboarded: true,
        emailVerified: new Date(Date.now()),
      },
    });

    // If wallet address is provided, create/update wallet
    if (validatedData.walletAddress) {
      await prismaClient.wallet.upsert({
        where: {
          userId: updatedUser.id,
        },
        update: {
          address: validatedData.walletAddress,
          isConnected: true,
        },
        create: {
          address: validatedData.walletAddress,
          isConnected: true,
          userId: updatedUser.id,
          caipAddress: validatedData.walletAddress,
          status: 'CONNECTED',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          role: updatedUser.role,
          bio: updatedUser.bio,
          location: updatedUser.location,
          image: updatedUser.image,
          onboarded: updatedUser.onboarded,
          walletAddress: updatedUser.walletAddress,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Onboarding completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
