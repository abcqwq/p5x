'use client';
import { createContext, useContext, useState } from 'react';
import type { NightmareGatewayScores } from '@/schemas/nightmare-gateway';

type ScoresContextType = { scores: NightmareGatewayScores };

const ScoresContext = createContext<ScoresContextType>({
  scores: []
});

export const useScores = () => {
  return useContext(ScoresContext);
};

type ScoresProviderProps = {
  children: React.ReactNode;
  data: NightmareGatewayScores;
};

export const ScoresProvider = ({ children, data }: ScoresProviderProps) => {
  const [scores] = useState(data);
  return (
    <ScoresContext.Provider value={{ scores }}>
      {children}
    </ScoresContext.Provider>
  );
};
