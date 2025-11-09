'use client';
import styled from 'styled-components';
import Button from '@/components/Button';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${8 / 16}rem;
`;

const Check = styled.input``;

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name: string;
};

const Checkbox = ({
  checked = true,
  onChange = () => {},
  name
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <Button
      onClick={() =>
        handleChange({
          target: { checked: !checked }
        } as React.ChangeEvent<HTMLInputElement>)
      }
    >
      <Container>
        <Check
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          name={name}
          id={name}
        />

        {name}
      </Container>
    </Button>
  );
};

export default Checkbox;
