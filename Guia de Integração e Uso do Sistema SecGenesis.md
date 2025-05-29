# Guia de Integração e Uso do Sistema SecGenesis

## Visão Geral do Sistema

O SecGenesis é um sistema completo de controle de acesso com QR code para eventos, composto por quatro componentes principais:

1. **Aplicativo Leitor de QR Code**: Aplicativo mobile para seguranças na portaria escanearem os QR codes dos convidados
2. **Backend e API**: Servidor central que gerencia eventos, convidados, QR codes e check-ins
3. **Painel Administrativo Web**: Interface para organizadores cadastrarem eventos e convidados, gerarem e enviarem QR codes
4. **Automação WhatsApp**: Sistema que envia QR codes automaticamente para os convidados via WhatsApp

## Arquitetura do Sistema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Painel Admin   │     │  Aplicativo     │     │  Automação      │
│  Web (React)    │◄───►│  Mobile (Expo)  │◄───►│  WhatsApp       │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         │                       ▼                       │
         │             ┌─────────────────────┐          │
         └────────────►│  Backend e API      │◄─────────┘
                       │  (Node.js/Express)  │
                       └─────────────────────┘
```

## Fluxo de Funcionamento

1. **Cadastro de Eventos e Convidados**:
   - Organizador acessa o painel administrativo web
   - Cria um novo evento com data, hora e local
   - Cadastra convidados individualmente ou em lote

2. **Geração e Envio de QR Codes**:
   - Organizador seleciona convidados para enviar QR codes
   - Sistema gera QR codes únicos para cada convidado
   - QR codes são enviados automaticamente via WhatsApp

3. **Controle de Acesso no Evento**:
   - Segurança na portaria utiliza o aplicativo mobile
   - Escaneia o QR code apresentado pelo convidado
   - Aplicativo valida o QR code e exibe informações do convidado
   - Segurança libera a entrada do convidado

## Configuração e Inicialização

### 1. Backend e API

```bash
# Navegar para o diretório do backend
cd /home/ubuntu/SecGenesis/backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as configurações desejadas

# Iniciar o servidor
npm start
```

### 2. Painel Administrativo Web

```bash
# Navegar para o diretório do frontend
cd /home/ubuntu/SecGenesis/frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

### 3. Automação WhatsApp

```bash
# Navegar para o diretório da automação WhatsApp
cd /home/ubuntu/SecGenesis/whatsapp-automation

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as configurações desejadas

# Iniciar o serviço
npm start
```

### 4. Aplicativo Mobile

```bash
# Navegar para o diretório do aplicativo mobile
cd /home/ubuntu/SecGenesis/mobile

# Instalar dependências
npm install

# Iniciar o aplicativo com Expo
npx expo start
```

## Guia de Uso para Organizadores

### Acessando o Painel Administrativo

1. Abra o navegador e acesse `http://localhost:3000`
2. Faça login com suas credenciais ou registre uma nova conta
3. Você será redirecionado para o dashboard principal

### Criando um Novo Evento

1. No dashboard, clique no botão "Criar Evento"
2. Preencha os campos obrigatórios:
   - Nome do evento
   - Data e hora
   - Local
   - Descrição (opcional)
   - Telefone de contato
3. Clique em "Criar Evento"

### Cadastrando Convidados

#### Individualmente:

1. Na página do evento, clique em "Convidados"
2. Clique no botão "Adicionar"
3. Preencha os dados do convidado:
   - Nome completo
   - Telefone (com DDD)
   - Email (opcional)
   - Observações (opcional)
4. Clique em "Adicionar"

#### Em lote:

1. Na página do evento, clique em "Convidados"
2. Clique no botão "Importar"
3. Cole a lista de convidados no formato CSV:
   ```
   Nome, Telefone, Email, Observações
   ```
4. Clique em "Importar"

### Enviando QR Codes por WhatsApp

#### Para um convidado específico:

1. Na lista de convidados, clique no ícone do WhatsApp ao lado do convidado
2. Confirme o envio na página que se abre
3. Aguarde a confirmação de envio

#### Para múltiplos convidados:

1. Na lista de convidados, selecione os convidados desejados
2. Clique no botão "Enviar QR Codes"
3. Confirme o envio em lote
4. Aguarde a confirmação de envio para todos os convidados

## Guia de Uso para Seguranças

### Instalando o Aplicativo

1. Acesse o link fornecido pelo organizador no seu dispositivo móvel
2. Siga as instruções para instalar o aplicativo Expo Go
3. Escaneie o QR code do aplicativo SecGenesis

### Realizando Check-in de Convidados

1. Abra o aplicativo SecGenesis no seu dispositivo
2. Faça login com as credenciais fornecidas pelo organizador
3. Selecione o evento em que você está trabalhando
4. Clique no botão "Escanear QR Code"
5. Aponte a câmera para o QR code apresentado pelo convidado
6. Verifique as informações exibidas na tela:
   - Nome do convidado
   - Status (se já realizou check-in anteriormente)
7. Se as informações estiverem corretas, clique em "Confirmar Entrada"
8. O sistema registrará o check-in e exibirá uma confirmação

## Solução de Problemas

### Problemas com o Envio de WhatsApp

1. Verifique se o serviço de automação WhatsApp está em execução
2. Certifique-se de que o WhatsApp Web está autenticado (escaneie o QR code inicial)
3. Verifique se o número de telefone do convidado está no formato correto (com DDD)
4. Tente reiniciar o serviço de automação WhatsApp

### Problemas com o Aplicativo Leitor

1. Verifique se o dispositivo tem permissão para acessar a câmera
2. Certifique-se de que o aplicativo está conectado à internet
3. Verifique se o evento está ativo no sistema
4. Tente fazer logout e login novamente

### Problemas com o Painel Administrativo

1. Limpe o cache do navegador
2. Verifique se o servidor backend está em execução
3. Tente acessar a API diretamente para verificar se está respondendo
4. Verifique os logs do servidor para identificar possíveis erros

## Considerações de Segurança

- Mantenha suas credenciais de acesso seguras
- Não compartilhe o acesso ao painel administrativo com pessoas não autorizadas
- Os QR codes são únicos para cada convidado e não podem ser reutilizados
- O sistema registra todas as operações realizadas para auditoria

## Suporte e Contato

Para obter suporte ou relatar problemas, entre em contato com a equipe SecGenesis:

- Email: suporte@secgenesis.com
- Telefone: (11) 99999-9999
