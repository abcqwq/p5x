import Layout from '@/components/leaderboard/Layout';
import Header from '@/components/leaderboard/Header';
import Body from '@/components/leaderboard/Body';

import { ScoresProvider } from '@/react-things/providers/ScoresProvider';
import { PeriodsProvider } from '@/react-things/providers/PeriodsProvider';
import { CompaniosProvider } from '@/react-things/providers/CompaniosProvider';
import { MinimumScoresProvider } from '@/react-things/providers/MinimumScoresProvider';
import {
  fetchNightmareGatewayPeriod,
  fetchNightmareGatewayScores,
  fetchCompanios,
  fetchMinimumScores
} from '@/handlers/fetch-nightmare-data';

const Page = async () => {
  const [periods, companios, scores, minimumScores] = await Promise.all([
    fetchNightmareGatewayPeriod(),
    fetchCompanios(),
    fetchNightmareGatewayScores(),
    fetchMinimumScores()
  ]);

  return (
    <PeriodsProvider data={periods || []}>
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
    </PeriodsProvider>
  );
};

export default Page;
