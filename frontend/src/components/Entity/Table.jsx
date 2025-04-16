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

const TableHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 1.25rem 0.5rem 1.25rem;
`;

const SingleRiderLabel = styled.div`
  color: #6C4839;
  font-size: 10px;
  font-weight: 700;
  text-align: right;
  line-height: 1;
`;

// FUTURE: Planned features
// - Add user controlled sorting (by name, wait time, status)
// - Add sort direction toggle (asc/desc)
// - Add sort indicators in column headers
const Table = ({ area, entities }) => {
  console.log('Before sorting:', entities.map(e => e.name));

  const sortedEntities = [...entities].sort((a, b) =>
    a.name.localeCompare(b.name, 'nl', {
      sensitivity: 'base',
      ignorePunctuation: true
    })
  );

  console.log('After sorting:', sortedEntities.map(e => e.name));

  return (
    <Section>
      {area && <AreaTitle>{area}</AreaTitle>}
      <TableHeader>
        <SingleRiderLabel>
          SINGLE<br />
          RIDER
        </SingleRiderLabel>
      </TableHeader>
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