import { useGetQueueTimesQuery } from '../store/api';
import { Row as EntityRow } from '../components/Entity';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 4xl;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1.875rem;
  color: #6C4839;
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

const HomePage = () => {
  const { data: queueData, isLoading, error } = useGetQueueTimesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium">Loading queue times...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-red-600">Error loading queue times</p>
      </div>
    );
  }

  return (
    <Container>
      <Title>EftelTimes</Title>
      <TableHeader>
        <SingleRiderLabel>
          SINGLE<br />
          RIDER
        </SingleRiderLabel>
      </TableHeader>
      {queueData?.map((entity, index) => (
        <EntityRow
          key={entity.name}
          name={entity.name}
          waitTime={entity.waitTime}
          singleRider={entity.singleRider}
          status={entity.status}
          isEven={index % 2 === 0}
        />
      ))}
    </Container>
  );
};

export default HomePage; 