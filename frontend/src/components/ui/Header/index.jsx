import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { useGetOpeningHoursQuery } from '../../../store/api';
import { useMemo } from 'react';

const GlobalStyle = createGlobalStyle`
  @property --x-pos {
    syntax: '<number>';
    initial-value: 80;
    inherits: false;
  }
`;

const moveLight = keyframes`
  0% {
    --x-pos: 80;
  }
  50% {
    --x-pos: 20;
  }
  100% {
    --x-pos: 80;
  }
`;

const HeaderWrapper = styled.header`
  background: #BCCCDC;
  padding: 0.5rem 0 0.25rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    --x-pos: 80;
    background: radial-gradient(
      circle at calc(var(--x-pos) * 1%) 20%,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    animation: ${moveLight} 60s ease-in-out infinite;
    pointer-events: none;
  }
`;

const Logo = styled.div`
  margin: 0 auto;
  max-width: 300px;
  padding: 0.5rem;
  position: relative;
`;

const LogoImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 180px;
  display: block;
`;

const StatusBarWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const StatusBar = styled.div`
  background-color: ${props => {
    if (props.isLoading) return 'transparent';
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
  }) + ' uur';
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
    const parkDate = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));

    if (!today) {
      const tomorrowOpen = new Date(tomorrow.openingTime);
      const tomorrowClose = new Date(tomorrow.closingTime);
      return {
        message: (
          <>
            Het park is nu <Emphasis>gesloten</Emphasis> en gaat morgen om <Emphasis>{formatTime(tomorrowOpen)}</Emphasis> open
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
            Het park is nu <Emphasis>gesloten</Emphasis> en gaat vandaag om <Emphasis>{formatTime(openTime)}</Emphasis> open
          </>
        ),
        isOpen: false,
        isLoading: false
      };
    }

    if (parkTimeInMinutes >= closeTimeInMinutes) {
      if (tomorrow) {
        const tomorrowOpen = new Date(tomorrow.openingTime);
        return {
          message: (
            <>
              Het park is nu <Emphasis>gesloten</Emphasis> en gaat morgen om <Emphasis>{formatTime(tomorrowOpen)}</Emphasis> open
            </>
          ),
          isOpen: false,
          isLoading: false
        };
      }
      return {
        message: (
          <>
            Het park is <Emphasis>gesloten</Emphasis>
          </>
        ),
        isOpen: false,
        isLoading: false
      };
    }

    return {
      message: (
        <>
          Het park is nu <Emphasis>geopend</Emphasis> tot <Emphasis>{formatTime(closeTime)}</Emphasis>
        </>
      ),
      isOpen: true,
      isLoading: false
    };
  }, [openingHoursData]);
};

const Header = () => {
  const { data: openingHours, error } = useGetOpeningHoursQuery();
  const { message, isOpen, isLoading } = useOpeningStatus(openingHours);

  return (
    <>
      <GlobalStyle />
      <HeaderWrapper>
        <Logo>
          <LogoImage
            src="/assets/images/EftelTimes-logo.svg"
            alt="EftelTimes"
          />
        </Logo>
      </HeaderWrapper>
      {message && (
        <StatusBarWrapper>
          <StatusBar isOpen={!error && isOpen} isLoading={isLoading}>
            {error ? null : message}
          </StatusBar>
        </StatusBarWrapper>
      )}
    </>
  );
};

export default Header; 