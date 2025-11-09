'use client';
import styled from 'styled-components';

const OuterContainer = styled.div`
  color: var(--color-text-2);

  @media (min-width: 521px) {
    display: none;
  }
`;

const Help = () => {
  return <OuterContainer>(table can be scrolled horizontally)</OuterContainer>;
};

export default Help;
