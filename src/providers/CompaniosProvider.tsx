'use client';
import { createContext, useContext, useState } from 'react';
import type { Companios } from '@/schemas/nightmare-gateway';

type CompaniosContextType = {
  companios: Companios;
  selectedCompanios: string[];
  includeCompanio: (name: string) => void;
  excludeCompanio: (name: string) => void;
};

const CompaniosContext = createContext<CompaniosContextType>({
  companios: [],
  selectedCompanios: [],
  includeCompanio: () => {},
  excludeCompanio: () => {}
});

export const useCompanios = () => {
  return useContext(CompaniosContext);
};

type CompaniosProviderProps = {
  children: React.ReactNode;
  data: Companios;
};

export const CompaniosProvider = ({
  children,
  data
}: CompaniosProviderProps) => {
  const [companios] = useState(data);
  const [selectedCompanios, setSelectedCompanios] = useState<string[]>(
    companios.map((c) => c.id)
  );

  const includeCompanio = (id: string) => {
    if (selectedCompanios.includes(id)) return;
    setSelectedCompanios((prev) => [...prev, id]);
  };

  const excludeCompanio = (id: string) => {
    setSelectedCompanios((prev) => prev.filter((n) => n !== id));
  };

  return (
    <CompaniosContext.Provider
      value={{ companios, selectedCompanios, includeCompanio, excludeCompanio }}
    >
      {children}
    </CompaniosContext.Provider>
  );
};
