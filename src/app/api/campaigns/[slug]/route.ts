import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prismadb';
import { PrismaClient } from '@prisma/client';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  const campaignSlug = params.slug;

  if (!campaignSlug) {
    return NextResponse.json({ error: 'Campaign slug is required' }, { status: 400 });
  }

  try {
    await prismaClient.campaign.delete({
      where: { slug: campaignSlug },
    });

    return NextResponse.json({ message: 'Campaign deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting campaign ${campaignSlug}:`, error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const campaignSlug = params.slug;

  if (!campaignSlug) {
    return NextResponse.json({ error: 'Campaign slug is required' }, { status: 400 });
  }

  try {
    const campaign = await prismaClient.campaign.findUnique({
      where: { slug: campaignSlug },
      include: {
        milestones: true,
        rewards: true,
        backers: {
          select: {
            userId: true,
            amount: true,
            user: { select: { name: true, image: true } },
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { name: true, image: true } } },
        },
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            wallet: {
              select: {
                address: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Add creator wallet address directly to campaign object for easier frontend access
    const campaignWithWallet = {
      ...campaign,
      creatorWalletAddress: campaign.creator?.wallet?.address || null, // Add this field
    };

    return NextResponse.json(campaignWithWallet);
  } catch (error) {
    console.error(`Error fetching campaign ${campaignSlug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch campaign data' }, { status: 500 });
  } finally {
    await prismaClient.$disconnect();
  }
}
