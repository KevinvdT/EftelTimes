import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primary}dd;
  }
`;

const ThemeToggle = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme}>
      Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
    </ToggleButton>
  );
};

export default ThemeToggle; 