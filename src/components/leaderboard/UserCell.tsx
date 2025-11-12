'use client';
import styled from 'styled-components';

const Cell = styled.div`
  justify-content: flex-start;
`;

const Img = styled.img`
  height: ${32 / 16}rem;
  border-radius: 50%;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${8 / 16}rem;
`;

interface UserCellProps {
  user: {
    name: string;
    avatar_url?: string | null;
  };
}

export const UserCell = ({ user }: UserCellProps) => {
  return (
    <Cell>
      <Wrapper>
        {user.avatar_url && <Img src={user.avatar_url} alt={user.name} />}
        {user.name}
      </Wrapper>
    </Cell>
  );
};
