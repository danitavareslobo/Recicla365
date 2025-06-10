import React from 'react';
import { Header, Navigation } from '../../components/organisms';
import { MainTemplate } from '../../components/templates';
import { CollectionPointForm } from '../../components/organisms/CollectionPointForm';
import './CadastroLocal.css';

export const CadastroLocal: React.FC = () => {
  return (
    <>
      <Header />
      <Navigation variant="horizontal" />
      <MainTemplate variant="default">
        <div className="cadastro-local">
          <div className="cadastro-local__container">
            <CollectionPointForm />
          </div>
        </div>
      </MainTemplate>
    </>
  );
};