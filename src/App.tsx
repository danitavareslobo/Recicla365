import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Button, Typography, Icon } from './components/atoms';
import { Header, Navigation, LoginForm, DashboardStats, CollectionPointsList } from './components/organisms';
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
      <Header />
      
      <Navigation variant="horizontal" />
      
      <div className="container" style={{ padding: '2rem' }}>
        <Typography variant="h1" align="center">
          Recicla365 - Teste Header e Navigation
        </Typography>
        
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <Typography variant="h3" style={{ marginBottom: '1rem' }}>
            Controles de Teste
          </Typography>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Button onClick={handleToggleAuth} variant="primary">
              <Icon name="user" size="sm" />
              {isAuthenticated ? 'Fazer Logout' : 'Simular Login'}
            </Button>
            
            <Button onClick={toggleTheme} variant="outline">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />
              Alternar Tema
            </Button>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--bg-primary)', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)'
          }}>
            <Typography variant="h4" style={{ marginBottom: '0.5rem' }}>
              Status Atual:
            </Typography>
            <Typography variant="body1">
              <strong>Autenticação:</strong> {isAuthenticated ? `✅ Logado como ${user?.name || 'Usuário Teste'}` : '❌ Não logado'}
            </Typography>
            <Typography variant="body1">
              <strong>Tema:</strong> {theme === 'light' ? '☀️ Claro' : '🌙 Escuro'}
            </Typography>
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <Typography variant="h3" style={{ marginBottom: '1rem' }}>
            Instruções de Teste
          </Typography>
          
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                <strong>Header:</strong> Observe o logo, nome da aplicação, toggle de tema e área do usuário
              </Typography>
            </li>
            <li>
              <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                <strong>Navigation:</strong> Só aparece quando logado - teste fazer login primeiro
              </Typography>
            </li>
            <li>
              <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                <strong>LoginForm:</strong> Use o formulário abaixo ou o botão "Simular Login"
              </Typography>
            </li>
            <li>
              <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                <strong>Responsividade:</strong> Redimensione a janela para ver adaptações mobile
              </Typography>
            </li>
          </ul>
        </div>

        {!isAuthenticated && (
          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <Typography variant="h3" style={{ marginBottom: '1rem' }} align="center">
              Teste do LoginForm
            </Typography>
            <LoginForm 
              onRegisterClick={() => alert('Clicou em Criar conta!')}
            />
          </div>
        )}

        {isAuthenticated && (
          <div style={{ 
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <Typography variant="h3" style={{ marginBottom: '1rem' }} align="center">
                Teste do DashboardStats
              </Typography>
              <DashboardStats />
            </div>

            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <Typography variant="h3" style={{ marginBottom: '1rem' }} align="center">
                Teste do CollectionPointsList
              </Typography>
              <CollectionPointsList 
                onView={(point) => alert(`Ver ponto: ${point.name}`)}
                onEdit={(point) => alert(`Editar ponto: ${point.name}`)}
                onDelete={(point) => alert(`Excluir ponto: ${point.name}`)}
                onCreate={() => alert('Criar novo ponto!')}
              />
            </div>
          </div>
        )}
      </div>
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