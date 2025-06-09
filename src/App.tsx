import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Button } from './components/atoms/Button';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>Recicla365 - Teste de Componentes</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Tema atual: {theme === 'light' ? 'Claro' : 'Escuro'}</h2>
        <Button onClick={toggleTheme} variant="outline">
          Alternar Tema
        </Button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Teste do Componente Button</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;