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
    animation: ${moveLight} 30s ease-in-out infinite;
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

const useOpeningStatus = (openingHoursData) => {
  return useMemo(() => {
    if (!openingHoursData) {
      return { message: "Laden...", isOpen: false, isLoading: true };
    }

    const { today, tomorrow, timezone } = openingHoursData;
    if (!today && !tomorrow) {
      return { message: "Openingstijden niet beschikbaar", isOpen: false, isLoading: false };
    }

    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!today) {
      const tomorrowOpen = new Date(tomorrow.openingTime);
      const tomorrowClose = new Date(tomorrow.closingTime);
      return {
        message: (
          <>
            Het park is nu <Emphasis>gesloten</Emphasis> en gaat morgen om <Emphasis>{tomorrowOpen.getHours()}:00 uur</Emphasis> open
          </>
        ),
        isOpen: false,
        isLoading: false
      };
    }

    const openTime = new Date(today.openingTime);
    const closeTime = new Date(today.closingTime);

    if (now < openTime) {
      return {
        message: (
          <>
            Het park is nu <Emphasis>gesloten</Emphasis> en gaat vandaag om <Emphasis>{openTime.getHours()}:00 uur</Emphasis> open
          </>
        ),
        isOpen: false,
        isLoading: false
      };
    }

    if (now > closeTime) {
      if (tomorrow) {
        const tomorrowOpen = new Date(tomorrow.openingTime);
        return {
          message: (
            <>
              Het park is nu <Emphasis>gesloten</Emphasis> en gaat morgen om <Emphasis>{tomorrowOpen.getHours()}:00 uur</Emphasis> open
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
          Het park is nu <Emphasis>geopend</Emphasis> tot <Emphasis>{closeTime.getHours()}:00 uur</Emphasis>
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
      <StatusBarWrapper>
        <StatusBar isOpen={!error && isOpen} isLoading={isLoading}>
          {error ? "Kan openingstijden niet laden" : message}
        </StatusBar>
      </StatusBarWrapper>
    </>
  );
};

export default Header; 