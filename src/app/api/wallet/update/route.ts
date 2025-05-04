import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/auth';
import prismaClient from '@/lib/prismadb';
import { z } from 'zod';

const walletUpdateSchema = z.object({
  address: z.string().nullable(),
  isConnected: z.boolean(),
  caipAddress: z.string().nullable(),
  balance: z.number().optional(),
  networkId: z.string().nullable().optional(),
  lastTransactionAt: z.string().nullable().optional(),
  status: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = walletUpdateSchema.parse(body);

    // Prepare update data with proper handling of null values
    const updateData: any = {
      isConnected: validatedData.isConnected,
    };

    // Handle nullable string fields
    if (validatedData.address !== undefined) {
      updateData.address = validatedData.address;
    }

    if (validatedData.caipAddress !== undefined) {
      updateData.caipAddress = validatedData.caipAddress;
    }

    if (validatedData.networkId !== undefined) {
      updateData.networkId = validatedData.networkId;
    }

    // Handle optional number fields
    if (validatedData.balance !== undefined) {
      updateData.balance = validatedData.balance;
    }

    // Handle date fields
    if (validatedData.lastTransactionAt !== undefined) {
      updateData.lastTransactionAt = validatedData.lastTransactionAt
        ? new Date(validatedData.lastTransactionAt)
        : null;
    }

    // Handle status
    updateData.status = validatedData.status || (validatedData.isConnected ? 'active' : 'inactive');

    // Find or create wallet record
    const wallet = await prismaClient.wallet.upsert({
      where: {
        userId: session.user.id,
      },
      update: updateData,
      create: {
        userId: session.user.id,
        address: validatedData.address || '',
        isConnected: validatedData.isConnected,
        caipAddress: validatedData.caipAddress || '',
        balance: validatedData.balance || 0,
        networkId: validatedData.networkId || null,
        lastTransactionAt: validatedData.lastTransactionAt
          ? new Date(validatedData.lastTransactionAt)
          : null,
        status: validatedData.status || (validatedData.isConnected ? 'active' : 'inactive'),
      },
    });

    // Also update the user record with the wallet address for better persistence
    if (validatedData.isConnected && validatedData.address) {
      await prismaClient.user.update({
        where: { id: session.user.id },
        data: { walletAddress: validatedData.address },
      });
    } else if (!validatedData.isConnected) {
      await prismaClient.user.update({
        where: { id: session.user.id },
        data: { walletAddress: null },
      });
    }

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
