import { useGetQueueTimesQuery } from '../store/api';
import { Table as EntityTable } from '../components/ui/EntityTable';
import Page from '../components/Layout/Page';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #6C4839;
  font-size: 1.125rem;
  font-weight: 500;
`;

const RetryButton = styled.button`
  background-color: #6C4839;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  opacity: ${props => props.isLoading ? 0.7 : 1};
  pointer-events: ${props => props.isLoading ? 'none' : 'auto'};

  &:hover {
    background-color: #5A3C2F;
  }
`;

const HomePage = () => {
  const { data: queueData, isLoading, error, refetch, isFetching } = useGetQueueTimesQuery();
  const [isMinLoading, setIsMinLoading] = useState(false);

  useEffect(() => {
    if (isFetching) {
      setIsMinLoading(true);
    }

    const timer = setTimeout(() => {
      if (!isFetching) {
        setIsMinLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isFetching]);

  console.log('States:', { isFetching, isMinLoading, error });

  if (isLoading) {
    return (
      <Page>
        <ErrorContainer>
          <ErrorMessage>Wachttijden laden...</ErrorMessage>
        </ErrorContainer>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <ErrorContainer>
          <ErrorMessage>Alle tovertwinkels! De wachttijden kunnen op dit moment niet geladen worden.</ErrorMessage>
          <RetryButton onClick={() => refetch()} isLoading={isMinLoading || isFetching}>
            {isMinLoading || isFetching ? 'Laden...' : 'Opnieuw proberen'}
          </RetryButton>
        </ErrorContainer>
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