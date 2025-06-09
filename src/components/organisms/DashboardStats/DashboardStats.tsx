import React from 'react';
import { Typography, Icon } from '../../atoms';
import { Card } from '../../molecules';
import './DashboardStats.css';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: 'sun' | 'moon' | 'user' | 'email' | 'password' | 'location' | 'trash' | 'edit' | 'plus' | 'search' | 'menu' | 'close' | 'recycle';
  variant?: 'default' | 'highlight' | 'stats';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label: string;
  };
  onClick?: () => void;
}

interface DashboardStatsProps {
  stats?: StatCard[];
  isLoading?: boolean;
  className?: string;
}

const defaultStats: StatCard[] = [
  {
    id: 'total-users',
    title: 'Usuários Ativos',
    value: '1,234',
    subtitle: 'Total de usuários cadastrados',
    icon: 'user',
    variant: 'stats',
    trend: {
      direction: 'up',
      value: '+12%',
      label: 'vs mês anterior',
    },
  },
  {
    id: 'collection-points',
    title: 'Pontos de Coleta',
    value: '567',
    subtitle: 'Locais cadastrados',
    icon: 'location',
    variant: 'stats',
    trend: {
      direction: 'up',
      value: '+8%',
      label: 'vs mês anterior',
    },
  },
  {
    id: 'recycled-materials',
    title: 'Materiais Reciclados',
    value: '8,901',
    subtitle: 'Itens processados',
    icon: 'recycle',
    variant: 'highlight',
    trend: {
      direction: 'up',
      value: '+23%',
      label: 'vs mês anterior',
    },
  },
  {
    id: 'eco-impact',
    title: 'Impacto Ecológico',
    value: '15.7 ton',
    subtitle: 'CO₂ evitado',
    icon: 'recycle',
    variant: 'stats',
    trend: {
      direction: 'up',
      value: '+18%',
      label: 'vs mês anterior',
    },
  },
];

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats = defaultStats,
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

  return (
    <div className={dashboardStatsClasses}>
      <div className="dashboard-stats__header">
        <Typography variant="h2" className="dashboard-stats__title">
          Estatísticas da Plataforma
        </Typography>
        <Typography variant="body2" color="secondary" className="dashboard-stats__subtitle">
          Acompanhe o impacto do Recicla365 em tempo real
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