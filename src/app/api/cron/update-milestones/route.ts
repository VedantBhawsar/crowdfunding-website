import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prismadb';
import { MilestoneStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time

/**
 * Checks milestone target dates and updates statuses
 * This endpoint is meant to be called by a cron job
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('Authorization');
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = {
      delayedMilestones: 0,
      upcomingMilestones: 0,
    };

    // 1. Mark milestones as DELAYED if their target date has passed and they're not COMPLETED
    const delayedMilestones = await prismaClient.milestone.updateMany({
      where: {
        status: {
          in: [MilestoneStatus.PENDING, MilestoneStatus.IN_PROGRESS],
        },
        targetDate: {
          lte: now,
          not: null,
        },
      },
      data: {
        status: MilestoneStatus.DELAYED,
      },
    });
    results.delayedMilestones = delayedMilestones.count;

    // 2. Find milestones that are coming up in the next 7 days
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingMilestones = await prismaClient.milestone.findMany({
      where: {
        status: {
          in: [MilestoneStatus.PENDING, MilestoneStatus.IN_PROGRESS],
        },
        targetDate: {
          gte: now,
          lte: sevenDaysFromNow,
          not: null,
        },
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            creatorId: true,
          },
        },
      },
    });

    results.upcomingMilestones = upcomingMilestones.length;

    // 3. Create activity entries for delayed milestones
    if (results.delayedMilestones > 0) {
      // Get all milestones that were just marked as delayed
      const newlyDelayedMilestones = await prismaClient.milestone.findMany({
        where: {
          status: MilestoneStatus.DELAYED,
          updatedAt: { gte: new Date(Date.now() - 60000) },
        },
        include: {
          campaign: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Create activity entries for each delayed milestone
      for (const milestone of newlyDelayedMilestones) {
        await prismaClient.activity.create({
          data: {
            type: 'STATUS_CHANGED',
            description: `Milestone "${milestone.title}" is now delayed`,
            campaignId: milestone.campaignId,
            metadata: {
              milestoneId: milestone.id,
              milestoneTitle: milestone.title,
              newStatus: 'DELAYED',
            },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Milestone statuses updated successfully',
      results,
    });
  } catch (error) {
    console.error('Error updating milestone statuses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
