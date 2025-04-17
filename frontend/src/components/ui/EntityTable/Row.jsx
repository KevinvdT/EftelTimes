import styled from 'styled-components';

const Row = styled.div`
  background-color: ${props => props.isEven ? '#E1D5C9' : 'transparent'};
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.div`
  color: #6C4839;
  font-weight: 700;
`;

const RightSection = styled.div`
  display: grid;
  grid-template-columns: 45px 45px;
  gap: 1.5rem;
  justify-content: end;
  align-items: center;
`;

const WaitTime = styled.div`
  color: #365B37;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  justify-self: start;
`;

const TimeValue = styled.span`
  font-size: inherit;
  font-variant-numeric: tabular-nums;
  min-width: 1.5ch;
  display: inline-block;
  text-align: right;
`;

const TimeUnit = styled.span`
  font-size: 10px;
  font-weight: 700;
`;

const Status = styled.div`
  color: #A12020;
  font-weight: 700;
  justify-self: start;
`;

const HiddenZero = styled.span`
  opacity: 0;
`;

const EntityRow = ({ name, waitTime, singleRider, status, isEven }) => {
  const hasNumericWaitTime = typeof waitTime === 'number';

  const formatTime = (time) => {
    if (time < 10) {
      return (
        <>
          <HiddenZero>0</HiddenZero>
          {time}
        </>
      );
    }
    return time;
  };

  return (
    <Row isEven={isEven}>
      <Name>{name}</Name>
      <RightSection>
        {hasNumericWaitTime ? (
          <WaitTime>
            <TimeValue>{formatTime(waitTime)}</TimeValue>
            <TimeUnit>MIN</TimeUnit>
          </WaitTime>
        ) : (
          <Status>{status}</Status>
        )}
        <WaitTime>
          {singleRider !== undefined && (
            <>
              <TimeValue>{formatTime(singleRider)}</TimeValue>
              {typeof singleRider === 'number' && <TimeUnit>MIN</TimeUnit>}
            </>
          )}
        </WaitTime>
      </RightSection>
    </Row>
  );
};

export default EntityRow; 