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
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AreaIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.area) {
      case 'Marerijk':
        return '#6C4839'; // Brown
      case 'Ruigrijk':
        return '#A12020'; // Red
      case 'Anderrijk':
        return '#365B37'; // Green
      case 'Reizenrijk':
        return '#1E3A8A'; // Blue
      case 'Fantasierijk':
        return '#7E22CE'; // Purple
      case 'Pardoes Promenade':
        return '#B45309'; // Orange
      default:
        return '#6C4839'; // Default brown
    }
  }};
`;

const RightSection = styled.div`
  display: grid;
  grid-template-columns: ${props => props.isParkClosed ? '90px' : '45px 45px'};
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
  color: ${props => props.isParkClosed && props.status === 'Gesloten' ? '#6C4839' : '#A12020'};
  opacity: ${props => props.isParkClosed && props.status === 'Gesloten' ? 0.5 : 1};
  font-weight: 700;
  justify-self: ${props => props.isParkClosed ? 'end' : 'start'};
  text-align: ${props => props.isParkClosed ? 'right' : 'left'};
  padding-right: ${props => props.isParkClosed ? '0.25rem' : '0'};
`;

const HiddenZero = styled.span`
  opacity: 0;
`;

const EntityRow = ({ name, waitTime, singleRider, status, isEven, isParkClosed, area }) => {
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
      <Name>
        <AreaIndicator area={area} />
        {name}
      </Name>
      <RightSection isParkClosed={isParkClosed}>
        {hasNumericWaitTime ? (
          <WaitTime>
            <TimeValue>{formatTime(waitTime)}</TimeValue>
            <TimeUnit>MIN</TimeUnit>
          </WaitTime>
        ) : (
          <Status isParkClosed={isParkClosed} status={status}>{status}</Status>
        )}
        {!isParkClosed && singleRider !== undefined && (
          <WaitTime>
            <TimeValue>{formatTime(singleRider)}</TimeValue>
            {typeof singleRider === 'number' && <TimeUnit>MIN</TimeUnit>}
          </WaitTime>
        )}
      </RightSection>
    </Row>
  );
};

export default EntityRow; 