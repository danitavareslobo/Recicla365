import React, { useState, useEffect } from 'react';
import { Button, Typography, Icon } from '../../atoms';
import { Card, SearchBox } from '../../molecules';
import type { 
  CollectionPointsListProps, 
  CardAction, 
  CollectionPoint, 
  WasteType 
} from '../../../types';
import './CollectionPointsList.css';

export const CollectionPointsList: React.FC<CollectionPointsListProps> = ({
  collectionPoints = [],
  isLoading = false,
  showActions = true,
  searchable = true,
  className = '',
  onView,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPoints, setFilteredPoints] = useState<CollectionPoint[]>(collectionPoints);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPoints(collectionPoints);
    } else {
      handleSearch(searchTerm);
    }
  }, [collectionPoints, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredPoints(collectionPoints);
      return;
    }

    const filtered = collectionPoints.filter(point =>
      point.name.toLowerCase().includes(term.toLowerCase()) ||
      point.description.toLowerCase().includes(term.toLowerCase()) ||
      point.address.neighborhood.toLowerCase().includes(term.toLowerCase()) ||
      point.address.city.toLowerCase().includes(term.toLowerCase()) ||
      point.acceptedWastes.some(waste => 
        waste.toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredPoints(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredPoints(collectionPoints);
  };

  const getWasteTypeColor = (wasteType: WasteType): string => {
    const colors: Record<WasteType, string> = {
      'Vidro': '#22c55e',
      'Metal': '#6b7280',
      'Papel': '#3b82f6',
      'Plástico': '#f59e0b',
      'Orgânico': '#10b981',
      'Baterias': '#dc2626',
      'Eletrônicos': '#8b5cf6',
      'Óleo': '#f97316',
    };
    return colors[wasteType] || '#6b7280';
  };

  const formatAddress = (address: CollectionPoint['address']): string => {
    return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.uf}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const createCardActions = (point: CollectionPoint): CardAction[] => {
    if (!showActions) return [];

    const actions: CardAction[] = [];

    if (onView) {
      actions.push({
        id: 'view',
        label: 'Ver',
        icon: 'search',
        variant: 'outline',
        onClick: () => onView(point),
      });
    }

    if (onEdit) {
      actions.push({
        id: 'edit',
        label: 'Editar',
        icon: 'edit',
        variant: 'primary',
        onClick: () => onEdit(point),
      });
    }

    if (onDelete) {
      actions.push({
        id: 'delete',
        label: 'Excluir',
        icon: 'trash',
        variant: 'danger',
        onClick: () => onDelete(point),
      });
    }

    return actions;
  };

  const listClasses = [
    'collection-points-list',
    isLoading && 'collection-points-list--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isLoading) {
    return (
      <div className={listClasses}>
        <div className="collection-points-list__header">
          <Typography variant="h2">Pontos de Coleta</Typography>
          <div className="collection-points-list__skeleton-search"></div>
        </div>
        
        <div className="collection-points-list__grid">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="collection-points-list__skeleton-card">
              <div className="collection-points-list__skeleton-header"></div>
              <div className="collection-points-list__skeleton-content"></div>
              <div className="collection-points-list__skeleton-footer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={listClasses}>
      <div className="collection-points-list__header">
        <div className="collection-points-list__title-section">
          <Typography variant="h2" className="collection-points-list__title">
            Pontos de Coleta
          </Typography>
          <Typography variant="body2" color="secondary" className="collection-points-list__subtitle">
            {filteredPoints.length} ponto{filteredPoints.length !== 1 ? 's' : ''} encontrado{filteredPoints.length !== 1 ? 's' : ''}
          </Typography>
        </div>

        <div className="collection-points-list__actions">
          {searchable && (
            <SearchBox
              placeholder="Buscar por nome, local ou tipo de resíduo..."
              value={searchTerm}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              onChange={setSearchTerm}
              className="collection-points-list__search"
            />
          )}
          
          {onCreate && (
            <Button variant="primary" onClick={onCreate} className="collection-points-list__create-button">
              <Icon name="plus" size="sm" />
              Novo Ponto
            </Button>
          )}
        </div>
      </div>

      {filteredPoints.length === 0 ? (
        <div className="collection-points-list__empty">
          <Icon name="location" size="xl" color="secondary" />
          <Typography variant="h4" color="secondary">
            {searchTerm ? 'Nenhum ponto encontrado' : 'Nenhum ponto cadastrado'}
          </Typography>
          <Typography variant="body2" color="secondary">
            {searchTerm 
              ? 'Tente buscar por outros termos ou limpe o filtro'
              : 'Seja o primeiro a cadastrar um ponto de coleta'
            }
          </Typography>
          {!searchTerm && onCreate && (
            <Button variant="primary" onClick={onCreate}>
              <Icon name="plus" size="sm" />
              Cadastrar Primeiro Ponto
            </Button>
          )}
        </div>
      ) : (
        <div className="collection-points-list__grid">
          {filteredPoints.map((point) => (
            <Card
              key={point.id}
              title={point.name}
              subtitle={formatAddress(point.address)}
              icon="location"
              clickable={!!onView && !showActions}
              onClick={showActions ? undefined : () => onView?.(point)}
              actions={createCardActions(point)}
              showActionsOnHover={true}
              className="collection-points-list__card"
            >
              <div className="collection-points-list__card-content">
                <Typography variant="body2" className="collection-points-list__description">
                  {point.description}
                </Typography>

                <div className="collection-points-list__wastes">
                  <Typography variant="caption" color="secondary" weight="medium">
                    Materiais aceitos:
                  </Typography>
                  <div className="collection-points-list__waste-tags">
                    {point.acceptedWastes.map((waste) => (
                      <span
                        key={waste}
                        className="collection-points-list__waste-tag"
                        style={{ 
                          backgroundColor: `${getWasteTypeColor(waste)}20`,
                          borderColor: `${getWasteTypeColor(waste)}40`,
                          color: getWasteTypeColor(waste)
                        }}
                      >
                        {waste}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="collection-points-list__meta">
                  <Typography variant="caption" color="secondary">
                    Cadastrado em {formatDate(point.createdAt)}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};