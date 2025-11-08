import Layout from '@/components/leaderboard/Layout';
import Header from '@/components/leaderboard/Header';
import Body from '@/components/leaderboard/Body';
import { fetchNightmareGatewayData } from '@/handlers/fetch-nightmare-data';

const Page = async () => {
  const abc = await fetchNightmareGatewayData();
  return (
    <Layout>
      <Header />
      <Body />
      {JSON.stringify(abc)}
    </Layout>
  );
};

export default Page;
