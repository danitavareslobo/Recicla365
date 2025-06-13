import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Icon } from '../../atoms';
import { FormField, FormProgress, LocationActions } from '../../molecules';
import { useAuth } from '../../../contexts/AuthContext';
import { ViaCepService, ValidationService, CollectionPointService, GeolocationService } from '../../../services';
import { FormUtils } from '../../../utils';
import type { CollectionPoint, WasteType, CollectionPointFormData, WasteTypeOption, CollectionPointFormProps, GeolocationPosition } from '../../../types';
import './CollectionPointForm.css';

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState({ percentage: 0, completed: 0, total: 0 });

  useEffect(() => {
    const progress = FormUtils.calculateProgress(formData);
    setFormProgress(progress);
  }, [formData]);

  useEffect(() => {
    if (isEditing && initialData?.id) {
      loadCollectionPointData(initialData.id);
    }
  }, [isEditing, initialData?.id]);

  const loadCollectionPointData = async (id: string) => {
    try {
      setIsLoading(true);
      const point = await CollectionPointService.getCollectionPointById(id);
      
      if (point) {
        setFormData({
          name: point.name,
          description: point.description,
          cep: point.address.cep,
          street: point.address.street,
          number: point.address.number,
          complement: point.address.complement || '',
          neighborhood: point.address.neighborhood,
          city: point.address.city,
          state: point.address.state,
          latitude: point.coordinates.latitude.toString(),
          longitude: point.coordinates.longitude.toString(),
          acceptedWastes: point.acceptedWastes,
        });
      }
    } catch (error) {
      setErrors({
        general: 'Erro ao carregar dados do ponto de coleta',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CollectionPointFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;

    if (field === 'cep') {
      value = ViaCepService.maskCep(value);
    } else if (field === 'number') {
      value = ValidationService.formatNumber(value);
    } else if (field === 'name' || field === 'street' || field === 'neighborhood' || field === 'city') {
      value = ValidationService.sanitizeText(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const fieldError = ValidationService.validateField(field, value, formData);
      if (fieldError) {
        setErrors(prev => ({
          ...prev,
          [field]: fieldError,
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (field: keyof CollectionPointFormData) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    const fieldError = ValidationService.validateField(field, formData[field], formData);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [field]: fieldError,
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.cep;
      return newErrors;
    });

    try {
      const address = await ViaCepService.getAddressByCep(cep);

      setFormData(prev => ({
        ...prev,
        cep: ViaCepService.formatCep(cep),
        street: address.logradouro || prev.street,
        neighborhood: address.bairro || prev.neighborhood,
        city: address.localidade || prev.city,
        state: address.localidade ? `${address.localidade} - ${address.uf}` : prev.state,
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
    handleBlur('cep')();
  };

  const handleLocationUpdate = (position: GeolocationPosition) => {
    const formattedCoords = GeolocationService.formatCoordinates(position);
    
    setFormData(prev => ({
      ...prev,
      latitude: formattedCoords.latitude,
      longitude: formattedCoords.longitude,
    }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.latitude;
      delete newErrors.longitude;
      return newErrors;
    });

    setTouched(prev => ({
      ...prev,
      latitude: true,
      longitude: true,
    }));
  };

  const handleWasteToggle = (wasteType: WasteType) => {
    const newAcceptedWastes = formData.acceptedWastes.includes(wasteType)
      ? formData.acceptedWastes.filter(w => w !== wasteType)
      : [...formData.acceptedWastes, wasteType];

    setFormData(prev => ({
      ...prev,
      acceptedWastes: newAcceptedWastes,
    }));

    if (touched.acceptedWastes) {
      const fieldError = ValidationService.validateField('acceptedWastes', newAcceptedWastes, formData);
      if (fieldError) {
        setErrors(prev => ({
          ...prev,
          acceptedWastes: fieldError,
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.acceptedWastes;
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const formErrors = ValidationService.validateCollectionPointForm(formData);
    setErrors(formErrors);
    
    const allFields: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allFields[key] = true;
    });
    setTouched(allFields);

    return Object.keys(formErrors).length === 0;
  };

  const handleCancel = () => {
    navigate('/locais-coleta');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!user?.id) {
      setErrors({
        general: 'Usuário não autenticado',
      });
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const uniqueValidation = await CollectionPointService.validateUniquePoint(
        formData,
        isEditing ? initialData?.id : undefined
      );

      if (!uniqueValidation.isValid) {
        setErrors({
          name: uniqueValidation.message || 'Ponto já cadastrado',
        });
        return;
      }

      let savedPoint: CollectionPoint;

      if (isEditing && initialData?.id) {
        savedPoint = await CollectionPointService.updateCollectionPoint(
          initialData.id,
          formData,
          user.id
        );
      } else {
        savedPoint = await CollectionPointService.createCollectionPoint(
          formData,
          user.id
        );
      }

      setSaveSuccess(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/locais-coleta', { 
  state: { 
    message: isEditing 
      ? 'Ponto de coleta atualizado com sucesso!' 
      : 'Ponto de coleta cadastrado com sucesso!',
    type: 'success' 
  }
});

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao salvar o local de coleta. Tente novamente.';
      
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setSaveSuccess(false);
    }
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

      <FormProgress
        percentage={formProgress.percentage}
        completed={formProgress.completed}
        total={formProgress.total}
        className="collection-point-form__progress"
      />

      <form className="collection-point-form__form" onSubmit={handleSubmit}>
        {(errors.general || saveSuccess) && (
          <div className={`collection-point-form__status-banner ${saveSuccess ? 'collection-point-form__status-banner--success' : 'collection-point-form__status-banner--error'}`}>
            <Icon 
              name={saveSuccess ? 'recycle' : 'close'} 
              size="sm" 
              color={saveSuccess ? 'success' : 'error'} 
            />
            <Typography variant="body2" color={saveSuccess ? 'success' : 'error'}>
              {saveSuccess 
                ? (isEditing ? 'Ponto atualizado com sucesso!' : 'Ponto cadastrado com sucesso!')
                : errors.general
              }
            </Typography>
          </div>
        )}

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
            onBlur={handleBlur('name')}
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
              onBlur={handleBlur('description')}
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
              onBlur={handleBlur('street')}
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
              onBlur={handleBlur('number')}
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
              onBlur={handleBlur('neighborhood')}
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
              onBlur={handleBlur('city')}
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
            onBlur={handleBlur('state')}
            error={!!errors.state}
            errorMessage={errors.state}
            required
            disabled={isLoading}
            fullWidth
          />
        </div>

        <LocationActions
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationUpdate={handleLocationUpdate}
            disabled={isLoading}
            className="collection-point-form__location-actions"
          />

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