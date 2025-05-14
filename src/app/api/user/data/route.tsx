import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/auth';
import prismaClient from '@/lib/prismadb';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    const session = await getServerSession(authOptions);

    if (!id) {
      id = session?.user?.id as string;
    }

    // Fetch the full user data from the database
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
      include: {
        transactions: true,
        backings: {
          include: {
            user: true,
            campaign: {
              include: {
                creator: true,
              },
            },
          },
        },
        notificationSettings: true,
        createdCampaigns: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
