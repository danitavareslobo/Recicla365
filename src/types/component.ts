import type { CollectionPoint, ViaCepResponse, User, RegisterFormData, Theme } from './index';

export type IconName = 'sun' | 'moon' | 'user' | 'email' | 'password' | 'location' | 'location-crosshairs' | 'external-link' | 'trash' | 'edit' | 'plus' | 'search' | 'menu' | 'close' | 'recycle' | 'info' | 'check' | 'refresh' | 'arrow-left';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'primary' | 'secondary' | 'accent' | 'white' | 'error' | 'success' | 'info';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: IconName;
  requiresAuth?: boolean;
}

export interface NavigationProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'mobile';
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  onClick?: () => void;
}

export interface InputProps {
  id?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'number';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  overlay?: boolean;
  className?: string;
}

export interface SuccessNotificationProps {
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  color?: 'primary' | 'secondary' | 'accent' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  style?: React.CSSProperties;
}

export interface CardAction {
  id: string;
  label: string;
  icon: IconName;
  variant?: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
}

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: IconName;
  variant?: 'default' | 'highlight' | 'stats';
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
  actions?: CardAction[];
  showActionsOnHover?: boolean;
  description?: string;
}

export interface FormFieldProps {
  id?: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'number';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  icon?: IconName;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface FormProgressProps {
  percentage: number;
  completed: number;
  total: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onSearch: (searchTerm: string) => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
}

export interface CepInputProps {
  id?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  onAddressFound?: (address: ViaCepResponse) => void;
  onCepChange?: (cep: string) => void;
  onError?: (error: string) => void;
}

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconName;
  variant?: 'default' | 'highlight' | 'stats';
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label: string;
  };
  onClick?: () => void;
}

export interface DashboardStatsProps {
  stats?: StatCard[];
  isLoading?: boolean;
  className?: string;
}

export interface CollectionPointFormProps {
  initialData?: Partial<CollectionPoint>;
  isEditing?: boolean;
  className?: string;
}

export interface LoginFormProps {
  onRegisterClick?: () => void;
  className?: string;
}

export interface RegisterFormProps {
  onLoginClick?: () => void;
  className?: string;
}

export interface HeaderProps {
  className?: string;
}

export interface CollectionPointsListProps {
  collectionPoints?: CollectionPoint[];
  isLoading?: boolean;
  showActions?: boolean;
  searchable?: boolean;
  className?: string;
  onView?: (point: CollectionPoint) => void;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (point: CollectionPoint) => void;
  onCreate?: () => void;
}

export interface CollectionPointViewModalProps {
  point: CollectionPoint | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (point: CollectionPoint) => void;
  className?: string;
}

export interface ConfirmDeleteModalProps {
  point: CollectionPoint | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (point: CollectionPoint) => void | Promise<void>;
  isDeleting?: boolean;
  className?: string;
}

export interface AuthTemplateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBranding?: boolean;
  backgroundVariant?: 'default' | 'gradient' | 'pattern';
  className?: string;
}

export interface DashboardTemplateProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarCollapsible?: boolean;
  className?: string;
}

export interface MainTemplateProps {
  children: React.ReactNode;
  variant?: 'default' | 'centered' | 'fullscreen';
  showScrollToTop?: boolean;
  className?: string;
}

export interface NotFoundTemplateProps {
  title?: string;
  message?: string;
  linkText?: string;
  linkTo?: string;
  showIcon?: boolean;
}

export interface UseCollectionPointsReturn {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getUserPoints: (userId: string) => Promise<void>;
  searchPoints: (query: string) => Promise<void>;
  statistics: {
    total: number;
    byWasteType: Record<string, number>;
    byCity: Record<string, number>;
    recent: number;
  };
}

export interface UseCollectionPointReturn {
  collectionPoint: CollectionPoint | null;
  isLoading: boolean;
  error: string | null;
  load: (id: string) => Promise<void>;
  delete: (id: string, userId: string) => Promise<void>;
}

export interface UseAuthReturn {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<RegisterFormData, 'confirmPassword'>) => Promise<boolean>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
  clearError: () => void;
  error: string | null;
}

export interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLight: boolean;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((val: T) => T)) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}