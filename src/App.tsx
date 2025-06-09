import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Button, Typography, Icon } from './components/atoms';
import { LoginForm, DashboardStats, CollectionPointsList } from './components/organisms';
import { AuthTemplate, DashboardTemplate } from './components/templates';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleToggleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login('teste@email.com', '123456');
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <AuthTemplate
          title="Bem-vindo de volta!"
          subtitle="Faça login para continuar sua jornada sustentável"
        >
          <div style={{ marginBottom: '1rem' }}>
            <Button onClick={handleToggleAuth} variant="primary" fullWidth>
              <Icon name="user" size="sm" />
              Simular Login Rápido
            </Button>
          </div>
          
          <LoginForm 
            onRegisterClick={() => alert('Ir para página de cadastro!')}
          />
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button onClick={toggleTheme} variant="outline" size="sm">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />
              Tema {theme === 'light' ? 'Escuro' : 'Claro'}
            </Button>
          </div>
        </AuthTemplate>
      ) : (
        <DashboardTemplate>
          <div style={{ marginBottom: '2rem' }}>
            <Typography variant="h1" style={{ marginBottom: '1rem' }}>
              Dashboard do Recicla365
            </Typography>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <Button onClick={handleToggleAuth} variant="outline">
                <Icon name="close" size="sm" />
                Logout
              </Button>
              
              <Button onClick={toggleTheme} variant="outline">
                <Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />
                Tema {theme === 'light' ? 'Escuro' : 'Claro'}
              </Button>
            </div>
            
            <Typography variant="body1" color="secondary">
              Logado como: <strong>{user?.name || 'Usuário Teste'}</strong>
            </Typography>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <DashboardStats />
          </div>

          <div>
            <CollectionPointsList 
              onView={(point) => alert(`Ver ponto: ${point.name}`)}
              onEdit={(point) => alert(`Editar ponto: ${point.name}`)}
              onDelete={(point) => alert(`Excluir ponto: ${point.name}`)}
              onCreate={() => alert('Criar novo ponto!')}
            />
          </div>
        </DashboardTemplate>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;