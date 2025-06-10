import React from 'react';
import { Header } from '../../components/organisms';
import { MainTemplate } from '../../components/templates';
import { CollectionPointForm } from '../../components/organisms/CollectionPointForm';
import './CadastroLocal.css';

export const CadastroLocal: React.FC = () => {
  return (
    <>
      <Header />
      <MainTemplate variant="default">
        <div className="create-collection-point">
          <div className="create-collection-point__container">
            <CollectionPointForm />
          </div>
        </div>
      </MainTemplate>
    </>
  );
};