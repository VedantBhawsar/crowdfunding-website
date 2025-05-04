import { NextRequest, NextResponse } from 'next/server';
import { TransactionStatus, Activity, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth'; // Or your auth method
import { authOptions } from '@/config/auth'; // Your next-auth options
import { createPublicClient, http, parseEther, formatEther } from 'viem';
import { mainnet, sepolia } from 'viem/chains'; // Choose your chain(s)
import prismaClient from '@/lib/prismadb';

const NEXT_PUBLIC_CHAIN_ID = '2';

// Configure your public client (replace with your RPC URL and chain)
const publicClient = createPublicClient({
  chain: sepolia, // Example: Use Sepolia for testing
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL), // Get RPC URL from env
});

interface ContributionRequestBody {
  campaignId: string;
  amount: number; // Amount in ETH (as a number from frontend)
  txHash: string;
  rewardId?: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions); // Get user session

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  let body: ContributionRequestBody;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { campaignId, amount, txHash, rewardId } = body;

  // --- Basic Validation ---
  if (!campaignId || !amount || !txHash || amount <= 0) {
    return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
  }

  const amountInWei = parseEther(String(amount)); // Convert ETH amount to Wei BigInt

  try {
    // --- Fetch Required Data Concurrently ---
    const [campaign, userWallet] = await Promise.all([
      prismaClient.campaign.findUnique({
        where: { id: campaignId },
        include: {
          creator: { include: { wallet: true } }, // Need creator wallet
          rewards: { where: { id: rewardId } }, // Fetch specific reward if ID provided
        },
      }),
      prismaClient.wallet.findUnique({ where: { userId } }), // Get contributor's wallet
    ]);

    // --- Further Validation ---
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    if (campaign.status !== 'ACTIVE')
      return NextResponse.json({ error: 'Campaign is not active' }, { status: 400 });
    if (!campaign.creator?.wallet?.address)
      return NextResponse.json({ error: 'Campaign creator wallet not found' }, { status: 500 });
    if (!userWallet?.address)
      return NextResponse.json({ error: 'Contributor wallet not found' }, { status: 400 });
    if (rewardId && campaign.rewards.length === 0)
      return NextResponse.json(
        { error: 'Selected reward not found for this campaign' },
        { status: 400 }
      );

    const selectedReward = rewardId ? campaign.rewards[0] : null;
    if (selectedReward && amount < selectedReward.amount) {
      return NextResponse.json(
        {
          error: `Contribution amount is less than the required amount for reward "${selectedReward.title}"`,
        },
        { status: 400 }
      );
    }
    if (selectedReward?.maxClaimable && selectedReward.claimed >= selectedReward.maxClaimable) {
      return NextResponse.json(
        { error: `Reward "${selectedReward.title}" is fully claimed` },
        { status: 400 }
      );
    }

    const recipientAddress = campaign.creator.wallet.address as `0x${string}`; // Type assertion
    const senderAddress = userWallet.address as `0x${string}`;

    // --- On-Chain Transaction Verification ---
    console.log(`Verifying tx: ${txHash} on chain: ${publicClient.chain.name}`);
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt)
      return NextResponse.json(
        { error: 'Transaction receipt not found (may still be processing)' },
        { status: 404 }
      );
    if (receipt.status !== 'success')
      return NextResponse.json(
        { error: `Transaction failed on-chain (Status: ${receipt.status})` },
        { status: 400 }
      );

    // Fetch the transaction details to verify amount, sender, recipient
    const tx = await publicClient.getTransaction({
      hash: txHash as `0x${string}`,
    });

    if (!tx) return NextResponse.json({ error: 'Transaction details not found' }, { status: 404 });

    // **CRITICAL VERIFICATION**
    if (tx.from.toLowerCase() !== senderAddress.toLowerCase())
      return NextResponse.json({ error: 'Transaction sender mismatch' }, { status: 400 });
    if (tx.to?.toLowerCase() !== recipientAddress.toLowerCase())
      return NextResponse.json({ error: 'Transaction recipient mismatch' }, { status: 400 });
    if (tx.value !== amountInWei)
      return NextResponse.json(
        {
          error: `Transaction amount mismatch (Expected: ${amountInWei}, Got: ${tx.value})`,
        },
        { status: 400 }
      );

    console.log(`Transaction ${txHash} verified successfully.`);

    // --- Database Update (within a transaction) ---
    const result = await prismaClient.$transaction(async txPrisma => {
      // 1. Update Campaign raised amount
      const updatedCampaign = await txPrisma.campaign.update({
        where: { id: campaignId },
        data: { raisedAmount: { increment: amount } },
      });

      // 2. Create Backer record (or update if they back again?) - Create new for simplicity
      const newBacker = await txPrisma.backers.create({
        data: {
          userId: userId,
          campaignId: campaignId,
          amount: amount,
        },
      });

      // 3. Create Transaction record
      const newDbTransaction = await txPrisma.transaction.create({
        data: {
          amount: amount,
          userId: userId,
          campaignId: campaignId,
          rewardId: selectedReward?.id,
          txHash: txHash,
          status: TransactionStatus.COMPLETED,
        },
      });

      // 4. Update Reward claimed count (if applicable)
      if (selectedReward?.id && selectedReward.maxClaimable !== null) {
        await txPrisma.reward.update({
          where: { id: selectedReward.id },
          data: { claimed: { increment: 1 } },
        });
      }

      // 5. Create Activity Log
      await txPrisma.activity.create({
        data: {
          type: 'CONTRIBUTION',
          description: `${session.user.name || 'A user'} contributed ${amount} ETH.`,
          campaignId: campaignId,
          userId: userId,
          metadata: {
            // Store relevant details
            amount: amount,
            currency: 'ETH',
            txHash: txHash,
            rewardId: selectedReward?.id,
            rewardTitle: selectedReward?.title,
          },
        },
      });

      return { updatedCampaign, newBacker, newDbTransaction };
    });

    return NextResponse.json(
      { message: 'Contribution recorded successfully', data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error recording contribution:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific prismaClient errors if needed
      return NextResponse.json(
        { error: 'Database error during contribution recording.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Failed to record contribution' }, { status: 500 });
  } finally {
    await prismaClient.$disconnect();
  }
}
