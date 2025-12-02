import { redirect } from 'next/navigation';
import Layout from '@/components/leaderboard/Layout';
import Header from '@/components/leaderboard/Header';
import Body from '@/components/leaderboard/Body';

import { ScoresProvider } from '@/react-things/providers/ScoresProvider';
import { PeriodProvider } from '@/react-things/providers/PeriodProvider';
import { CompaniosProvider } from '@/react-things/providers/CompaniosProvider';
import { MinimumScoresProvider } from '@/react-things/providers/MinimumScoresProvider';
import { fetchNightmareGatewayPeriodByNumber } from '@/handlers/fetch-nightmare-period';
import { fetchUsersWithoutScores } from '@/handlers/fetch-users-without-scores';
import { fetchCompanios } from '@/handlers/fetch-companios';
import { fetchNightmareGatewayScores } from '@/handlers/fetch-gateway-scores';
import { fetchMinimumScores } from '@/handlers/fetch-minimum-scores';

interface PageProps {
  params: Promise<{
    'period-number': string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { 'period-number': periodNumber } = await params;

  const [period, companios] = await Promise.all([
    fetchNightmareGatewayPeriodByNumber(periodNumber),
    fetchCompanios()
  ]);

  if (!period) {
    redirect('/nightmare-gateway-periods');
  }

  const [scores, noScoreUsers, minimumScores] = await Promise.all([
    fetchNightmareGatewayScores(period.id),
    fetchUsersWithoutScores(period.id),
    fetchMinimumScores(period.id)
  ]);

  noScoreUsers.forEach((user) => {
    scores?.push({
      id: `no-score-${user.id}`,
      first_half_score: 0,
      second_half_score: 0,
      user: user
    });
  });

  return (
    <PeriodProvider data={period}>
      <CompaniosProvider data={companios || []}>
        <MinimumScoresProvider data={minimumScores || []}>
          <ScoresProvider data={scores || []}>
            <Layout>
              <Header />
              <Body />
            </Layout>
          </ScoresProvider>
        </MinimumScoresProvider>
      </CompaniosProvider>
    </PeriodProvider>
  );
};

export default Page;
