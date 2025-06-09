import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Button } from './components/atoms/Button';
import { Input } from './components/atoms/Input';
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
        <h2>Teste do Componente Input</h2>
        
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <Input label="Nome" placeholder="Digite seu nome" />
          <Input label="Email" type="email" placeholder="seuemail@exemplo.com" required />
          <Input label="Senha" type="password" placeholder="Sua senha" />
          <Input label="Data de Nascimento" type="date" />
          <Input label="Telefone" type="tel" placeholder="(11) 99999-9999" />
          <Input 
            label="Campo com erro" 
            placeholder="Campo inválido" 
            error 
            errorMessage="Este campo é obrigatório" 
          />
          <Input label="Campo desabilitado" placeholder="Não editável" disabled />
          <Input placeholder="Input sem label" fullWidth />
        </div>
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