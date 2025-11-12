'use client';
import { createContext, useContext, useState } from 'react';
import type { CompanioPeriodMinimumScores } from '@/bridge-things/schemas/nightmare-gateway';

type MinimumScoresContextType = {
  minimumScores: CompanioPeriodMinimumScores;
  getMinimumScoreForCompanio: (companioId: string) => number;
  isMinimumCheckEnabled: boolean;
  setIsMinimumCheckEnabled: (enabled: boolean) => void;
};

const MinimumScoresContext = createContext<MinimumScoresContextType>({
  minimumScores: [],
  getMinimumScoreForCompanio: () => 0,
  isMinimumCheckEnabled: false,
  setIsMinimumCheckEnabled: () => {}
});

export const useMinimumScores = () => {
  return useContext(MinimumScoresContext);
};

type MinimumScoresProviderProps = {
  children: React.ReactNode;
  data: CompanioPeriodMinimumScores;
};

export const MinimumScoresProvider = ({
  children,
  data
}: MinimumScoresProviderProps) => {
  const [minimumScores] = useState(data);
  const [isMinimumCheckEnabled, setIsMinimumCheckEnabled] = useState(false);

  const getMinimumScoreForCompanio = (companioId: string): number => {
    const scoreEntry = minimumScores.find(
      (ms) => ms.companio_id === companioId
    );
    return scoreEntry ? scoreEntry.minimum_score : 0;
  };

  return (
    <MinimumScoresContext.Provider
      value={{
        minimumScores,
        getMinimumScoreForCompanio,
        isMinimumCheckEnabled,
        setIsMinimumCheckEnabled
      }}
    >
      {children}
    </MinimumScoresContext.Provider>
  );
};
