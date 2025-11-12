import Layout from '@/components/leaderboard/Layout';
import Header from '@/components/leaderboard/Header';
import Body from '@/components/leaderboard/Body';

import { ScoresProvider } from '@/react-things/providers/ScoresProvider';
import { PeriodProvider } from '@/react-things/providers/PeriodProvider';
import { CompaniosProvider } from '@/react-things/providers/CompaniosProvider';
import { MinimumScoresProvider } from '@/react-things/providers/MinimumScoresProvider';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';
import { fetchCompanios } from '@/handlers/fetch-companios';
import { fetchNightmareGatewayScores } from '@/handlers/fetch-gateway-scores';
import { fetchMinimumScores } from '@/handlers/fetch-minimum-scores';

const Page = async () => {
  const [activePeriod, companios] = await Promise.all([
    fetchActiveNightmareGatewayPeriod(),
    fetchCompanios()
  ]);

  if (!activePeriod) {
    return (
      <PeriodProvider data={null}>
        <CompaniosProvider data={companios || []}>
          <MinimumScoresProvider data={[]}>
            <ScoresProvider data={[]}>
              <Layout>
                <Header />
                <Body />
              </Layout>
            </ScoresProvider>
          </MinimumScoresProvider>
        </CompaniosProvider>
      </PeriodProvider>
    );
  }

  const [scores, minimumScores] = await Promise.all([
    fetchNightmareGatewayScores(activePeriod.id),
    fetchMinimumScores(activePeriod.id)
  ]);

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
