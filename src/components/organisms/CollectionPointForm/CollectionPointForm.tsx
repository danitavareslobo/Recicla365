import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Icon } from '../../atoms';
import { FormField } from '../../molecules';
import { useAuth } from '../../../contexts/AuthContext';
import { ViaCepService } from '../../../services';
import type { CollectionPoint, WasteType, CollectionPointFormData, WasteTypeOption } from '../../../types';
import './CollectionPointForm.css';

interface CollectionPointFormProps {
  initialData?: Partial<CollectionPoint>;
  isEditing?: boolean;
  className?: string;
}

const wasteTypeOptions: WasteTypeOption[] = [
  { value: 'Vidro', label: 'Vidro', color: '#22c55e' },
  { value: 'Metal', label: 'Metal', color: '#6b7280' },
  { value: 'Papel', label: 'Papel', color: '#3b82f6' },
  { value: 'Plástico', label: 'Plástico', color: '#f59e0b' },
  { value: 'Orgânico', label: 'Orgânico', color: '#10b981' },
  { value: 'Baterias', label: 'Baterias', color: '#dc2626' },
  { value: 'Eletrônicos', label: 'Eletrônicos', color: '#8b5cf6' },
  { value: 'Óleo', label: 'Óleo', color: '#f97316' },
];

export const CollectionPointForm: React.FC<CollectionPointFormProps> = ({
  initialData,
  isEditing = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CollectionPointFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    cep: initialData?.address?.cep || '',
    street: initialData?.address?.street || '',
    number: initialData?.address?.number || '',
    complement: initialData?.address?.complement || '',
    neighborhood: initialData?.address?.neighborhood || '',
    city: initialData?.address?.city || '',
    state: initialData?.address?.state || '',
    latitude: initialData?.coordinates?.latitude?.toString() || '',
    longitude: initialData?.coordinates?.longitude?.toString() || '',
    acceptedWastes: initialData?.acceptedWastes || [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CollectionPointFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleInputChange = (field: keyof CollectionPointFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;

    if (field === 'cep') {
      value = ViaCepService.maskCep(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleWasteToggle = (wasteType: WasteType) => {
    setFormData(prev => ({
      ...prev,
      acceptedWastes: prev.acceptedWastes.includes(wasteType)
        ? prev.acceptedWastes.filter(w => w !== wasteType)
        : [...prev.acceptedWastes, wasteType],
    }));
  };

  const fetchAddressByCep = async (cep: string) => {
    if (!ViaCepService.isValidCep(cep)) {
      setErrors(prev => ({
        ...prev,
        cep: 'CEP deve ter 8 dígitos',
      }));
      return;
    }

    setIsLoadingCep(true);
    setErrors(prev => ({
      ...prev,
      cep: undefined,
    }));

    try {
      const address = await ViaCepService.getAddressByCep(cep);

      setFormData(prev => ({
        ...prev,
        cep: ViaCepService.formatCep(cep),
        street: address.logradouro || prev.street,
        neighborhood: address.bairro || prev.neighborhood,
        city: address.localidade || prev.city,
        state: `${address.localidade} - ${address.uf}` || prev.state,
      }));

      setErrors(prev => {
        const newErrors = { ...prev };
        if (address.logradouro) delete newErrors.street;
        if (address.bairro) delete newErrors.neighborhood;
        if (address.localidade) delete newErrors.city;
        if (address.uf) delete newErrors.state;
        return newErrors;
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar CEP';
      setErrors(prev => ({
        ...prev,
        cep: errorMessage,
      }));
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCepBlur = () => {
    const cleanCep = ViaCepService.cleanCep(formData.cep);
    if (cleanCep.length === 8) {
      fetchAddressByCep(cleanCep);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário submetido:', formData);
  };

  const formClasses = [
    'collection-point-form',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={formClasses}>
      <div className="collection-point-form__header">
        <div className="collection-point-form__icon">
          <Icon name={isEditing ? 'edit' : 'plus'} size="xl" color="accent" />
        </div>
        <Typography variant="h2" align="center" className="collection-point-form__title">
          {isEditing ? 'Editar Local de Coleta' : 'Cadastrar Local de Coleta'}
        </Typography>
        <Typography variant="body1" color="secondary" align="center" className="collection-point-form__subtitle">
          {isEditing 
            ? 'Atualize as informações do ponto de coleta'
            : 'Adicione um novo ponto de coleta de resíduos'
          }
        </Typography>
      </div>

      <div className="collection-point-form__user-info">
        <div className="collection-point-form__user-badge">
          <Icon name="user" size="sm" color="accent" />
          <Typography variant="body2" weight="medium">
            Responsável: {user?.name}
          </Typography>
        </div>
      </div>

      <form className="collection-point-form__form" onSubmit={handleSubmit}>
        <div className="collection-point-form__section">
          <Typography variant="h4" className="collection-point-form__section-title">
            Informações Básicas
          </Typography>

          <FormField
            id="name"
            label="Nome do Local"
            placeholder="Ex: EcoPonto Centro"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!errors.name}
            errorMessage={errors.name}
            icon="location"
            required
            disabled={isLoading}
            fullWidth
          />

          <div className="collection-point-form__field">
            <Typography variant="body2" weight="medium" className="collection-point-form__label">
              <Icon name="edit" size="sm" className="collection-point-form__label-icon" />
              Descrição
              <span className="collection-point-form__required">*</span>
            </Typography>
            <textarea
              id="description"
              placeholder="Descreva o ponto de coleta, horários de funcionamento, informações relevantes..."
              value={formData.description}
              onChange={handleInputChange('description')}
              disabled={isLoading}
              className={`collection-point-form__textarea ${errors.description ? 'collection-point-form__textarea--error' : ''}`}
              rows={4}
            />
            {errors.description && (
              <div className="collection-point-form__error">
                <Icon name="close" size="sm" color="error" />
                <Typography variant="caption" color="error">
                  {errors.description}
                </Typography>
              </div>
            )}
          </div>
        </div>

        <div className="collection-point-form__section">
          <Typography variant="h4" className="collection-point-form__section-title">
            Endereço
          </Typography>

          <FormField
            id="cep"
            label="CEP"
            placeholder="00000-000"
            value={formData.cep}
            onChange={handleInputChange('cep')}
            onBlur={handleCepBlur}
            error={!!errors.cep}
            errorMessage={errors.cep}
            icon="location"
            required
            disabled={isLoading || isLoadingCep}
            helperText={isLoadingCep ? "Buscando endereço..." : "Digite o CEP para preencher automaticamente"}
            fullWidth
          />

          <div className="collection-point-form__row">
            <FormField
              id="street"
              label="Rua"
              placeholder="Nome da rua"
              value={formData.street}
              onChange={handleInputChange('street')}
              error={!!errors.street}
              errorMessage={errors.street}
              required
              disabled={isLoading}
              fullWidth
            />

            <FormField
              id="number"
              label="Número"
              placeholder="123"
              value={formData.number}
              onChange={handleInputChange('number')}
              error={!!errors.number}
              errorMessage={errors.number}
              required
              disabled={isLoading}
              className="collection-point-form__number-field"
            />
          </div>

          <FormField
            id="complement"
            label="Complemento"
            placeholder="Apto, bloco, etc. (opcional)"
            value={formData.complement}
            onChange={handleInputChange('complement')}
            disabled={isLoading}
            fullWidth
          />

          <div className="collection-point-form__row">
            <FormField
              id="neighborhood"
              label="Bairro"
              placeholder="Nome do bairro"
              value={formData.neighborhood}
              onChange={handleInputChange('neighborhood')}
              error={!!errors.neighborhood}
              errorMessage={errors.neighborhood}
              required
              disabled={isLoading}
              fullWidth
            />

            <FormField
              id="city"
              label="Cidade"
              placeholder="Nome da cidade"
              value={formData.city}
              onChange={handleInputChange('city')}
              error={!!errors.city}
              errorMessage={errors.city}
              required
              disabled={isLoading}
              fullWidth
            />
          </div>

          <FormField
            id="state"
            label="Estado"
            placeholder="Nome do estado"
            value={formData.state}
            onChange={handleInputChange('state')}
            error={!!errors.state}
            errorMessage={errors.state}
            required
            disabled={isLoading}
            fullWidth
          />
        </div>

        <div className="collection-point-form__section">
          <Typography variant="h4" className="collection-point-form__section-title">
            Coordenadas Geográficas
          </Typography>

          <div className="collection-point-form__row">
            <FormField
              id="latitude"
              label="Latitude"
              type="number"
              placeholder="-27.5954"
              value={formData.latitude}
              onChange={handleInputChange('latitude')}
              error={!!errors.latitude}
              errorMessage={errors.latitude}
              required
              disabled={isLoading}
              fullWidth
            />

            <FormField
              id="longitude"
              label="Longitude"
              type="number"
              placeholder="-48.5480"
              value={formData.longitude}
              onChange={handleInputChange('longitude')}
              error={!!errors.longitude}
              errorMessage={errors.longitude}
              required
              disabled={isLoading}
              fullWidth
            />
          </div>
        </div>

        <div className="collection-point-form__section">
          <Typography variant="h4" className="collection-point-form__section-title">
            Tipos de Resíduos Aceitos
          </Typography>
          <Typography variant="body2" color="secondary" className="collection-point-form__section-subtitle">
            Selecione quais tipos de materiais são aceitos neste ponto de coleta
          </Typography>

          <div className="collection-point-form__waste-grid">
            {wasteTypeOptions.map((waste) => (
              <button
                key={waste.value}
                type="button"
                onClick={() => handleWasteToggle(waste.value)}
                disabled={isLoading}
                className={`collection-point-form__waste-option ${
                  formData.acceptedWastes.includes(waste.value) 
                    ? 'collection-point-form__waste-option--selected' 
                    : ''
                }`}
                style={{
                  borderColor: formData.acceptedWastes.includes(waste.value) ? waste.color : undefined,
                  backgroundColor: formData.acceptedWastes.includes(waste.value) ? `${waste.color}15` : undefined,
                  color: formData.acceptedWastes.includes(waste.value) ? waste.color : undefined,
                }}
              >
                <div
                  className="collection-point-form__waste-indicator"
                  style={{ backgroundColor: waste.color }}
                />
                <Typography variant="body2" weight="medium">
                  {waste.label}
                </Typography>
              </button>
            ))}
          </div>

          {errors.acceptedWastes && (
            <div className="collection-point-form__error">
              <Icon name="close" size="sm" color="error" />
              <Typography variant="caption" color="error">
                {errors.acceptedWastes}
              </Typography>
            </div>
          )}
        </div>

        <div className="collection-point-form__actions">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            fullWidth
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? (
              <>
                <Icon name="recycle" size="sm" />
                {isEditing ? 'Salvando...' : 'Cadastrando...'}
              </>
            ) : (
              <>
                <Icon name={isEditing ? 'edit' : 'plus'} size="sm" />
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Local'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};