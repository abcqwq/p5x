'use client';
import { createContext, useContext, useState } from 'react';
import type {
  NightmareGatewayPeriods,
  NightmareGatewayPeriod
} from '@/schemas/nightmare-gateway';

type PeriodsContextType = {
  periods: NightmareGatewayPeriods;
  selectedPeriodId: string;
  setSelectedPeriodId: (periodId: string) => void;
  getSelectedDetail: () => NightmareGatewayPeriod | undefined;
};

const PeriodsContext = createContext<PeriodsContextType>({
  periods: [],
  selectedPeriodId: '',
  setSelectedPeriodId: () => {},
  getSelectedDetail: () => undefined
});

export const usePeriods = () => {
  return useContext(PeriodsContext);
};

type PeriodsProviderProps = {
  children: React.ReactNode;
  data: NightmareGatewayPeriods;
};

export const PeriodsProvider = ({ children, data }: PeriodsProviderProps) => {
  const [periods] = useState(data);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(
    data.length > 0 ? data[data.length - 1].id : ''
  );

  const getSelectedDetail = () => {
    return periods.find((period) => period.id === selectedPeriodId);
  };

  return (
    <PeriodsContext.Provider
      value={{
        periods,
        selectedPeriodId,
        setSelectedPeriodId,
        getSelectedDetail
      }}
    >
      {children}
    </PeriodsContext.Provider>
  );
};
