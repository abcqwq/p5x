import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create 2 companies
  const companies = await Promise.all([
    prisma.companio.create({
      data: {
        id: 'strega',
        name: 'Strega',
        logo_url:
          'https://cdn.discordapp.com/icons/1418134277018619924/a50261cdbf345ef6951b1bc6b2dfadf2.png?size=64'
      }
    }),
    prisma.companio.create({
      data: {
        id: 'zoshigaya',
        name: 'Zoshigaya',
        logo_url:
          'https://cdn.discordapp.com/icons/814766249233481728/093c6f9a880ae01bd89435dbcf5bfbc5.png?size=64'
      }
    })
  ]);

  console.log('✅ Created 2 companies');

  // Create 2 nightmare gateway periods
  const periods = await Promise.all([
    prisma.nightmareGatewayPeriod.create({
      data: {
        start: new Date('2025-11-07'),
        end: new Date('2025-11-14'),
        first_half_boss_name: 'Baal (DoD)',
        first_half_boss_avatar_url: '',
        second_half_boss_name: 'Nidhoggr (DoD)',
        second_half_boss_avatar_url: ''
      }
    })
  ]);

  console.log('✅ Created 1 nightmare gateway period');

  // Generate user names and avatar URLs

  type UserBlueprint = {
    name: string;
    discordId: string;
    score: number;
  };

  const userBlueprints: UserBlueprint[] = [
    { name: 'Mr MJ', discordId: 'mjlee8865', score: 243736316 },
    { name: 'Tsun Zu', discordId: 'abcqwq', score: 230409444 },
    { name: 'Cute C', discordId: 'cutec', score: 224650028 },
    { name: 'Jin Kurosawa', discordId: 'harambeabusiness', score: 222068140 },
    { name: 'Akira Yagami', discordId: 'eik47', score: 204765060 },
    { name: 'Dscript McDohl', discordId: 'dscript18', score: 187066820 },
    { name: 'Huo Yuhao', discordId: 'ervin2342', score: 186372500 },
    { name: 'Akira Kiyosumi', discordId: 'chloelxxlxx', score: 184024580 },
    { name: 'Handri Hari', discordId: 'handri', score: 183820148 },
    { name: 'Mirae Hwarin', discordId: 'momon0785', score: 174576228 },
    { name: 'Memet Alfa', discordId: 'nitraion', score: 174259036 },
    { name: 'Saint Philemon', discordId: 'mzkss.', score: 171827492 },
    { name: 'Nikoru Kurosawa', discordId: '._nikoru_.', score: 167834268 },
    { name: 'Vexuro Xialann', discordId: 'azrilhaykal', score: 159268796 },
    { name: 'Liv 8', discordId: 'l1vi8', score: 157875676 },
    { name: 'Minato Akechi', discordId: 'arclight7347', score: 153556428 },
    { name: 'Kyanite Sakamoto', discordId: 'kyanite5493', score: 151572117 },
    { name: 'Nagisa Kamisiro', discordId: 'v1ctory_cry', score: 146559804 },
    { name: 'Hiroyuki Sawano', discordId: '77kb', score: 126034824 },
    { name: 'Louvey H', discordId: 'louveyyy', score: 103967724 }
  ];

  const users = [];
  for (let i = 0; i < userBlueprints.length; i++) {
    const user = await prisma.user.create({
      data: {
        name: userBlueprints[i].name,
        avatar_url: '',
        companio_id: companies[0].id,
        id: userBlueprints[i].discordId
      }
    });
    users.push(user);
  }

  console.log('✅ Created Strega users');

  for (let i = 0; i < userBlueprints.length; i++) {
    await prisma.nightmareGatewayScore.create({
      data: {
        user_id: userBlueprints[i].discordId,
        nightmare_id: periods[0].id,
        first_half_score: userBlueprints[i].score,
        second_half_score: 0
      }
    });
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
