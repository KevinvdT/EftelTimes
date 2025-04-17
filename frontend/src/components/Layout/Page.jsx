import styled from 'styled-components';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import Container from './Container';

const Main = styled.main`
  min-height: calc(100vh - 200px); // Adjust based on header/footer height
  padding: 2rem 0;
`;

const Page = ({ children }) => {
  return (
    <>
      <Header />
      <Main>
        <Container>
          {children}
        </Container>
      </Main>
      <Footer />
    </>
  );
};

export default Page; 