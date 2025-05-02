// prisma/seed.js
const {
  PrismaClient,
  Role,
  MilestoneStatus,
  CampaignStatus,
  TransactionStatus,
} = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();
const TOTAL_USERS = 1000;
const TOTAL_CAMPAIGNS = 1000;
const TOTAL_ACTIVITIES_PER_CAMPAIGN = 5; // Activities per campaign on average

// Helper to generate unique slugs
const generateUniqueSlug = title => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
  return `${baseSlug}-${faker.string.alphanumeric(6)}`;
};

// Helper to get random item from array
const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];

// Predefined categories for campaigns
const CAMPAIGN_CATEGORIES = [
  'Technology',
  'Art',
  'Music',
  'Film',
  'Games',
  'Food',
  'Publishing',
  'Fashion',
  'Design',
  'Community',
  'Education',
  'Environment',
  'Health',
  'Nonprofit',
  'Social Enterprise',
];

async function main() {
  console.log('🧹 Clearing existing data...');
  // Use deleteMany with caution! Order matters due to relations.
  await prisma.activity.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.backers.deleteMany({});
  await prisma.reward.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.user.deleteMany({});
  // Account, Session, VerificationToken managed by auth.

  console.log(`🌱 Seeding ${TOTAL_USERS} Users...`);
  const usersData = [];
  for (let i = 0; i < TOTAL_USERS; i++) {
    const name = faker.person.fullName();
    usersData.push({
      name: name,
      displayName: faker.internet.username({ firstName: name.split(' ')[0] }),
      email:
        faker.internet
          .email({
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1],
            allowSpecialCharacters: false,
          })
          .toLowerCase() + i, // Ensure unique emails
      emailVerified: faker.date.past(),
      image: faker.image.avatar(),
      onboarded: faker.datatype.boolean(0.8),
      role: getRandomItem(Object.values(Role)),
      bio: faker.lorem.paragraph(),
      location: `${faker.location.city()}, ${faker.location.countryCode()}`,
      walletAddress: faker.finance.ethereumAddress(),
    });
  }
  await prisma.user.createMany({ data: usersData }); // Skip duplicates just in case faker generates similar emails transiently
  const createdUsers = await prisma.user.findMany({
    select: { id: true, role: true, name: true, image: true },
  });
  const creatorUsers = createdUsers.filter(u => u.role === Role.CREATOR);
  const investorUsers = createdUsers.filter(u => u.role === Role.INVESTOR);
  console.log(`👤 Created ${createdUsers.length} users.`);

  console.log(`🌱 Seeding Wallets for users...`);
  const walletsData = createdUsers.map(user => ({
    address: faker.finance.ethereumAddress(),
    isConnected: faker.datatype.boolean(0.9),
    caipAddress: `eip155:1:${faker.finance.ethereumAddress()}`,
    status: 'verified',
    userId: user.id,
  }));
  await prisma.wallet.createMany({ data: walletsData });
  console.log(`💰 Created ${walletsData.length} wallets.`);

  console.log(`🌱 Seeding ${TOTAL_CAMPAIGNS} Campaigns...`);
  const campaignsData = [];
  for (let i = 0; i < TOTAL_CAMPAIGNS; i++) {
    const creator = getRandomItem(creatorUsers);
    if (!creator) {
      console.warn('No creators found, skipping campaign creation.');
      continue;
    }
    const title = faker.company.catchPhrase();
    const goal = faker.number.float({ min: 1, max: 50, precision: 0.1 });
    const duration = faker.number.int({ min: 7, max: 90 });
    // Seed initial raised amount - actual amount depends on Backers/Transactions
    const raised = faker.number.float({ min: 0, max: goal * 1.2, precision: 0.01 });

    campaignsData.push({
      slug: generateUniqueSlug(title),
      title: title,
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(3),
      goal: goal,
      durationDays: duration,
      ipfsHash: faker.datatype.boolean(0.3)
        ? faker.string.hexadecimal({ length: 46, prefix: 'Qm' })
        : null,
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        faker.image.urlLoremFlickr({ category: 'business' })
      ),
      category: getRandomItem(CAMPAIGN_CATEGORIES),
      tags: Array.from({ length: faker.number.int({ min: 2, max: 6 }) }, () => faker.lorem.word()),
      riskAssessment: faker.datatype.boolean(0.6) ? faker.lorem.paragraph() : null,
      website: faker.datatype.boolean(0.7) ? faker.internet.url() : null,
      twitter: faker.datatype.boolean(0.5)
        ? `https://twitter.com/${faker.internet.username()}`
        : null,
      instagram: faker.datatype.boolean(0.3)
        ? `https://instagram.com/${faker.internet.username()}`
        : null,
      linkedin: faker.datatype.boolean(0.2)
        ? `https://linkedin.com/company/${faker.company.name().replace(/ /g, '-')}`
        : null,
      github: faker.datatype.boolean(0.4)
        ? `https://github.com/${faker.internet.username()}`
        : null,
      creatorId: creator.id, // Link to creator User
      creatorName: creator.name || 'Unknown Creator', // Denormalized
      creatorAvatar: creator.image || faker.image.avatar(), // Denormalized
      raisedAmount: raised, // Seed initial value, real value based on transactions
      status: getRandomItem(Object.values(CampaignStatus)),
      // daysLeft: duration, // Removed
      // backers: ..., // Removed
      // Relations added later
    });
  }
  await prisma.campaign.createMany({ data: campaignsData });
  const createdCampaigns = await prisma.campaign.findMany({
    select: { id: true, goal: true, rewards: { select: { id: true, amount: true } } }, // Fetch reward IDs/amounts for transaction linking
  });
  console.log(`🚀 Created ${createdCampaigns.length} campaigns.`);

  console.log(`🌱 Seeding Milestones and Rewards for campaigns...`);
  const milestonesData = [];
  const rewardsData = [];
  for (const campaign of createdCampaigns) {
    // Milestones (same logic as before)
    let cumulativePercentage = 0;
    const numMilestones = faker.number.int({ min: 2, max: 5 });
    for (let j = 0; j < numMilestones; j++) {
      const percentageIncrease = faker.number.int({
        min: 10,
        max: Math.max(10, (100 - cumulativePercentage) / (numMilestones - j)),
      });
      cumulativePercentage = Math.min(100, cumulativePercentage + percentageIncrease);
      milestonesData.push({
        title: `Milestone ${j + 1}: ${faker.lorem.words(3)}`,
        description: faker.lorem.sentence(),
        targetDate: faker.date.future().toISOString(),
        completionPercentage: cumulativePercentage,
        status:
          cumulativePercentage === 100
            ? MilestoneStatus.COMPLETED
            : getRandomItem(Object.values(MilestoneStatus)),
        campaignId: campaign.id,
        fundingAmount: faker.number.float({
          min: 0,
          max: campaign.goal / numMilestones,
          precision: 0.01,
        }),
      });
    }

    // Rewards (add maxClaimable/claimed)
    const numRewards = faker.number.int({ min: 1, max: 4 });
    for (let k = 0; k < numRewards; k++) {
      const maxClaimable = faker.datatype.boolean(0.5)
        ? faker.number.int({ min: 10, max: 100 })
        : null; // 50% have limits
      const claimed = maxClaimable ? faker.number.int({ min: 0, max: maxClaimable / 2 }) : 0; // Claim up to half
      rewardsData.push({
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(10),
        amount: faker.number.float({ min: 0.01, max: campaign.goal / 2, precision: 0.01 }),
        deliveryDate: faker.date.future({ years: 1 }).toISOString(),
        campaignId: campaign.id,
        maxClaimable: maxClaimable,
        claimed: claimed,
      });
    }
  }
  // Batch create milestones and rewards
  if (milestonesData.length > 0) {
    await prisma.milestone.createMany({ data: milestonesData });
    console.log(`🎯 Created ${milestonesData.length} milestones.`);
  }
  if (rewardsData.length > 0) {
    await prisma.reward.createMany({ data: rewardsData });
    console.log(`🎁 Created ${rewardsData.length} rewards.`);
  }
  // Fetch rewards again with IDs for transaction linking
  const createdRewards = await prisma.reward.findMany({
    select: { id: true, campaignId: true, amount: true },
  });
  // Group rewards by campaign for easier lookup
  const rewardsByCampaign = createdRewards.reduce((acc, reward) => {
    if (!acc[reward.campaignId]) {
      acc[reward.campaignId] = [];
    }
    acc[reward.campaignId].push(reward);
    return acc;
  }, {});

  console.log(`🌱 Seeding Backers and Transactions...`);
  const backersData = [];
  const transactionsData = [];
  for (const campaign of createdCampaigns) {
    const numBackers = faker.number.int({ min: 0, max: 50 }); // Max 50 backers per campaign for seeding
    const campaignRewards = rewardsByCampaign[campaign.id] || []; // Get rewards for this campaign

    for (let i = 0; i < numBackers; i++) {
      const backerUser = getRandomItem(investorUsers);
      if (!backerUser) continue; // Skip if no investors

      const backingAmount = faker.number.float({
        min: 0.01,
        max: campaign.goal * 0.1,
        precision: 0.01,
      }); // Back up to 10% of goal

      // Create Backer record
      backersData.push({
        userId: backerUser.id,
        campaignId: campaign.id,
        amount: backingAmount,
      });

      // Find a matching reward (optional, simplified logic)
      const potentialReward = campaignRewards.find(r => backingAmount >= r.amount); // Simplistic: finds first reward >= amount

      // Create Transaction record
      transactionsData.push({
        amount: backingAmount,
        userId: backerUser.id,
        campaignId: campaign.id,
        rewardId: potentialReward ? potentialReward.id : null, // Link reward if found
        txHash: `0x${faker.string.hexadecimal({ length: 64, prefix: '' })}`,
        status: getRandomItem(Object.values(TransactionStatus)),
      });
    }
  }
  if (backersData.length > 0) {
    await prisma.backers.createMany({ data: backersData });
    console.log(`👥 Created ${backersData.length} backing records.`);
  }
  if (transactionsData.length > 0) {
    await prisma.transaction.createMany({ data: transactionsData });
    console.log(`💳 Created ${transactionsData.length} transactions.`);
  }

  console.log(`🌱 Seeding Activities...`);
  const activitiesData = [];
  const activityTypes = [
    'contribution',
    'milestone_update',
    'campaign_created',
    'reward_claimed',
    'comment_added',
    'status_change',
  ];

  for (const campaign of createdCampaigns) {
    const numActivities = faker.number.int({ min: 1, max: TOTAL_ACTIVITIES_PER_CAMPAIGN * 2 }); // Add some variance
    for (let i = 0; i < numActivities; i++) {
      const user = getRandomItem(createdUsers); // Activity might be system or user generated
      const type = getRandomItem(activityTypes);
      let description = '';
      let metadata = null;

      switch (type) {
        case 'contribution':
          const contributionAmount = faker.finance.amount(0.01, 5, 4);
          description = `${user.name || 'Someone'} contributed ${contributionAmount} ETH.`;
          metadata = { amount: contributionAmount, currency: 'ETH', contributorId: user.id };
          break;
        case 'milestone_update':
          description = `Milestone "${faker.lorem.words(3)}" status changed to ${getRandomItem(Object.values(MilestoneStatus))}.`;
          metadata = {
            milestoneTitle: faker.lorem.words(3),
            newStatus: getRandomItem(Object.values(MilestoneStatus)),
          };
          break;
        case 'campaign_created':
          // This might be better logged when campaign is actually created, but for seeding:
          description = `Campaign was created by ${campaign.creatorName}.`;
          metadata = { creatorId: campaign.creatorId };
          break;
        case 'reward_claimed':
          description = `${user.name || 'Someone'} claimed the "${faker.commerce.productName()}" reward.`;
          metadata = { rewardTitle: faker.commerce.productName(), claimerId: user.id };
          break;
        case 'comment_added':
          description = `${user.name || 'Someone'} commented: "${faker.lorem.sentence()}"`;
          metadata = { commentAuthorId: user.id };
          break;
        case 'status_change':
          const newStatus = getRandomItem(Object.values(CampaignStatus));
          description = `Campaign status changed to ${newStatus}.`;
          metadata = { newStatus: newStatus };
          break;
        default:
          description = 'An activity occurred.';
      }

      activitiesData.push({
        type: type,
        description: description,
        campaignId: campaign.id,
        userId: user.id, // Link activity to user who performed it
        metadata: metadata, // Store additional JSON data
      });
    }
  }
  if (activitiesData.length > 0) {
    await prisma.activity.createMany({ data: activitiesData });
    console.log(`📢 Created ${activitiesData.length} activities.`);
  }

  console.log('✅ Seeding finished.');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
