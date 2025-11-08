'use client';
import styled from 'styled-components';
import Checkbox from '@/components/Checkbox';

import { useCompanios } from '@/providers/CompaniosProvider';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${4 / 16}rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: ${16 / 16}rem;
`;

const TitleSection = styled.div`
  color: var(--color-text-2);
  padding: 0 ${2 / 16}rem;
`;

const CompanioInput = () => {
  const { companios, selectedCompanios, includeCompanio, excludeCompanio } =
    useCompanios();

  return (
    <Container>
      <TitleSection>select companios</TitleSection>
      <CheckboxContainer>
        {companios.map((companio) => (
          <Checkbox
            key={companio.id}
            name={companio.name}
            checked={selectedCompanios.includes(companio.name)}
            onChange={(checked) => {
              if (checked) includeCompanio(companio.name);
              else excludeCompanio(companio.name);
            }}
          />
        ))}
      </CheckboxContainer>
    </Container>
  );
};

export default CompanioInput;
