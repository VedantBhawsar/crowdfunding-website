import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/auth';
import prismaClient from '@/lib/prismadb';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the wallet record for the current user
    const wallet = await prismaClient.wallet.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        address: true,
        isConnected: true,
        caipAddress: true,
        status: true,
        balance: true,
        networkId: true,
        lastTransactionAt: true,
      },
    });

    // If no wallet found, return default values
    if (!wallet) {
      return NextResponse.json({
        isConnected: false,
        address: null,
        caipAddress: null,
        status: 'inactive',
        balance: 0,
        networkId: null,
        lastTransactionAt: null,
      });
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
