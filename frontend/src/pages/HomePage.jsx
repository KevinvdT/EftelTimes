import { useGetQueueTimesQuery } from '../store/api';
import { Table as EntityTable } from '../components/Entity';
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
      <EntityTable area="" entities={queueData || []} />
    </Container>
  );
};

export default HomePage; 