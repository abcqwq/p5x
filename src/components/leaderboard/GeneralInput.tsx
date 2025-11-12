'use client';
import styled from 'styled-components';
import Checkbox from '@/components/Checkbox';

import { useMinimumScores } from '@/react-things/providers/MinimumScoresProvider';
import { corben } from '@/react-things/fonts';

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

const GeneralInput = () => {
  const { isMinimumCheckEnabled, setIsMinimumCheckEnabled } =
    useMinimumScores();

  return (
    <Container>
      <TitleSection className={corben.className}>Settings</TitleSection>
      <CheckboxContainer>
        <Checkbox
          name={'KKM Check'}
          checked={isMinimumCheckEnabled}
          onChange={(checked) => setIsMinimumCheckEnabled(checked)}
        />
      </CheckboxContainer>
    </Container>
  );
};

export default GeneralInput;
