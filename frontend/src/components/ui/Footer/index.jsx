import styled from 'styled-components';

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 2rem 1rem;
  color: #6C4839;
  font-size: 0.875rem;
  line-height: 1.3;

  p {
    margin: 0;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <p>The Eftel Times is gemaakt door fans</p>
      <p>en is niet gelieerd aan de Efteling</p>
    </FooterWrapper>
  );
};

export default Footer; 