import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/auth';
import prismaClient from '@/lib/prismadb';
import { z } from 'zod';

const walletUpdateSchema = z.object({
  address: z.string().nullable(),
  isConnected: z.boolean(),
  caipAddress: z.string().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = walletUpdateSchema.parse(body);

    // Find or create wallet record
    const wallet = await prismaClient.wallet.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        address: validatedData.address || undefined,
        isConnected: validatedData.isConnected,
        caipAddress: validatedData.caipAddress || undefined,
      },
      create: {
        userId: session.user.id,
        address: validatedData.address || '',
        isConnected: validatedData.isConnected,
        caipAddress: validatedData.caipAddress || '',
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Wallet updated successfully',
      data: wallet,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Wallet update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
