import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { useGetOpeningHoursQuery } from '../../../store/api';
import ParkStatusBar from './StatusBar';

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

const Header = () => {
  const { data: openingHours, error } = useGetOpeningHoursQuery();

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
      <ParkStatusBar openingHours={openingHours} error={error} />
    </>
  );
};

export default Header; 