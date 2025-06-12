import React, { useState, useEffect } from 'react';
import { Button, Typography, Icon } from '../../atoms';
import { FormField } from '../../molecules';
import { useAuth } from '../../../contexts/AuthContext';
import { UserService } from '../../../services';
import type { FormErrors, ViaCepResponse, User } from '../../../types';
import type { ProfileFormData, ProfileFormProps } from '../../../types/form';
import './ProfileForm.css';

export const ProfileForm: React.FC<ProfileFormProps> = ({
  onUpdateSuccess,
  onCancel,
  className = '',
}) => {
  const { user, updateUser } = useAuth(); 
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    cpf: '',
    gender: 'M',
    birthDate: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        gender: user.gender,
        birthDate: user.birthDate,
        cep: user.address.cep,
        street: user.address.street,
        number: user.address.number,
        complement: user.address.complement || '',
        neighborhood: user.address.neighborhood,
        city: user.address.city,
        state: user.address.state,
      });
    }
  }, [user]);

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.cep) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!formData.street) {
      newErrors.street = 'Rua é obrigatória';
    }

    if (!formData.number) {
      newErrors.number = 'Número é obrigatório';
    }

    if (!formData.neighborhood) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }

    if (!formData.city) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.state) {
      newErrors.state = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value = e.target.value;

    if (field === 'cpf') {
      value = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (field === 'cep') {
      value = value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          cep: 'CEP não encontrado',
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        cep: 'Erro ao buscar CEP',
      }));
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCepBlur = () => {
    if (formData.cep) {
      fetchAddressByCep(formData.cep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsLoading(true);

    try {
      const validation = await UserService.validateUniqueUser({
        cpf: formData.cpf,
        email: formData.email
      }, user.id);

      if (!validation.isValid) {
        setErrors({
          [validation.field || 'general']: validation.message || 'Dados já cadastrados para outro usuário',
        });
        setIsLoading(false);
        return;
      }

      const updateData: Partial<User> = {
        name: formData.name.trim(),
        email: formData.email,
        cpf: formData.cpf,
        gender: formData.gender,
        birthDate: formData.birthDate,
        address: {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement || undefined,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          uf: formData.state.split(' ')[0], 
        },
      };

      const success = await updateUser(updateData);
      
      if (success) {
        setUpdateSuccess(true);
        
        setTimeout(() => {
          setUpdateSuccess(false);
          onUpdateSuccess?.();
        }, 2000);
      } else {
        setErrors({
          general: 'Erro ao atualizar perfil. Tente novamente.',
        });
      }
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil. Tente novamente.';
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formClasses = [
    'profile-form',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!user) {
    return (
      <div className="profile-form__loading">
        <Icon name="search" size="lg" />
        <Typography variant="body1">Carregando dados do perfil...</Typography>
      </div>
    );
  }

  return (
    <div className={formClasses}>
      <div className="profile-form__header">
        <div className="profile-form__icon">
          <Icon name="user" size="xl" color="accent" />
        </div>
        <Typography variant="h2" align="center" className="profile-form__title">
          Meu Perfil
        </Typography>
        <Typography variant="body1" color="secondary" align="center" className="profile-form__subtitle">
          Gerencie suas informações pessoais
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="profile-form__form">
        {errors.general && (
          <div className="profile-form__error-banner">
            <Icon name="close" size="sm" color="error" />
            <Typography variant="body2" color="error">
              {errors.general}
            </Typography>
          </div>
        )}

        {updateSuccess && (
          <div className="profile-form__success-banner">
            <Icon name="check" size="sm" color="success" />
            <Typography variant="body2" color="success">
              Perfil atualizado com sucesso!
            </Typography>
          </div>
        )}

        <div className="profile-form__section">
          <Typography variant="h4" className="profile-form__section-title">
            Dados Pessoais
          </Typography>
          
          <div className="profile-form__fields">
            <FormField
              id="name"
              label="Nome Completo"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              errorMessage={errors.name}
              icon="user"
              required
              disabled={isLoading}
              fullWidth
            />

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              errorMessage={errors.email}
              icon="email"
              required
              disabled={isLoading}
              fullWidth
            />

            <div className="profile-form__row">
              <FormField
                id="cpf"
                label="CPF"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleInputChange('cpf')}
                error={!!errors.cpf}
                errorMessage={errors.cpf}
                required
                disabled={isLoading}
                fullWidth
              />

              <div className="form-field">
                <Typography variant="body2" weight="medium" className="form-field__label">
                  Gênero *
                </Typography>
                <select
                  value={formData.gender}
                  onChange={handleInputChange('gender')}
                  disabled={isLoading}
                  className="input"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <FormField
              id="birthDate"
              label="Data de Nascimento"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange('birthDate')}
              error={!!errors.birthDate}
              errorMessage={errors.birthDate}
              required
              disabled={isLoading}
              fullWidth
            />
          </div>
        </div>

        <div className="profile-form__section">
          <Typography variant="h4" className="profile-form__section-title">
            Endereço
          </Typography>
          
          <div className="profile-form__fields">
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

            <div className="profile-form__row">
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

            <div className="profile-form__row">
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
        </div>

        <div className="profile-form__actions">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={isLoading}
              className="profile-form__cancel"
            >
              <Icon name="close" size="sm" />
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="profile-form__submit"
          >
            {isLoading ? (
              <>
                <Icon name="search" size="sm" />
                Atualizando...
              </>
            ) : (
              <>
                <Icon name="check" size="sm" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};