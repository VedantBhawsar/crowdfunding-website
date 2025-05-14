// app/api/rewards/distribute/route.ts
import prismaClient from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';
import { distributeRewards } from '@/lib/blockchain';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('Authorization');
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    console.log(`Found ${rewards.length} rewards ready to be claimed`);

    const rewardContractAddress = process.env.REWARD_CONTRACT_ADDRESS;
    if (!rewardContractAddress) {
      console.error('REWARD_CONTRACT_ADDRESS is not defined in environment variables');
      return NextResponse.json(
        {
          success: false,
          error: 'Reward contract address not configured',
        },
        { status: 500 }
      );
    }

    // Process each reward
    const results = {
      processed: 0,
      emailsSent: 0,
      blockchainTransactions: 0,
      errors: 0,
    };

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
            results.blockchainTransactions++;

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
            results.errors++;
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
                results.blockchainTransactions > 0 ? 'blockchain_distribution_complete' : undefined,
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

        results.processed++;
      } catch (error) {
        console.error(`Error processing reward ${reward.id}:`, error);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Processed ${results.processed} rewards, sent ${results.emailsSent} emails, completed ${results.blockchainTransactions} blockchain transactions`,
    });
  } catch (error) {
    console.error('Error distributing rewards:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
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
    if (!email) {
      console.log('No email provided for notification');
      return null;
    }

    const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/campaign/${campaignSlug}?claim=${rewardId}`;

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL || 'rewards@crowdfundify.com',
      to: email,
      subject: `Your reward is ready: ${rewardTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4f46e5;">Good news! Your reward is ready</h2>
          <p>Hello ${userName},</p>
          <p>Great news! Your reward <strong>${rewardTitle}</strong> from the campaign <strong>${campaignTitle}</strong> is now ready to be claimed.</p>
          <div style="margin: 25px 0;">
            <a href="${claimUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Claim Your Reward</a>
          </div>
          <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${claimUrl}</p>
          <p>Thank you for supporting this project!</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated message from Crowdfundify. Please do not reply to this email.</p>
        </div>
      `,
      text: `Hi ${userName}, your reward is ready to be claimed. Please visit ${claimUrl} to claim your reward.`,
    };
    this.transporter?.sendMail(mailOptions, (error: Error | null, info: any) =>
      error ? console.log(error) : console.log(info)
    );
    return {
      success: true,
    };
  }
}
