import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing services
  await prisma.service.deleteMany();

  // Seed services
  const services = await prisma.service.createMany({
    data: [
      // Social Boost Services
      {
        name: "Instagram Followers Boost",
        category: "social-boost",
        description:
          "Increase your Instagram followers with real, active users",
        price: 29.99,
        isActive: true,
      },
      {
        name: "TikTok Views Package",
        category: "social-boost",
        description: "Boost your TikTok video views and engagement",
        price: 19.99,
        isActive: true,
      },
      {
        name: "YouTube Subscribers",
        category: "social-boost",
        description: "Grow your YouTube channel with genuine subscribers",
        price: 49.99,
        isActive: true,
      },
      {
        name: "Twitter Engagement Boost",
        category: "social-boost",
        description: "Increase likes, retweets, and followers on Twitter",
        price: 24.99,
        isActive: true,
      },

      // Social Accounts
      {
        name: "Premium Instagram Account",
        category: "social-accounts",
        description: "Verified Instagram account with 10k+ followers",
        price: 199.99,
        isActive: true,
      },
      {
        name: "TikTok Creator Account",
        category: "social-accounts",
        description: "Established TikTok account with monetization enabled",
        price: 149.99,
        isActive: true,
      },
      {
        name: "YouTube Channel Package",
        category: "social-accounts",
        description: "Monetized YouTube channel with 1k+ subscribers",
        price: 299.99,
        isActive: true,
      },

      // SMS Service
      {
        name: "SMS Verification - USA",
        category: "sms-service",
        description: "Receive SMS verification codes from US numbers",
        price: 2.99,
        isActive: true,
      },
      {
        name: "SMS Verification - UK",
        category: "sms-service",
        description: "Receive SMS verification codes from UK numbers",
        price: 3.49,
        isActive: true,
      },
      {
        name: "SMS Verification - Global",
        category: "sms-service",
        description: "Access to virtual numbers from 50+ countries",
        price: 4.99,
        isActive: true,
      },
      {
        name: "Bulk SMS Package",
        category: "sms-service",
        description: "100 SMS verifications at discounted rate",
        price: 199.99,
        isActive: true,
      },

      // Gifting
      {
        name: "Amazon Gift Card - $50",
        category: "gifting",
        description: "Digital Amazon gift card delivered instantly",
        price: 50.0,
        isActive: true,
      },
      {
        name: "Steam Gift Card - $25",
        category: "gifting",
        description: "Steam wallet code for gaming purchases",
        price: 25.0,
        isActive: true,
      },
      {
        name: "Netflix Gift Card - $30",
        category: "gifting",
        description: "Netflix subscription gift card",
        price: 30.0,
        isActive: true,
      },
      {
        name: "Spotify Premium - 3 Months",
        category: "gifting",
        description: "Spotify Premium subscription gift",
        price: 29.99,
        isActive: true,
      },
    ],
  });

  console.log(`✅ Created ${services.count} services`);
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
