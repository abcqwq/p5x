'use client';
import { createContext, useContext, useState } from 'react';
import type { GetDeployablesV1 } from '@/network/schemas/deployable';

type DeployablesContextType = { deployables: GetDeployablesV1 };

const DeployablesContext = createContext<DeployablesContextType>({
  deployables: [] as GetDeployablesV1
});

export const useDeployables = () => {
  return useContext(DeployablesContext);
};

export const DeployablesProvider = ({
  children,
  data
}: {
  children: React.ReactNode;
  data: GetDeployablesV1;
}) => {
  const [deployables] = useState(data);
  return (
    <DeployablesContext.Provider value={{ deployables }}>
      {children}
    </DeployablesContext.Provider>
  );
};
