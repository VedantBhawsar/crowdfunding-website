// app/api/rewards/distribute/route.ts
import prismaClient from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';

export async function GET() {
  try {
    const mail = new SendMail()
    const rewards = await prismaClient.reward.findMany({
      where: {
        claimed: 0,
      },
      orderBy: {
        deliveryDate: 'desc',
      },
      select: {
        id: true,
        deliveryDate: true,
      },
    });

    const filterRewards = rewards.filter(rewards => {
      if (rewards.deliveryDate === null) return false;
      return new Date(rewards?.deliveryDate) > new Date(Date.now());
    });

    for (const reward of filterRewards) {
      await prismaClient.reward.update({
        where: {
          id: reward.id,
        },
        data: {
          claimed: 1,
        },
      });
    }


    return NextResponse.json(rewards);
  } catch (error) {
    return NextResponse.json(error);
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

  async sendEmail(email: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return null;
    }
    const mailOptions = {
      from: 'reward@crowfundify.com',
      to: email,
      subject: 'Rewards Comming',
      text: `Hie ${user.name}, your reward is comming redeem it.`,
    };
    this.transporter?.sendMail(mailOptions, (error: Error | null, info: any) =>
      error ? console.log(error) : console.log(info)
    );
    return {
        success: true
    }
  }
}
