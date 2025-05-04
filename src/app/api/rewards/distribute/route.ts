// app/api/rewards/distribute/route.ts
import prismaClient from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';

export async function GET() {
  try {
    const mail = new SendMail();
    // Get rewards that are ready to be claimed but haven't been marked as ready yet
    const rewards = await prismaClient.reward.findMany({
      where: {
        claimed: 0,
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
      },
    });

    console.log(`Found ${rewards.length} rewards ready to be claimed`);
    
    // Process each reward
    for (const reward of rewards) {
      // Update the reward status to ready for claiming
      await prismaClient.reward.update({
        where: {
          id: reward.id,
        },
        data: {
          claimed: 1, // Mark as ready for claiming
          // readyForClaimAt field needs to be added to the Prisma schema
          // readyForClaimAt: new Date(),
        },
      });
      
      // Find backers who selected this reward
      const backers = await prismaClient.backers.findMany({
        where: {
          // rewardId field needs to be added to the Backers model in Prisma schema
          // rewardId: reward.id,
          campaignId: reward.campaignId,
        },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });
      
      // Send email notification to each backer who selected this reward
      if (backers && backers.length > 0) {
        for (const backer of backers) {
          if (backer.user?.email) {
            await mail.sendEmail(
              backer.user.email,
              backer.user.name || 'Supporter',
              reward.title,
              reward.campaign?.title || 'Campaign',
              reward.campaign?.slug || '',
              reward.id
            );
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: rewards.length,
      message: `Processed ${rewards.length} rewards and sent notifications`
    });
  } catch (error) {
    console.error('Error distributing rewards:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
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
        // TODO: convert this to env variables
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
      from: 'reward@crowdfundify.com',
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
