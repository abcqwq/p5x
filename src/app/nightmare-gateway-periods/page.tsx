import Layout from '@/components/nightmare-gateway-periods/Layout';
import Header from '@/components/nightmare-gateway-periods/Header';
import Body from '@/components/nightmare-gateway-periods/Body';

import { PeriodsProvider } from '@/react-things/providers/PeriodsProvider';
import { fetchAllNightmareGatewayPeriods } from '@/handlers/fetch-all-periods';

const Page = async () => {
  const periods = await fetchAllNightmareGatewayPeriods();

  return (
    <PeriodsProvider data={periods}>
      <Layout>
        <Header />
        <Body />
      </Layout>
    </PeriodsProvider>
  );
};

export default Page;
