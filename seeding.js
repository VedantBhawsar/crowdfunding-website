const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Demo arrays with Indian data (mismatched lengths for variety)
const indianFirstNames = ['Aarav', 'Vivaan', 'Aditya', 'Sai', 'Arjun', 'Ishaan', 'Krishna', 'Rohan', 'Rahul', 'Karan'];
const indianLastNames = ['Sharma', 'Verma', 'Singh', 'Patel', 'Mehta', 'Gupta', 'Kumar', 'Reddy'];
const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];
const campaignCategories = ['TECHNOLOGY', 'ARTS', 'GAMES', 'FOOD', 'COMMUNITY'];
const tagsPool = ['innovation', 'social', 'education', 'health', 'finance', 'culture', 'environment'];

// Helper to pick random element
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate a random subset of tags
function pickTags() {
  const count = Math.ceil(Math.random() * 4);
  const shuffled = tagsPool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  for (let i = 0; i < 20; i++) {
    const firstName = pick(indianFirstNames);
    const lastName = pick(indianLastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.in`;
    const city = pick(cities);

    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        displayName: firstName,
        email,
        emailVerified: new Date(),
        image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
        onboarded: true,
        role: 'CREATOR',
        bio: `Hello, I'm ${firstName} from ${city}.`,
        location: city,
        isVerified: true,
        failedLoginAttempts: 0,
        lastLoginAt: new Date(),
        accounts: {
          create: {
            provider: 'google',
            providerAccountId: `google-${i}`,
            type: 'oauth',
            access_token: `token-${i}`
          }
        },
        sessions: {
          create: {
            sessionToken: `sess-${i}-${Date.now()}`,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
          }
        },
        wallet: {
          create: {
            address: `0x${Math.random().toString(16).substr(2, 40)}`,
            isConnected: true,
            caipAddress: `eip155:1:${Math.random().toString(16).substr(2, 40)}`,
            status: 'ACTIVE',
            balance: parseFloat((Math.random() * 10).toFixed(2)),
            networkId: '1'
          }
        },
        notificationSettings: {
          create: {
            emailNotifications: true,
            pushNotifications: true,
            newBackerNotification: true,
            commentNotification: true,
            updateNotification: true,
            milestoneNotification: true
          }
        },
        organizationMemberships: {
          create: {
            role: 'MEMBER'
          }
        },
        createdCampaigns: {
          create: {
            slug: `${firstName.toLowerCase()}-project-${i}`,
            title: `${firstName}'s ${pick(campaignCategories).toLowerCase()} Initiative`, 
            shortDescription: `A project by ${firstName} aiming to improve ${pick(tagsPool)}.`, 
            description: `Detailed description of ${firstName}'s project in ${city}.`, 
            goal: 1000 + Math.random() * 9000,
            raisedAmount: Math.random() * 1000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            category: pick(campaignCategories),
            tags: pickTags(),
            creatorName: firstName,
            creatorAvatar: `https://ui-avatars.com/api/?name=${firstName}`,
            milestones: {
              create: [
                {
                  title: 'Milestone 1',
                  description: 'Initial setup',
                  targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                  fundingAmount: 200,
                  completionPercentage: 0,
                  status: 'PENDING'
                },
                {
                  title: 'Milestone 2',
                  description: 'First prototype',
                  targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
                  fundingAmount: 300,
                  completionPercentage: 0,
                  status: 'PENDING'
                }
              ]
            },
            rewards: {
              create: [
                {
                  title: 'Sticker Pack',
                  description: 'A set of cool stickers',
                  amount: 10,
                  deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
                  shippingRequired: false
                },
                {
                  title: 'T-Shirt',
                  description: 'Project-branded T-Shirt',
                  amount: 25,
                  deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50),
                  shippingRequired: true,
                  estimatedShippingCost: 5
                }
              ]
            },
            backers: {
              create: [
                {
                  user: {
                    connect: { email: email }
                  },
                  amount: 50
                }
              ]
            },
            transactions: {
              create: [
                {
                  amount: 50,
                  user: {
                    connect: { email: email }
                  },
                  fee: 2.5,
                  status: 'COMPLETED'
                }
              ]
            },
            activities: {
              create: {
                type: 'CAMPAIGN_CREATED',
                description: 'Campaign created by user'
              }
            },
            comments: {
              create: {
                content: 'Excited for this project!',
                user: {
                  connect: { email: email }
                }
              }
            }
          }
        }
      }
    });
    console.log(`Created user ${i + 1}: ${firstName} ${lastName}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
