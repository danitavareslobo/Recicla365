import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login, Register, Dashboard, CadastroLocal, LocaisColeta } from './pages';
import NotFoundTemplate from './components/templates/NotFoundTemplate';
import './styles/globals.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
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
              path="/cadastro-local" 
              element={
                <PrivateRoute>
                  <CadastroLocal />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/cadastro-local/editar/:id" 
              element={
                <PrivateRoute>
                  <CadastroLocal />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/locais-coleta" 
              element={
                <PrivateRoute>
                  <LocaisColeta />
                </PrivateRoute>
              } 
            />
                        
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route 
              path="*" 
              element={<NotFoundTemplate />} 
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;