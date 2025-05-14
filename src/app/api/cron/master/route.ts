import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prismadb';
import { CampaignStatus, MilestoneStatus } from '@prisma/client';
import { distributeRewards } from '@/lib/blockchain';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds max execution time for Hobby plan

/**
 * Master cron job that handles all scheduled tasks:
 * 1. Distribute rewards
 * 2. Update campaign statuses
 * 3. Update reward statuses
 * 4. Update milestone statuses
 */
export async function GET(request: Request) {
  try {
    // Debug headers and environment
    const authHeader = request.headers.get('Authorization');
    const userAgent = request.headers.get('user-agent') || '';

    console.log('User-Agent:', userAgent);
    console.log('Auth header present:', Boolean(authHeader));
    console.log('CRON_SECRET present:', Boolean(process.env.CRON_SECRET));

    // Check if the request is from Vercel's cron system
    const isVercelCron = userAgent.includes('vercel-cron');
    console.log('Is Vercel Cron:', isVercelCron);

    // Skip authorization for Vercel cron jobs
    if (
      !isVercelCron &&
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = {
      // Campaign results
      activatedCampaigns: 0,
      completedCampaigns: 0,
      fundedCampaigns: 0,

      // Reward results
      rewardsReadyForClaim: 0,
      rewardsDistributed: 0,
      emailsSent: 0,

      // Milestone results
      delayedMilestones: 0,
      upcomingMilestones: 0,
    };

    // --- TASK 1: UPDATE CAMPAIGN STATUSES ---
    await updateCampaignStatuses(now, results);

    // --- TASK 2: UPDATE REWARD STATUSES ---
    await updateRewardStatuses(now, results);

    // --- TASK 3: UPDATE MILESTONE STATUSES ---
    await updateMilestoneStatuses(now, results);

    // --- TASK 4: DISTRIBUTE REWARDS ---
    await distributeRewardsToUsers(results);

    return NextResponse.json({
      success: true,
      message: 'All cron tasks completed successfully',
      results,
    });
  } catch (error) {
    console.error('Error running master cron job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Updates campaign statuses based on dates and funding goals
 */
async function updateCampaignStatuses(now: Date, results: any) {
  try {
    // 1. Update DRAFT campaigns to ACTIVE if their startDate has passed
    const activatedCampaigns = await prismaClient.campaign.updateMany({
      where: {
        status: CampaignStatus.DRAFT,
        startDate: { lte: now },
        isDeleted: false,
      },
      data: {
        status: CampaignStatus.ACTIVE,
      },
    });
    results.activatedCampaigns = activatedCampaigns.count;

    // 2. Update ACTIVE campaigns to COMPLETED if their endDate has passed
    const completedCampaigns = await prismaClient.campaign.updateMany({
      where: {
        status: CampaignStatus.ACTIVE,
        endDate: { lte: now },
        isDeleted: false,
      },
      data: {
        status: CampaignStatus.COMPLETED,
      },
    });
    results.completedCampaigns = completedCampaigns.count;

    // 3. Update ACTIVE campaigns to FUNDED if they've reached their goal
    const fundedCampaigns = await prismaClient.campaign.updateMany({
      where: {
        status: CampaignStatus.ACTIVE,
        raisedAmount: {
          gte: prismaClient.campaign.fields.goal,
        },
        isDeleted: false,
      },
      data: {
        status: CampaignStatus.FUNDED,
      },
    });
    results.fundedCampaigns = fundedCampaigns.count;

    // 4. Create activity entries for status changes
    if (
      results.activatedCampaigns > 0 ||
      results.completedCampaigns > 0 ||
      results.fundedCampaigns > 0
    ) {
      // Get all campaigns that were just updated
      const updatedCampaigns = await prismaClient.campaign.findMany({
        where: {
          OR: [
            { status: CampaignStatus.ACTIVE, updatedAt: { gte: new Date(Date.now() - 60000) } },
            { status: CampaignStatus.COMPLETED, updatedAt: { gte: new Date(Date.now() - 60000) } },
            { status: CampaignStatus.FUNDED, updatedAt: { gte: new Date(Date.now() - 60000) } },
          ],
        },
        select: {
          id: true,
          status: true,
        },
      });

      // Create activity entries for each updated campaign
      for (const campaign of updatedCampaigns) {
        await prismaClient.activity.create({
          data: {
            type: 'STATUS_CHANGED',
            description: `Campaign status changed to ${campaign.status}`,
            campaignId: campaign.id,
            metadata: {
              newStatus: campaign.status,
            },
          },
        });
      }
    }
  } catch (error) {
    console.error('Error updating campaign statuses:', error);
    throw error;
  }
}

/**
 * Updates reward statuses and checks if they're ready to be claimed
 */
async function updateRewardStatuses(now: Date, results: any) {
  try {
    // Update rewards that are ready to be claimed based on deliveryDate
    const readyRewards = await prismaClient.reward.updateMany({
      where: {
        deliveryDate: { lte: now },
        readyForClaimAt: null,
      },
      data: {
        readyForClaimAt: now,
      },
    });
    results.rewardsReadyForClaim = readyRewards.count;

    // If any rewards were updated, create activity entries
    if (results.rewardsReadyForClaim > 0) {
      // Get all rewards that were just marked as ready
      const updatedRewards = await prismaClient.reward.findMany({
        where: {
          readyForClaimAt: { gte: new Date(Date.now() - 60000) },
        },
        select: {
          id: true,
          title: true,
          campaignId: true,
        },
      });

      // Create activity entries for each updated reward
      for (const reward of updatedRewards) {
        await prismaClient.activity.create({
          data: {
            type: 'REWARD_CLAIMED',
            description: `Reward "${reward.title}" is now ready to be claimed`,
            campaignId: reward.campaignId,
            metadata: {
              rewardId: reward.id,
              rewardTitle: reward.title,
            },
          },
        });
      }
    }
  } catch (error) {
    console.error('Error updating reward statuses:', error);
    throw error;
  }
}

/**
 * Checks milestone target dates and updates statuses
 */
async function updateMilestoneStatuses(now: Date, results: any) {
  try {
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
  } catch (error) {
    console.error('Error updating milestone statuses:', error);
    throw error;
  }
}

/**
 * Distributes rewards to users
 */
async function distributeRewardsToUsers(results: any) {
  try {
    const mail = new SendMail();
    // Get rewards that are ready to be claimed but haven't been marked as ready yet
    const rewards = await prismaClient.reward.findMany({
      where: {
        readyForClaimAt: null,
        deliveryDate: {
          not: null,
          lt: new Date(), // Only get rewards whose delivery date has passed
        },
      },
      include: {
        campaign: {
          select: {
            title: true,
            slug: true,
          },
        },
        backers: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
                walletAddress: true,
              },
            },
          },
        },
      },
    });

    const rewardContractAddress = process.env.REWARD_CONTRACT_ADDRESS;
    if (!rewardContractAddress) {
      console.error('REWARD_CONTRACT_ADDRESS is not defined in environment variables');
      return;
    }

    // Process each reward
    for (const reward of rewards) {
      try {
        // Skip rewards with no backers
        if (!reward.backers || reward.backers.length === 0) {
          continue;
        }

        // Prepare blockchain distribution for this reward
        const validBackers = reward.backers.filter(
          backer => backer.user?.walletAddress && backer.amount > 0
        );

        if (validBackers.length > 0) {
          const recipients = validBackers.map(backer => backer.user?.walletAddress as string);
          const amounts = validBackers.map(() => reward.amount.toString()); // Same amount for each backer

          // Distribute on blockchain
          const blockchainResult = await distributeRewards(
            rewardContractAddress,
            recipients,
            amounts
          );

          if (blockchainResult.success) {
            results.rewardsDistributed++;

            // Record blockchain transaction in database
            await Promise.all(
              validBackers.map(async backer => {
                await prismaClient.transaction.create({
                  data: {
                    amount: reward.amount,
                    userId: backer.userId,
                    campaignId: reward.campaignId,
                    rewardId: reward.id,
                    status: 'COMPLETED',
                    txHash: blockchainResult.txHash,
                    metadata: {
                      distributedAt: new Date(),
                      rewardTitle: reward.title,
                      blockNumber: blockchainResult.blockNumber,
                      bulkDistribution: true,
                    },
                  },
                });
              })
            );
          } else {
            console.error(
              `Blockchain distribution failed for reward ${reward.id}:`,
              blockchainResult.error
            );
          }
        }

        // Update the reward status to ready for claiming
        await prismaClient.reward.update({
          where: {
            id: reward.id,
          },
          data: {
            readyForClaimAt: new Date(),
          },
        });

        // Create activity for the reward being ready
        await prismaClient.activity.create({
          data: {
            type: 'REWARD_CLAIMED',
            description: `Reward "${reward.title}" is now ready to be claimed`,
            campaignId: reward.campaignId,
            metadata: {
              rewardId: reward.id,
              rewardTitle: reward.title,
              txHash:
                results.rewardsDistributed > 0 ? 'blockchain_distribution_complete' : undefined,
            },
          },
        });

        // Send email notification to each backer who selected this reward
        for (const backer of reward.backers) {
          if (backer.user?.email) {
            await mail.sendEmail(
              backer.user.email,
              backer.user.name || 'Supporter',
              reward.title,
              reward.campaign?.title || 'Campaign',
              reward.campaign?.slug || '',
              reward.id
            );
            results.emailsSent++;
          }
        }
      } catch (error) {
        console.error(`Error processing reward ${reward.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error distributing rewards:', error);
    throw error;
  }
}

class SendMail {
  private transporter: Transporter<SentMessageInfo, Options> | null = null;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
      },
    });
  }

  async sendEmail(
    email: string,
    userName: string,
    rewardTitle: string,
    campaignTitle: string,
    campaignSlug: string,
    rewardId: string
  ) {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return;
    }

    const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/campaign/${campaignSlug}?claim=${rewardId}`;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL || 'rewards@crowdfundify.com',
      to: email,
      subject: `Your reward for ${campaignTitle} is ready to claim!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${userName},</h2>
          <p>Great news! Your reward <strong>${rewardTitle}</strong> from the campaign <strong>${campaignTitle}</strong> is now ready to be claimed.</p>
          <p>You can claim your reward by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${claimUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Claim Your Reward
            </a>
          </div>
          <p>Thank you for supporting this project!</p>
          <p>Best regards,<br>The Crowdfunding Team</p>
          <hr style="border: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            If you're having trouble with the button above, copy and paste this URL into your browser:
            <br>
            <a href="${claimUrl}" style="color: #0070f3;">${claimUrl}</a>
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}
