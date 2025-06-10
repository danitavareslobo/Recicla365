import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Icon } from '../../components/atoms';
import { DashboardStats, CollectionPointsList } from '../../components/organisms';
import { DashboardTemplate } from '../../components/templates';
import { useAuth } from '../../contexts/AuthContext';
import type { CollectionPoint } from '../../types';
import { getRecentCollectionPoints } from '../../data/collectionPoints';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const recentPoints = getRecentCollectionPoints(6);
        setCollectionPoints(recentPoints);
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleCreatePoint = () => {
    navigate('/collection-points/create');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (isLoading) {
    return (
      <DashboardTemplate>
        <div className="dashboard dashboard--loading">
          <div className="dashboard__header">
            <div className="dashboard__skeleton dashboard__skeleton--title"></div>
            <div className="dashboard__skeleton dashboard__skeleton--subtitle"></div>
          </div>
          <DashboardStats isLoading={true} />
        </div>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate>
      <div className="dashboard">
        <header className="dashboard__header">
          <div className="dashboard__welcome">
            <Typography variant="h1" className="dashboard__title">
              {getGreeting()}, {user?.name.split(' ')[0]}!
            </Typography>
            <Typography variant="body1" color="secondary" className="dashboard__subtitle">
              Bem-vindo ao painel de controle do Recicla365. 
              Aqui você pode acompanhar suas estatísticas e gerenciar pontos de coleta.
            </Typography>
          </div>
        </header>

        <section className="dashboard__stats-section">
          <DashboardStats isLoading={false} />
        </section>

        <section className="dashboard__points-section">
          <CollectionPointsList
            collectionPoints={collectionPoints.slice(0, 6)}
            onView={undefined}
            onEdit={undefined}
            onDelete={undefined}
            onCreate={handleCreatePoint}
            searchable={false}
            showActions={false}
            className="dashboard__points-list"
          />
        </section>

        <section className="dashboard__insights-section">
          <div className="dashboard__insights-grid">
            <div className="dashboard__insight-card">
              <Icon name="recycle" size="lg" color="accent" />
              <div className="dashboard__insight-content">
                <Typography variant="h4" color="accent">
                  Impacto Positivo
                </Typography>
                <Typography variant="body2" color="secondary">
                  Cada ponto cadastrado contribui para um futuro mais sustentável
                </Typography>
              </div>
            </div>

            <div className="dashboard__insight-card">
              <Icon name="location" size="lg" color="accent" />
              <div className="dashboard__insight-content">
                <Typography variant="h4" color="accent">
                  Rede Conectada
                </Typography>
                <Typography variant="body2" color="secondary">
                  Faça parte da maior rede de reciclagem de Santa Catarina
                </Typography>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardTemplate>
  );
};