import React from 'react';
import { Header, Navigation } from '../../components/organisms';
import { CollectionPointForm } from '../../components/organisms';
import './CadastroLocal.css';

export const CadastroLocal: React.FC = () => {
  return (
    <>
      <Header />
      <Navigation variant="horizontal" />
      <div className="cadastro-local">
        <div className="cadastro-local__container">
          <CollectionPointForm />
        </div>
      </div>
    </>
  );
};