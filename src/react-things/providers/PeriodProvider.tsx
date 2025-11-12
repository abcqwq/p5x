'use client';
import { createContext, useContext } from 'react';
import type { NightmareGatewayPeriod } from '@/bridge-things/schemas/nightmare-gateway';

type PeriodContextType = {
  period: NightmareGatewayPeriod | null;
};

const PeriodContext = createContext<PeriodContextType>({
  period: null
});

export const usePeriod = () => {
  return useContext(PeriodContext);
};

type PeriodProviderProps = {
  children: React.ReactNode;
  data: NightmareGatewayPeriod | null;
};

export const PeriodProvider = ({ children, data }: PeriodProviderProps) => {
  return (
    <PeriodContext.Provider value={{ period: data }}>
      {children}
    </PeriodContext.Provider>
  );
};
