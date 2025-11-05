'use client';
import styled from 'styled-components';
import Card from '@/components/Card';

const Container = styled.div``;

const InnerSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > * {
    flex-grow: 1;
  }

  gap: ${16 / 16}rem;

  flex-wrap: wrap;
`;

type ItemProps = {
  title: string;
  samples: React.ReactNode;
};

const Item = ({ title, samples }: ItemProps) => {
  return (
    <Container>
      <Card>
        <InnerSection>
          <p>{title}</p>
          {samples}
        </InnerSection>
      </Card>
    </Container>
  );
};

export default Item;
