import { redirect } from 'next/navigation';
import Layout from '@/components/leaderboard/Layout';
import Header from '@/components/leaderboard/Header';
import Body from '@/components/leaderboard/Body';

import { ScoresProvider } from '@/react-things/providers/ScoresProvider';
import { PeriodProvider } from '@/react-things/providers/PeriodProvider';
import { CompaniosProvider } from '@/react-things/providers/CompaniosProvider';
import { MinimumScoresProvider } from '@/react-things/providers/MinimumScoresProvider';
import { fetchNightmareGatewayPeriodById } from '@/handlers/fetch-nightmare-period';
import { fetchCompanios } from '@/handlers/fetch-companios';
import { fetchNightmareGatewayScores } from '@/handlers/fetch-gateway-scores';
import { fetchMinimumScores } from '@/handlers/fetch-minimum-scores';

interface PageProps {
  params: Promise<{
    'period-id': string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { 'period-id': periodId } = await params;

  const [period, companios] = await Promise.all([
    fetchNightmareGatewayPeriodById(periodId),
    fetchCompanios()
  ]);

  if (!period) {
    redirect('/nightmare-gateway-periods');
  }

  const [scores, minimumScores] = await Promise.all([
    fetchNightmareGatewayScores(period.id),
    fetchMinimumScores(period.id)
  ]);

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
