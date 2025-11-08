'use client';
import styled from 'styled-components';
import Checkbox from '@/components/Checkbox';
import React from 'react';

const Container = styled.section`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: ${16 / 16}rem;
`;

const Body = () => {
  const companio = ['Strega', 'Zoshigaya'];

  const [selected, setSelected] = React.useState<string[]>([
    'Strega',
    'Zoshigaya'
  ]);

  return (
    <Container>
      {companio.map((companio) => (
        <Checkbox
          key={companio}
          name={companio}
          checked={selected.includes(companio)}
          onChange={(checked) => {
            if (checked) {
              setSelected((prev) => [...prev, companio]);
            } else {
              setSelected((prev) => prev.filter((i) => i !== companio));
            }
          }}
        />
      ))}
    </Container>
  );
};

export default Body;
