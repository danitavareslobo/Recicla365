import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Icon } from '../../components/atoms';
import { DashboardStats, CollectionPointsList } from '../../components/organisms';
import { DashboardTemplate } from '../../components/templates';
import { useAuth } from '../../contexts/AuthContext';
import { CollectionPointService } from '../../services';
import { UserService } from '../../services';
import type { CollectionPoint, StatCard } from '../../types';
import { mockUsers } from '../../data';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [allCollectionPoints, setAllCollectionPoints] = useState<CollectionPoint[]>([]);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      const allPoints = await CollectionPointService.getAllCollectionPoints();
      setAllCollectionPoints(allPoints);
      
      const recentPoints = allPoints
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);
      setCollectionPoints(recentPoints);
      
      const dashboardStats = await generateCorrectStats(allPoints);
      setStats(dashboardStats);
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCorrectStats = async (points: CollectionPoint[]): Promise<StatCard[]> => {
    try {
      const mockUsersCount = mockUsers.length;
      const totalUsersCount = await UserService.getTotalUsersCount(mockUsersCount);
      const userStats = await UserService.getUserStats();
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentRegisteredUsers = userStats.recentCount;
      
      const totalPoints = points.length;
      const recentPoints = points.filter(point => {
        const pointDate = new Date(point.createdAt);
        return pointDate >= thirtyDaysAgo;
      }).length;

      const allAcceptedWastes = points.flatMap(point => point.acceptedWastes);
      const uniqueWasteTypes = new Set(allAcceptedWastes);
      const uniqueTypesCount = uniqueWasteTypes.size;
      
      const avgMaterialsPerPoint = totalPoints > 0 ? allAcceptedWastes.length / totalPoints : 0;
      const estimatedMonthlyCollection = totalPoints * avgMaterialsPerPoint * 50;
      const co2Avoided = (estimatedMonthlyCollection * 0.8) / 1000;

      const allUserCities = new Set([
        ...mockUsers.map(user => user.address.city),
        ...points.map(point => point.address.city)
      ]);
      
      const totalCities = Math.max(allUserCities.size, userStats.citiesCount);

      return [
        {
          id: 'total-users',
          title: 'Usuários Ativos',
          value: totalUsersCount,
          subtitle: `${recentRegisteredUsers} novos este mês`,
          icon: 'user',
          variant: 'stats',
          trend: {
            direction: recentRegisteredUsers > 0 ? 'up' : 'neutral',
            value: recentRegisteredUsers > 0 ? `+${recentRegisteredUsers}` : '0',
            label: 'vs mês anterior',
          },
        },
        {
          id: 'collection-points',
          title: 'Pontos de Coleta',
          value: totalPoints,
          subtitle: `Em ${totalCities} cidade${totalCities !== 1 ? 's' : ''}`,
          icon: 'location',
          variant: 'highlight',
          trend: {
            direction: recentPoints > 0 ? 'up' : 'neutral',
            value: recentPoints > 0 ? `+${recentPoints}` : '0',
            label: 'novos este mês',
          },
        },
        {
          id: 'materials-types',
          title: 'Tipos de Materiais',
          value: uniqueTypesCount,
          subtitle: `${allAcceptedWastes.length} materiais aceitos`,
          icon: 'recycle',
          variant: 'stats',
          trend: {
            direction: allAcceptedWastes.length > 0 ? 'up' : 'neutral',
            value: totalPoints > 0 ? `${Math.round(avgMaterialsPerPoint * 10) / 10}` : '0',
            label: 'média por ponto',
          },
        },
        {
          id: 'eco-impact',
          title: 'Impacto Ecológico',
          value: `${co2Avoided.toFixed(1)} ton`,
          subtitle: 'CO₂ evitado/mês (estimado)',
          icon: 'recycle',
          variant: 'stats',
          trend: {
            direction: co2Avoided > 0 ? 'up' : 'neutral',
            value: totalPoints > 0 ? `${Math.round((co2Avoided / totalPoints) * 100) / 100}` : '0',
            label: 'ton por ponto',
          },
        },
      ];
    } catch (error) {
      console.error('Erro ao gerar estatísticas:', error);
      return [
        {
          id: 'total-users',
          title: 'Usuários Ativos',
          value: 13,
          subtitle: '1 novo este mês',
          icon: 'user',
          variant: 'stats',
          trend: {
            direction: 'up',
            value: '+1',
            label: 'vs mês anterior',
          },
        },
        {
          id: 'collection-points',
          title: 'Pontos de Coleta',
          value: points.length,
          subtitle: 'Locais cadastrados',
          icon: 'location',
          variant: 'highlight',
        },
        {
          id: 'materials-types',
          title: 'Tipos de Materiais',
          value: new Set(points.flatMap(p => p.acceptedWastes)).size,
          subtitle: `${points.flatMap(p => p.acceptedWastes).length} materiais aceitos`,
          icon: 'recycle',
          variant: 'stats',
        },
        {
          id: 'eco-impact',
          title: 'Impacto Ecológico',
          value: '0.0 ton',
          subtitle: 'CO₂ evitado/mês',
          icon: 'recycle',
          variant: 'stats',
        },
      ];
    }
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
              Acompanhe o impacto real da reciclagem em Santa Catarina.
            </Typography>
          </div>
        </header>

        <section className="dashboard__stats-section">
          <DashboardStats stats={stats} isLoading={false} />
        </section>

        <section className="dashboard__points-section">
          <div className="dashboard__points-header">
            <Typography variant="h2" className="dashboard__section-title">
              Pontos de Coleta Recentes
            </Typography>
            <Typography variant="body2" color="secondary" className="dashboard__section-subtitle">
              {collectionPoints.length > 0 
                ? `Últimos ${collectionPoints.length} pontos cadastrados na plataforma`
                : 'Nenhum ponto de coleta cadastrado ainda'
              }
            </Typography>
          </div>
          
          {collectionPoints.length > 0 ? (
            <CollectionPointsList
              collectionPoints={collectionPoints}
              onView={undefined}
              onEdit={undefined}
              onDelete={undefined}
              onCreate={undefined}
              searchable={false}
              showActions={false}
              className="dashboard__points-list"
            />
          ) : (
            <div className="dashboard__empty-state">
              <Icon name="plus" size="xl" color="secondary" />
              <Typography variant="h3" color="secondary" align="center">
                Cadastre o primeiro ponto de coleta
              </Typography>
              <Typography variant="body1" color="secondary" align="center">
                Comece contribuindo para a rede de reciclagem
              </Typography>
            </div>
          )}
        </section>
      </div>
    </DashboardTemplate>
  );
};