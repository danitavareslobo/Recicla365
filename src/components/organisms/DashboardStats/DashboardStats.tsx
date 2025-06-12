import React from 'react';
import { Typography, Icon } from '../../atoms';
import { Card } from '../../molecules';
import './DashboardStats.css';
import type { DashboardStatsProps, StatCard } from '../../../types';

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats = [],
  isLoading = false,
  className = '',
}) => {
  const dashboardStatsClasses = [
    'dashboard-stats',
    isLoading && 'dashboard-stats--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR');
    }
    return value;
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'plus';
      case 'down':
        return 'close';
      default:
        return 'menu';
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className={dashboardStatsClasses}>
        <div className="dashboard-stats__header">
          <Typography variant="h2" className="dashboard-stats__title">
            Estatísticas
          </Typography>
          <Typography variant="body2" color="secondary" className="dashboard-stats__subtitle">
            Carregando dados...
          </Typography>
        </div>
        
        <div className="dashboard-stats__grid">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="dashboard-stats__skeleton">
              <div className="dashboard-stats__skeleton-header"></div>
              <div className="dashboard-stats__skeleton-value"></div>
              <div className="dashboard-stats__skeleton-subtitle"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className={dashboardStatsClasses}>
        <div className="dashboard-stats__header">
          <Typography variant="h2" className="dashboard-stats__title">
            Estatísticas da Plataforma
          </Typography>
          <Typography variant="body2" color="secondary" className="dashboard-stats__subtitle">
            Carregando estatísticas baseadas nos dados reais...
          </Typography>
        </div>
        
        <div className="dashboard-stats__empty">
          <Icon name="recycle" size="xl" color="secondary" />
          <Typography variant="h4" color="secondary">
            Estatísticas não disponíveis
          </Typography>
          <Typography variant="body2" color="secondary">
            Aguarde enquanto calculamos os dados do sistema...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboardStatsClasses}>
      <div className="dashboard-stats__header">
        <Typography variant="h2" className="dashboard-stats__title">
          Estatísticas da Plataforma
        </Typography>
        <Typography variant="body2" color="secondary" className="dashboard-stats__subtitle">
          Dados reais baseados em usuários e pontos de coleta cadastrados
        </Typography>
      </div>
      
      <div className="dashboard-stats__grid">
        {stats.map((stat) => (
          <Card
            key={stat.id}
            title={stat.title}
            subtitle={stat.subtitle}
            icon={stat.icon}
            variant={stat.variant}
            clickable={!!stat.onClick}
            onClick={stat.onClick}
            className="dashboard-stats__card"
          >
            <div className="dashboard-stats__content">
              <div className="dashboard-stats__value-section">
                <Typography 
                  variant="h1" 
                  color="accent" 
                  className="dashboard-stats__value"
                >
                  {formatValue(stat.value)}
                </Typography>
                
                {stat.trend && (
                  <div className={`dashboard-stats__trend dashboard-stats__trend--${stat.trend.direction}`}>
                    <Icon 
                      name={getTrendIcon(stat.trend.direction)} 
                      size="sm" 
                      color={getTrendColor(stat.trend.direction)}
                    />
                    <Typography 
                      variant="caption" 
                      color={getTrendColor(stat.trend.direction)}
                      weight="medium"
                    >
                      {stat.trend.value}
                    </Typography>
                  </div>
                )}
              </div>
              
              {stat.trend && (
                <Typography 
                  variant="caption" 
                  color="secondary" 
                  className="dashboard-stats__trend-label"
                >
                  {stat.trend.label}
                </Typography>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="dashboard-stats__footer">
        <Typography variant="caption" color="secondary" align="center">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </Typography>
      </div>
    </div>
  );
};