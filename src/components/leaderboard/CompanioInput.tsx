'use client';
import styled from 'styled-components';
import Checkbox from '@/components/Checkbox';

import { useCompanios } from '@/providers/CompaniosProvider';
import { corben } from '@/fonts';

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

const TitleSection = styled.h2`
  color: var(--color-text-2);
`;

const CompanioInput = () => {
  const { companios, selectedCompanios, includeCompanio, excludeCompanio } =
    useCompanios();

  return (
    <Container>
      <TitleSection className={corben.className}>
        Included Companios
      </TitleSection>
      <CheckboxContainer>
        {companios.map((companio) => (
          <Checkbox
            key={companio.id}
            name={companio.name}
            checked={selectedCompanios.includes(companio.id)}
            onChange={(checked) => {
              if (checked) includeCompanio(companio.id);
              else excludeCompanio(companio.id);
            }}
          />
        ))}
      </CheckboxContainer>
    </Container>
  );
};

export default CompanioInput;
