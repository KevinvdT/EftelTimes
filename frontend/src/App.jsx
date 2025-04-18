import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import HomePage from './pages/HomePage';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${props => props.theme.typography.fonts.body};
    color: ${props => props.theme.colors.text.DEFAULT};
    background-color: #FEF7EE;
    margin: 0;
    padding: 0;
  }

  ::selection {
    background-color: #6C4839;
    color: #FEF7EE;
  }

  ::-moz-selection {
    background-color: #6C4839;
    color: #FEF7EE;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </Provider>
  );
}

export default App;
