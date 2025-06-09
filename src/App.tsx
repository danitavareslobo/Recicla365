import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Button, Typography, Icon } from './components/atoms';
import { DashboardStats, CollectionPointsList } from './components/organisms';
import { DashboardTemplate } from './components/templates';
import { Login } from './pages/Login';
import { Register } from './pages/Register/Register'; // Página que vamos criar
import './styles/globals.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
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
          <Button onClick={handleLogout} variant="outline">
            <Icon name="close" size="sm" />
            Logout
          </Button>
          
          <Button onClick={toggleTheme} variant="outline">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />
            Tema {theme === 'light' ? 'Escuro' : 'Claro'}
          </Button>
        </div>
        
        <Typography variant="body1" color="secondary">
          Logado como: <strong>{user?.name || 'Usuário'}</strong>
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
  );
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/cadastro" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={<AppRouter />} 
      />
      
      <Route 
        path="*" 
        element={<Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
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