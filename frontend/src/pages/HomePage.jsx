import { useGetQueueTimesQuery } from '../store/api';
import { Table as EntityTable } from '../components/ui/EntityTable';
import Page from '../components/Layout/Page';
import styled from 'styled-components';

const Title = styled.h1`
  text-align: left;
  margin-bottom: 3rem;
  font-family: 'Pirata One', cursive;
  font-size: 2.5rem;
  font-weight: 400;
  color: #6C4839;

  &::first-letter {
    color: #A12020;
  }
`;

const HomePage = () => {
  const { data: queueData, isLoading, error } = useGetQueueTimesQuery();

  if (isLoading) {
    return (
      <Page>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg font-medium">Loading queue times...</p>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg font-medium text-red-600">Error loading queue times</p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Attracties</Title>
      <EntityTable area="" entities={queueData || []} />
    </Page>
  );
};

export default HomePage; 