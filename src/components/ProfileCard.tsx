'use client';
import styled from 'styled-components';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';

const Container = styled.div``;

const HeadSection = styled.section`
  display: flex;
  gap: ${12 / 16}rem;
  align-items: center;
`;

const HeadRightSection = styled.section`
  & > * {
    margin: 0;
    line-height: 1.2;
  }
`;

const HeadTitle = styled.h3`
  font-weight: 500;
`;

const HeadSubtitle = styled.p`
  color: var(--color-text-2);
`;

const ProfileCard = () => {
  return (
    <Container>
      <Card padding="p-large" shadow="medium">
        <HeadSection>
          <Avatar
            src="https://avatars.githubusercontent.com/u/57083494?v=4"
            size="medium"
          />
          <HeadRightSection>
            <HeadTitle>abcqwq</HeadTitle>
            <HeadSubtitle>swe @ gojek</HeadSubtitle>
          </HeadRightSection>
        </HeadSection>
      </Card>
    </Container>
  );
};

export default ProfileCard;
