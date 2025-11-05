import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create 2 companies
  const companies = await Promise.all([
    prisma.companio.create({
      data: {
        id: 'tech-innovations',
        name: 'Tech Innovations Corp',
        logo_url:
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center'
      }
    }),
    prisma.companio.create({
      data: {
        id: 'digital-solutions',
        name: 'Digital Solutions Ltd',
        logo_url:
          'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop&crop=center'
      }
    })
  ]);

  console.log('✅ Created 2 companies');

  // Create 2 nightmare gateway periods
  const periods = await Promise.all([
    prisma.nightmareGatewayPeriod.create({
      data: {
        start: new Date('2024-10-01'),
        end: new Date('2024-10-31'),
        first_half_boss_name: 'Shadow Wraith',
        first_half_boss_avatar_url:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center',
        second_half_boss_name: 'Void Reaper',
        second_half_boss_avatar_url:
          'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=200&h=200&fit=crop&crop=center'
      }
    }),
    prisma.nightmareGatewayPeriod.create({
      data: {
        start: new Date('2024-11-01'),
        end: new Date('2024-11-30'),
        first_half_boss_name: 'Crimson Phantom',
        first_half_boss_avatar_url:
          'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=200&h=200&fit=crop&crop=center',
        second_half_boss_name: 'Abyssal Lord',
        second_half_boss_avatar_url:
          'https://images.unsplash.com/photo-1572732960503-4e31db7af18b?w=200&h=200&fit=crop&crop=center'
      }
    })
  ]);

  console.log('✅ Created 2 nightmare gateway periods');

  // Generate user names and avatar URLs
  const userNames = [
    'Alex Thompson',
    'Sarah Chen',
    'Michael Rodriguez',
    'Emma Johnson',
    'David Kim',
    'Lisa Anderson',
    'James Wilson',
    'Maria Garcia',
    'Robert Taylor',
    'Jennifer Martinez',
    'William Brown',
    'Jessica Davis',
    'Christopher Miller',
    'Ashley Wilson',
    'Matthew Moore',
    'Amanda Taylor',
    'Daniel Anderson',
    'Stephanie Thomas',
    'Andrew Jackson',
    'Michelle White',
    'Joshua Harris',
    'Nicole Martin',
    'Kevin Thompson',
    'Rachel Garcia',
    'Brian Rodriguez',
    'Heather Lewis',
    'Ryan Walker',
    'Lauren Hall',
    'Brandon Young',
    'Samantha Allen',
    'Tyler King',
    'Kimberly Wright',
    'Justin Lopez',
    'Crystal Hill',
    'Aaron Scott',
    'Brittany Green',
    'Nathan Adams',
    'Vanessa Baker',
    'Sean Gonzalez',
    'Tiffany Nelson',
    'Jonathan Carter',
    'Melanie Mitchell',
    'Zachary Perez',
    'Courtney Roberts',
    'Eric Turner',
    'Victoria Phillips'
  ];

  const avatarUrls = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face'
  ];

  // Create ~46 users spread across 2 companies
  const users = [];
  for (let i = 0; i < 46; i++) {
    const companyIndex = i < 23 ? 0 : 1; // First 23 users to first company, rest to second
    const user = await prisma.user.create({
      data: {
        name: userNames[i] || `User ${i + 1}`,
        avatar_url: avatarUrls[i % avatarUrls.length],
        companio_id: companies[companyIndex].id
      }
    });
    users.push(user);
  }

  console.log('✅ Created 46 users across 2 companies');

  // Create nightmare gateway scores
  // 90% of users should have scores for each period
  const usersWithScores = Math.floor(users.length * 0.9); // 90% of users

  const scores = [];

  for (const period of periods) {
    // Shuffle users and take 90% of them
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const selectedUsers = shuffledUsers.slice(0, usersWithScores);

    for (const user of selectedUsers) {
      const score = await prisma.nightmareGatewayScore.create({
        data: {
          user_id: user.id,
          nightmare_id: period.id,
          first_half_score: Math.floor(Math.random() * 500000) + 100000, // Random score between 100k-600k
          second_half_score: Math.floor(Math.random() * 500000) + 100000
        }
      });
      scores.push(score);
    }
  }

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
