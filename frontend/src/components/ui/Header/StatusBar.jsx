import styled from 'styled-components';
import { useMemo } from 'react';

const StatusBarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const StatusBar = styled.div`
  background-color: ${props => {
    if (props.isLoading) return 'transparent';
    if (props.isClosingSoon) return '#D4812C';
    return props.isOpen ? '#5D8137' : '#A12020';
  }};
  color: white;
  padding: 0.6rem;
  text-align: center;
  font-weight: 600;

  em {
    font-weight: 900;
    font-style: normal;
    text-transform: uppercase;
  }

  .full-message {
    display: none;
    @media (min-width: 768px) {
      display: inline;
    }
  }

  .compact-message {
    display: none;
    @media (max-width: 767px) {
      display: inline;
    }
  }
`;

const Emphasis = styled.em`
  font-weight: 900;
  font-style: normal;
  text-transform: uppercase;
`;

const formatTime = (date) => {
  return date.toLocaleString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam'
  });
};

const useOpeningStatus = (openingHoursData) => {
  return useMemo(() => {
    if (!openingHoursData) {
      return { message: null, isOpen: false, isLoading: true };
    }

    const { today, tomorrow, timezone } = openingHoursData;
    if (!today && !tomorrow) {
      return { message: null, isOpen: false, isLoading: false };
    }

    // Get current time in park's timezone
    // const parkDate = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
    const parkDate = new Date('2025-04-19T20:59:00');

    if (!today) {
      const tomorrowOpen = new Date(tomorrow.openingTime);
      const tomorrowClose = new Date(tomorrow.closingTime);
      return {
        message: (
          <>
            <span className="full-message">
              Het park is nu <Emphasis>gesloten</Emphasis> en is morgen geopend van {formatTime(tomorrowOpen)} tot {formatTime(tomorrowClose)} uur
            </span>
            <span className="compact-message">
              Park nu <Emphasis>gesloten</Emphasis>, morgen open van {formatTime(tomorrowOpen).replace(':00', '')} tot {formatTime(tomorrowClose).replace(':00', 'u')}
            </span>
          </>
        ),
        isOpen: false,
        isLoading: false
      };
    }

    const openTime = new Date(today.openingTime);
    const closeTime = new Date(today.closingTime);

    // Compare hours and minutes for more accurate comparison
    const parkHours = parkDate.getHours();
    const parkMinutes = parkDate.getMinutes();
    const openHours = openTime.getHours();
    const openMinutes = openTime.getMinutes();
    const closeHours = closeTime.getHours();
    const closeMinutes = closeTime.getMinutes();

    const parkTimeInMinutes = parkHours * 60 + parkMinutes;
    const openTimeInMinutes = openHours * 60 + openMinutes;
    const closeTimeInMinutes = closeHours * 60 + closeMinutes;

    if (parkTimeInMinutes < openTimeInMinutes) {
      return {
        message: (
          <>
            <span className="full-message">
              Het park opent vandaag om <Emphasis>{formatTime(openTime)} tot {formatTime(closeTime)} uur</Emphasis>
            </span>
            <span className="compact-message">
              Park nu <Emphasis>gesloten</Emphasis>, vandaag open van {formatTime(openTime).replace(':00', '')} tot {formatTime(closeTime).replace(':00', 'u')}
            </span>
          </>
        ),
        isOpen: false,
        isLoading: false
      };
    }

    if (parkTimeInMinutes >= closeTimeInMinutes) {
      if (tomorrow) {
        const tomorrowOpen = new Date(tomorrow.openingTime);
        const tomorrowClose = new Date(tomorrow.closingTime);
        return {
          message: (
            <>
              <span className="full-message">
                Het park is nu <Emphasis>gesloten</Emphasis> en is morgen geopend van {formatTime(tomorrowOpen)} tot {formatTime(tomorrowClose)} uur
              </span>
              <span className="compact-message">
                Park nu <Emphasis>gesloten</Emphasis>, morgen open van {formatTime(tomorrowOpen).replace(':00', '')} tot {formatTime(tomorrowClose).replace(':00', 'u')}
              </span>
            </>
          ),
          isOpen: false,
          isLoading: false
        };
      }
      return {
        message: (
          <>
            <span className="full-message">
              Het park is <Emphasis>gesloten</Emphasis>
            </span>
            <span className="compact-message">
              Park nu <Emphasis>gesloten</Emphasis>
            </span>
          </>
        ),
        isOpen: false,
        isLoading: false
      };
    }

    // Check if within an hour of closing
    const minutesUntilClose = closeTimeInMinutes - parkTimeInMinutes;
    if (minutesUntilClose <= 60) {
      return {
        message: (
          <>
            Het park <Emphasis>sluit over {minutesUntilClose} min</Emphasis> om {formatTime(closeTime)} uur
          </>
        ),
        isOpen: true,
        isClosingSoon: true,
        isLoading: false
      };
    }

    return {
      message: (
        <>
          Het park is nu <Emphasis>geopend</Emphasis> tot <Emphasis>{formatTime(closeTime)} uur</Emphasis>
        </>
      ),
      isOpen: true,
      isLoading: false
    };
  }, [openingHoursData]);
};

const ParkStatusBar = ({ openingHours, error }) => {
  const { message, isOpen, isClosingSoon, isLoading } = useOpeningStatus(openingHours);

  if (!message) {
    return null;
  }

  return (
    <StatusBarWrapper>
      <StatusBar isOpen={!error && isOpen} isClosingSoon={isClosingSoon} isLoading={isLoading}>
        {error ? null : message}
      </StatusBar>
    </StatusBarWrapper>
  );
};

export default ParkStatusBar; 