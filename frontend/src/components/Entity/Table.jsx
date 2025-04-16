import styled from 'styled-components';
import Row from './Row';

const Section = styled.section`
  margin-bottom: 2rem;
`;

const AreaTitle = styled.h2`
  font-family: ${props => props.theme.typography.fonts.display};
  color: #6C4839;
  margin-bottom: 1rem;
  font-size: 1.5rem;

  &::first-letter {
    color: #A12020;
  }
`;

// FUTURE: Planned features
// - Add user controlled sorting (by name, wait time, status)
// - Add sort direction toggle (asc/desc)
// - Add sort indicators in column headers
const Table = ({ area, entities }) => {
  const sortedEntities = [...entities].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Section>
      <AreaTitle>{area}</AreaTitle>
      {sortedEntities.map((entity, index) => (
        <Row
          key={entity.name}
          name={entity.name}
          waitTime={entity.waitTime}
          singleRider={entity.singleRider}
          status={entity.status}
          isEven={index % 2 === 0}
        />
      ))}
    </Section>
  );
};

export default Table; 