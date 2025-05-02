import { NextResponse, NextRequest } from 'next/server';
import { CampaignStatus, Prisma } from '@prisma/client';
import prismaClient from '@/lib/prismadb';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;

const orderByMap: Record<string, Prisma.CampaignOrderByWithRelationInput> = {
  createdAt_asc: { createdAt: 'asc' },
  createdAt_desc: { createdAt: 'desc' },
  goal_asc: { goal: 'asc' },
  goal_desc: { goal: 'desc' },
  raisedAmount_desc: { raisedAmount: 'desc' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search')?.trim();
  const categories = searchParams.get('categories')?.split(',').filter(Boolean);
  const statuses = (searchParams.get('statuses')?.split(',') || []) as CampaignStatus[];
  const sortBy = searchParams.get('sortBy') || 'createdAt_desc';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10))
  );
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.CampaignWhereInput = {};

    if (search) {
      const lowered = search.toLowerCase();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { creatorName: { contains: search, mode: 'insensitive' } },
        { tags: { has: lowered } },
      ];
    }

    if (categories?.length) {
      where.category = { in: categories };
    }

    const validStatuses = statuses.filter((s): s is CampaignStatus =>
      Object.values(CampaignStatus).includes(s)
    );

    if (validStatuses.length) {
      where.status = { in: validStatuses };
    }

    const orderBy = orderByMap[sortBy] || { createdAt: 'desc' };

    const campaigns = await prismaClient.campaign.findMany({
      where,
      orderBy,
      skip,
      take: limit + 1, // Fetch one extra to check for `hasMore`
      include: {
        _count: {
          select: { backers: true },
        },
      },
    });

    const hasMore = campaigns.length > limit;
    if (hasMore) campaigns.pop();

    return NextResponse.json({
      data: campaigns,
      hasMore,
      currentPage: page,
    });
  } catch (error) {
    console.error('API Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
