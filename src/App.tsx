import React from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Button, Input, Typography, Icon } from './components/atoms';
import { Card, FormField, SearchBox } from './components/molecules';
import './styles/globals.css';

// Componente interno para usar o useTheme
const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <Typography variant="h1" align="center">Recicla365 - Teste de Componentes</Typography>
      
      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h2">Tema atual: {theme === 'light' ? 'Claro' : 'Escuro'}</Typography>
        <Button onClick={toggleTheme} variant="outline">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size="sm" />
          Alternar Tema
        </Button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h2">Teste do Componente SearchBox</Typography>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          <SearchBox 
            placeholder="Buscar pontos de coleta..."
            onSearch={(term) => alert(`Buscando por: ${term}`)}
            onClear={() => alert('Busca limpa!')}
            onChange={(value) => console.log('Valor:', value)}
            fullWidth
          />
          
          <SearchBox 
            placeholder="Busca compacta"
            onSearch={(term) => alert(`Busca: ${term}`)}
          />
          
          <SearchBox 
            placeholder="Busca desabilitada"
            disabled
            onSearch={() => {}}
          />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h2">Teste do Componente FormField</Typography>
        
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px', gridTemplateColumns: '1fr' }}>
          <FormField 
            label="Nome completo" 
            placeholder="Digite seu nome completo"
            icon="user"
            required
            helperText="Informe seu nome como aparece no documento"
          />
          
          <FormField 
            label="Email" 
            type="email"
            placeholder="seuemail@exemplo.com"
            icon="email"
            required
          />
          
          <FormField 
            label="Senha" 
            type="password"
            placeholder="Crie uma senha segura"
            icon="password"
            required
            helperText="Mínimo 8 caracteres"
          />
          
          <FormField 
            label="CEP" 
            placeholder="00000-000"
            icon="location"
            helperText="Será usado para buscar seu endereço"
          />
          
          <FormField 
            label="Campo com erro" 
            placeholder="Campo inválido"
            error
            errorMessage="Este campo é obrigatório"
            required
          />
          
          <FormField 
            label="Campo desabilitado" 
            placeholder="Não editável"
            disabled
            value="Valor fixo"
          />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h2">Teste do Componente Card</Typography>
        
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Card 
            title="Card Básico" 
            subtitle="Este é um card simples"
            icon="recycle"
          >
            <Typography variant="body1">
              Conteúdo do card aqui. Pode ter qualquer coisa dentro.
            </Typography>
          </Card>
          
          <Card 
            title="Card Estatísticas" 
            variant="stats"
            icon="user"
            clickable
            onClick={() => alert('Card clicado!')}
          >
            <Typography variant="h2" color="accent">150</Typography>
            <Typography variant="body2" color="secondary">Usuários ativos</Typography>
          </Card>
          
          <Card 
            title="Card Destaque" 
            subtitle="Card com destaque especial"
            variant="highlight"
            icon="location"
          >
            <Typography variant="body1">
              Este card tem um estilo destacado para informações importantes.
            </Typography>
          </Card>
          
          <Card clickable onClick={() => alert('Card sem header!')}>
            <Typography variant="h5">Card sem Header</Typography>
            <Typography variant="body2" color="secondary">
              Este card não tem título nem ícone, apenas conteúdo.
            </Typography>
          </Card>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h2">Teste do Componente Icon</Typography>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Icon name="sun" size="sm" />
          <Icon name="moon" size="md" />
          <Icon name="user" size="lg" />
          <Icon name="recycle" size="xl" />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Icon name="email" color="primary" />
          <Icon name="location" color="secondary" />
          <Icon name="search" color="accent" />
          <Icon name="trash" color="error" />
          <Icon name="edit" color="success" />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Icon name="plus" onClick={() => alert('Ícone clicado!')} />
          <Icon name="menu" onClick={() => alert('Menu clicado!')} />
          <Icon name="close" onClick={() => alert('Fechar clicado!')} />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Typography variant="h2">Teste do Componente Typography</Typography>
        
        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="h5">Heading 5</Typography>
          <Typography variant="h6">Heading 6</Typography>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="body1">Body 1 - Lorem ipsum dolor sit amet consectetur adipisicing elit.</Typography>
          <Typography variant="body2">Body 2 - Texto menor para descrições e detalhes.</Typography>
          <Typography variant="caption">Caption - Texto muito pequeno para legendas.</Typography>
          <Typography variant="overline">Overline - Texto em maiúsculas</Typography>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="body1" color="primary">Cor primary</Typography>
          <Typography variant="body1" color="secondary">Cor secondary</Typography>
          <Typography variant="body1" color="accent">Cor accent</Typography>
          <Typography variant="body1" color="error">Cor error</Typography>
          <Typography variant="body1" color="success">Cor success</Typography>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="body1" align="left">Alinhado à esquerda</Typography>
          <Typography variant="body1" align="center">Alinhado ao centro</Typography>
          <Typography variant="body1" align="right">Alinhado à direita</Typography>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Teste do Componente Input</h2>
        
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
          <Input label="Nome" placeholder="Digite seu nome" />
          <Input label="Email" type="email" placeholder="seuemail@exemplo.com" required />
          <Input label="Senha" type="password" placeholder="Sua senha" />
          <Input label="Data de Nascimento" type="date" />
          <Input label="Telefone" type="tel" placeholder="(11) 99999-9999" />
          <Input 
            label="Campo com erro" 
            placeholder="Campo inválido" 
            error 
            errorMessage="Este campo é obrigatório" 
          />
          <Input label="Campo desabilitado" placeholder="Não editável" disabled />
          <Input placeholder="Input sem label" fullWidth />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Teste do Componente Button</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;