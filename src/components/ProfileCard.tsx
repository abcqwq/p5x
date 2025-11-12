'use client';
import styled from 'styled-components';
import Card from '@/components/Card';

const Container = styled.div`
  & > *:first-child {
    width: fit-content;
    display: flex;
    gap: ${12 / 16}rem;
    align-items: center;
  }
`;

const Img = styled.img`
  height: ${48 / 16}rem;
  border-radius: 50%;
`;

type ProfileCardProps = {
  name: string;
  avatarUrl: string;
};

const ProfileCard = ({ name, avatarUrl }: ProfileCardProps) => {
  return (
    <Container>
      <Card color="2" shadow="large">
        {avatarUrl && <Img src={avatarUrl} alt={`${name}'s avatar`} />}
        <p>{name}</p>
      </Card>
    </Container>
  );
};

export default ProfileCard;
