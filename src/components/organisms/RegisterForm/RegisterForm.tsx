import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Icon } from '../../atoms';
import { FormField } from '../../molecules';
import { useAuth } from '../../../contexts/AuthContext';
import type { User, ViaCepResponse } from '../../../types';
import './RegisterForm.css';

interface RegisterFormProps {
  onLoginClick?: () => void;
  className?: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  cpf: string;
  gender: 'M' | 'F' | 'Outro';
  birthDate: string;
  password: string;
  confirmPassword: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface FormErrors {
  [key: string]: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onLoginClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    cpf: '',
    gender: 'M',
    birthDate: '',
    password: '',
    confirmPassword: '',
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
  const [currentStep, setCurrentStep] = useState(1);

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

  const validateStep1 = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
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

  const handleInputChange = (field: keyof RegisterFormData) => (
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

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData: Omit<User, 'id' | 'createdAt'> = {
        name: formData.name.trim(),
        email: formData.email,
        cpf: formData.cpf,
        gender: formData.gender,
        birthDate: formData.birthDate,
        password: formData.password,
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

      const success = await register(userData);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({
          general: 'Erro ao criar conta. Tente novamente.',
        });
      }
    } catch (error) {
      setErrors({
        general: 'Erro ao criar conta. Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formClasses = [
    'register-form',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={formClasses}>
      <div className="register-form__header">
        <div className="register-form__icon">
          <Icon name="plus" size="xl" color="accent" />
        </div>
        <Typography variant="h2" align="center" className="register-form__title">
          Criar Conta
        </Typography>
        <Typography variant="body1" color="secondary" align="center" className="register-form__subtitle">
          Junte-se ao Recicla365 e faça a diferença
        </Typography>
      </div>

      <div className="register-form__progress" data-step={currentStep}>
  <div className={`register-form__step ${currentStep >= 1 ? 'register-form__step--active' : ''}`}>
    <span>1</span>
    <Typography variant="body2" weight="medium">Dados Pessoais</Typography>
  </div>
  <div className={`register-form__step ${currentStep >= 2 ? 'register-form__step--active' : ''}`}>
    <span>2</span>
    <Typography variant="body2" weight="medium">Senha e Endereço</Typography>
  </div>
</div>

      <form onSubmit={handleSubmit} className="register-form__form">
        {errors.general && (
          <div className="register-form__error-banner">
            <Icon name="close" size="sm" color="error" />
            <Typography variant="body2" color="error">
              {errors.general}
            </Typography>
          </div>
        )}

        {currentStep === 1 && (
          <div className="register-form__step-content">
            <div className="register-form__fields">
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

              <div className="register-form__row">
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

            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextStep}
              className="register-form__next"
            >
              Próximo
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="register-form__step-content">
            <div className="register-form__fields">
              <FormField
                id="password"
                label="Senha"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                errorMessage={errors.password}
                icon="password"
                required
                disabled={isLoading}
                fullWidth
              />

              <FormField
                id="confirmPassword"
                label="Confirmar Senha"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                icon="password"
                required
                disabled={isLoading}
                fullWidth
              />

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

              <div className="register-form__row">
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

              <div className="register-form__row">
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

            <div className="register-form__actions">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrevStep}
                disabled={isLoading}
                className="register-form__back"
              >
                <Icon name="close" size="sm" />
                Voltar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="register-form__submit"
              >
                {isLoading ? (
                  <>
                    <Icon name="search" size="sm" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Icon name="plus" size="sm" />
                    Criar Conta
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {onLoginClick && (
          <div className="register-form__login">
            <Typography variant="body2" color="secondary" align="center">
              Já tem uma conta?
            </Typography>
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={onLoginClick}
              disabled={isLoading}
              className="register-form__login-button"
            >
              <Icon name="user" size="sm" />
              Fazer Login
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};