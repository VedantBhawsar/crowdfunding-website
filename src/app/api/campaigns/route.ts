import { NextResponse, NextRequest } from 'next/server';
// Make sure to import the necessary enums and types
import { CampaignStatus, CampaignCategory, Prisma } from '@prisma/client';
import prismaClient from '@/lib/prismadb';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;

// Ensure CampaignCategory is included in the import above

const orderByMap: Record<string, Prisma.CampaignOrderByWithRelationInput> = {
  createdAt_asc: { createdAt: 'asc' },
  createdAt_desc: { createdAt: 'desc' },
  goal_asc: { goal: 'asc' },
  goal_desc: { goal: 'desc' },
  raisedAmount_desc: { raisedAmount: 'desc' },
  endDate_asc: { endDate: 'asc' }, // Added example for sorting by date
  endDate_desc: { endDate: 'desc' }, // Added example
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search')?.trim();
  const categoriesParam = searchParams.get('categories'); // Get raw string
  const statusesParam = searchParams.get('statuses'); // Get raw string
  const sortBy = searchParams.get('sortBy') || 'createdAt_desc';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10))
  );
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.CampaignWhereInput = {};

    // --- Search Logic ---
    if (search) {
      const lowered = search.toLowerCase();
      // Using 'contains' for case-insensitive search requires Prisma 5.0.0+ with specific DB features (like PostgreSQL citext)
      // or using 'mode: insensitive' for MongoDB or PostgreSQL
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { creatorName: { contains: search, mode: 'insensitive' } },
        // Note: Prisma's 'has' filter on string arrays is often case-sensitive depending on the DB.
        // For true case-insensitivity on tags, you might need more complex logic or schema adjustments.
        { tags: { has: lowered } }, // Keeping as is, acknowledge potential case-sensitivity
      ];
    }

    // --- Category Filtering (FIXED) ---
    if (categoriesParam) {
      const categoryStrings = categoriesParam.split(',').filter(Boolean);
      // Validate and convert strings to CampaignCategory enum values
      const validCategories = categoryStrings
        .map(catStr => catStr.trim().toUpperCase()) // Normalize input
        .filter(
          (catStr): catStr is CampaignCategory =>
            Object.values(CampaignCategory).includes(catStr as CampaignCategory) // Check if it's a valid enum member
        );

      if (validCategories.length > 0) {
        where.category = { in: validCategories }; // Use the array of valid enum values
      }
    }

    // --- Status Filtering (Corrected Validation Approach) ---
    if (statusesParam) {
      const statusStrings = statusesParam.split(',').filter(Boolean);
      // Validate and convert strings to CampaignStatus enum values
      const validStatuses = statusStrings
        .map(statusStr => statusStr.trim().toUpperCase()) // Normalize input
        .filter(
          (statusStr): statusStr is CampaignStatus =>
            Object.values(CampaignStatus).includes(statusStr as CampaignStatus) // Check if it's a valid enum member
        );

      if (validStatuses.length > 0) {
        where.status = { in: validStatuses }; // Use the array of valid enum values
      }
    }

    // --- Sorting Logic ---
    const orderBy = orderByMap[sortBy] || { createdAt: 'desc' };

    // --- Database Query ---
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

    // --- Pagination Logic ---
    const hasMore = campaigns.length > limit;
    if (hasMore) campaigns.pop(); // Remove the extra item

    // --- Response ---
    return NextResponse.json({
      data: campaigns,
      hasMore,
      currentPage: page,
    });
  } catch (error) {
    console.error('API Error fetching campaigns:', error);
    // Provide a more specific error message if possible, but avoid leaking sensitive details
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: `Failed to fetch campaigns. ${message}` }, { status: 500 });
  }
}
