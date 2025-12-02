import { redirect } from 'next/navigation';
import Layout from '@/components/leaderboard/Layout';
import Header from '@/components/leaderboard/Header';
import Body from '@/components/leaderboard/Body';

import { ScoresProvider } from '@/react-things/providers/ScoresProvider';
import { PeriodProvider } from '@/react-things/providers/PeriodProvider';
import { CompaniosProvider } from '@/react-things/providers/CompaniosProvider';
import { MinimumScoresProvider } from '@/react-things/providers/MinimumScoresProvider';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';
import { fetchUsersWithoutScores } from '@/handlers/fetch-users-without-scores';
import { fetchCompanios } from '@/handlers/fetch-companios';
import { fetchNightmareGatewayScores } from '@/handlers/fetch-gateway-scores';
import { fetchMinimumScores } from '@/handlers/fetch-minimum-scores';

const Page = async () => {
  const [activePeriod, companios] = await Promise.all([
    fetchActiveNightmareGatewayPeriod(),
    fetchCompanios()
  ]);

  if (!activePeriod) {
    redirect('/nightmare-gateway-periods');
  }

  const [scores, noScoreUsers, minimumScores] = await Promise.all([
    fetchNightmareGatewayScores(activePeriod.id),
    fetchUsersWithoutScores(activePeriod.id),
    fetchMinimumScores(activePeriod.id)
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
    <PeriodProvider data={activePeriod}>
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
