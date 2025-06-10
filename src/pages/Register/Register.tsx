import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../../components/templates';
import { RegisterForm } from '../../components/organisms';
import './Register.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <AuthTemplate
      title="Crie sua conta no Recicla365"
      subtitle="Junte-se à comunidade sustentável e faça a diferença"
      showBranding={true}
      backgroundVariant="gradient"
      className="register-page"
    >
      <RegisterForm 
        onLoginClick={handleLoginClick}
        className="register-page__form"
      />
    </AuthTemplate>
  );
};