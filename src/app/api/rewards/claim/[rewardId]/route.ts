import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';
import { ActivityType } from '@prisma/client';
import { claimReward } from '@/lib/blockchain';

export async function POST(request: Request, { params }: { params: { rewardId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { rewardId } = params;
    if (!rewardId) {
      return NextResponse.json(
        { success: false, message: 'Reward ID is required' },
        { status: 400 }
      );
    }

    // Get the user
    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
      include: {
        wallet: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (!user.wallet || !user.wallet.address) {
      return NextResponse.json(
        { success: false, message: 'User wallet not found or not connected' },
        { status: 400 }
      );
    }

    // Get the reward
    const reward = await prismaClient.reward.findUnique({
      where: { id: rewardId },
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

    if (!reward) {
      return NextResponse.json({ success: false, message: 'Reward not found' }, { status: 404 });
    }

    // Check if reward is ready to be claimed
    if (!reward.readyForClaimAt) {
      return NextResponse.json(
        { success: false, message: 'Reward is not yet ready to be claimed' },
        { status: 400 }
      );
    }

    // Check if the user has backed this campaign and selected this reward
    const backer = await prismaClient.backers.findFirst({
      where: {
        userId: user.id,
        campaignId: reward.campaignId,
        rewardId: reward.id,
      },
    });

    if (!backer) {
      return NextResponse.json(
        { success: false, message: 'You have not backed this campaign with this reward' },
        { status: 400 }
      );
    }

    // Contract address would typically be stored in env or per campaign
    const rewardContractAddress = process.env.REWARD_CONTRACT_ADDRESS;

    if (!rewardContractAddress) {
      console.error('REWARD_CONTRACT_ADDRESS is not defined in environment variables');
      return NextResponse.json(
        { success: false, message: 'Reward contract address not configured' },
        { status: 500 }
      );
    }

    // Process the reward claim on the blockchain
    const blockchainResult = await claimReward(
      rewardContractAddress,
      rewardId,
      user.wallet.address
    );

    if (!blockchainResult.success) {
      console.error('Blockchain claim failed:', blockchainResult.error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to process blockchain transaction',
          error: blockchainResult.error,
        },
        { status: 500 }
      );
    }

    // Create transaction record in database
    const transaction = await prismaClient.transaction.create({
      data: {
        amount: reward.amount,
        userId: user.id,
        campaignId: reward.campaignId,
        rewardId: reward.id,
        status: 'COMPLETED',
        txHash: blockchainResult.txHash,
        metadata: {
          claimedAt: new Date(),
          rewardTitle: reward.title,
          blockNumber: blockchainResult.blockNumber,
        },
      },
    });

    // Update the reward claimed count
    await prismaClient.reward.update({
      where: { id: reward.id },
      data: {
        claimed: { increment: 1 },
      },
    });

    // Create activity log
    await prismaClient.activity.create({
      data: {
        type: ActivityType.REWARD_CLAIMED,
        description: `${user.name || 'A backer'} claimed the reward: ${reward.title}`,
        campaignId: reward.campaignId,
        userId: user.id,
        metadata: {
          rewardId: reward.id,
          rewardTitle: reward.title,
          transactionId: transaction.id,
          txHash: blockchainResult.txHash,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reward claimed successfully',
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        txHash: blockchainResult.txHash,
      },
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to claim reward', error: (error as Error).message },
      { status: 500 }
    );
  }
}
