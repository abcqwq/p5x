'use client';
import styled from 'styled-components';
import Button from '@/components/Button';

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.span`
  color: var(--color-text-2);
  font-size: ${14 / 16}rem;
`;

const Select = styled.select``;

type DropdownItem = {
  id: string;
  value: string;
};

type DropdownProps = {
  id: string;
  label: string;
  items: DropdownItem[];
  selectedItemId?: string;
  onUpdate: (selectedItemId: string) => void;
};

const Dropdown = ({
  id,
  label,
  items,
  selectedItemId,
  onUpdate
}: DropdownProps) => {
  const defaultOptionId = Math.random().toString(36);

  if (!selectedItemId) {
    selectedItemId = defaultOptionId;
  }

  return (
    <Button>
      <Container>
        <Label>{label}</Label>
        <Select
          id={id}
          value={selectedItemId}
          onChange={(e) => onUpdate(e.target.value)}
        >
          <option key={defaultOptionId} value={defaultOptionId} disabled>
            select a period
          </option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.value}
            </option>
          ))}
        </Select>
      </Container>
    </Button>
  );
};

export default Dropdown;
