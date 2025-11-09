import Layout from '@/components/leaderboard/Layout';
import Header from '@/components/leaderboard/Header';
import Body from '@/components/leaderboard/Body';

import { ScoresProvider } from '@/providers/ScoresProvider';
import { PeriodsProvider } from '@/providers/PeriodsProvider';
import { CompaniosProvider } from '@/providers/CompaniosProvider';
import {
  fetchNightmareGatewayPeriod,
  fetchNightmareGatewayScores,
  fetchCompanios
} from '@/handlers/fetch-nightmare-data';

import { fetchDiscordAvatars } from '@/handlers/fetch-discord-avatar';

const Page = async () => {
  const [periods, companios, scores] = await Promise.all([
    fetchNightmareGatewayPeriod(),
    fetchCompanios(),
    fetchNightmareGatewayScores()
  ]);

  const avatars = await fetchDiscordAvatars(
    scores ? scores.map((score) => score.user.discord_user_id) : []
  );

  scores?.forEach((score) => {
    score.user.avatar_url = avatars.get(score.user.discord_user_id) || '';
  });

  return (
    <PeriodsProvider data={periods || []}>
      <CompaniosProvider data={companios || []}>
        <ScoresProvider data={scores || []}>
          <Layout>
            <Header />
            <Body />
          </Layout>
        </ScoresProvider>
      </CompaniosProvider>
    </PeriodsProvider>
  );
};

export default Page;
