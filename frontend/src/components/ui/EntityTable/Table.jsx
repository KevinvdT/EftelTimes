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

const SecondColumnSingleRiderLabel = styled(SingleRiderLabel)`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

const GridLayout = styled.div`
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 2rem;
  }
`;

const Column = styled.div`
  position: relative;

  ${TableHeader} {
    position: absolute;
    top: -2rem;
    right: 0;
    width: 100%;
  }
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

  // Calculate the midpoint to split the list evenly
  const midPoint = Math.ceil(sortedEntities.length / 2);
  const firstColumn = sortedEntities.slice(0, midPoint);
  const secondColumn = sortedEntities.slice(midPoint);

  return (
    <Section>
      {area && <AreaTitle>{area}</AreaTitle>}
      <GridLayout>
        <Column>
          <TableHeader>
            <SingleRiderLabel>
              SINGLE<br />
              RIDER
            </SingleRiderLabel>
          </TableHeader>
          {firstColumn.map((entity, index) => (
            <Row
              key={entity.name}
              name={entity.name}
              waitTime={entity.waitTime}
              singleRider={entity.singleRider}
              status={entity.status}
              isEven={index % 2 === 0}
            />
          ))}
        </Column>
        <Column>
          <TableHeader>
            <SecondColumnSingleRiderLabel>
              SINGLE<br />
              RIDER
            </SecondColumnSingleRiderLabel>
          </TableHeader>
          {secondColumn.map((entity, index) => (
            <Row
              key={entity.name}
              name={entity.name}
              waitTime={entity.waitTime}
              singleRider={entity.singleRider}
              status={entity.status}
              isEven={index % 2 === 0}
            />
          ))}
        </Column>
      </GridLayout>
    </Section>
  );
};

export default Table; 