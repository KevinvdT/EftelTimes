import styled from 'styled-components';
import { MdAccessTime, MdNearMe, MdSortByAlpha } from 'react-icons/md';

const SortContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  width: 100%;
`;

const Label = styled.span`
  color: #6C4839;
  font-size: 0.9rem;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  background-color: #E1D5C9;
  border-radius: 12px;
  padding: 0.3rem;
  gap: 0.3rem;
`;

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  border-radius: 10px;
  padding: 0.45rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  color: ${props => (props.$isActive ? 'white' : '#6C4839')};
  background-color: ${props => (props.$isActive ? '#6C4839' : 'transparent')};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${props => (props.$isActive ? '#5A3C2F' : '#D8C8B9')};
  }
`;

const iconBySortValue = {
  name: MdSortByAlpha,
  'queue-time': MdAccessTime,
  nearby: MdNearMe
};

const SortOrderSelect = ({ value, onChange, options }) => {
  return (
    <SortContainer>
      <Label>Sorteren op</Label>
      <ButtonGroup role="tablist" aria-label="Sorteervolgorde">
        {options.map(option => {
          const Icon = iconBySortValue[option.value];

          return (
            <SortButton
              key={option.value}
              type="button"
              role="tab"
              aria-selected={value === option.value}
              $isActive={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {Icon && (
                <span aria-hidden="true">
                  <Icon size={16} />
                </span>
              )}
              {option.label}
            </SortButton>
          );
        })}
      </ButtonGroup>
    </SortContainer>
  );
};

export default SortOrderSelect;
