# Guia de Implantação em Produção - Sistema SecGenesis

Este guia detalhado irá orientá-lo no processo de implantação do sistema SecGenesis em ambiente de produção, utilizando apenas serviços gratuitos. Ao final deste processo, você terá todos os componentes do sistema funcionando online e prontos para uso em eventos reais.

## Visão Geral da Implantação

Vamos implantar cada componente do sistema em serviços de hospedagem gratuitos:

1. **Backend/API**: Render (plano gratuito)
2. **Frontend/Painel Administrativo**: Vercel (plano gratuito)
3. **Banco de Dados**: MongoDB Atlas (plano gratuito)
4. **Automação WhatsApp**: Oracle Cloud (sempre gratuito)
5. **Aplicativo Mobile**: Expo (distribuição gratuita)

## Pré-requisitos

Antes de começar, você precisará:

- Uma conta de e-mail para registros nos serviços
- Acesso ao código-fonte do SecGenesis
- Git instalado em seu computador
- Node.js instalado em seu computador
- Um smartphone com WhatsApp instalado (para o serviço de automação)

## 1. Configuração do Banco de Dados MongoDB Atlas

### 1.1. Criar uma conta no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Clique em "Registrar-se" e preencha o formulário
3. Selecione "Shared" (gratuito) como tipo de cluster
4. Escolha um provedor de nuvem (AWS, Google Cloud ou Azure) e uma região próxima à sua localização
5. Mantenha as configurações padrão e clique em "Criar Cluster"

### 1.2. Configurar o Cluster

1. Aguarde a criação do cluster (pode levar alguns minutos)
2. Na seção "Security", clique em "Database Access"
3. Clique em "Add New Database User"
4. Crie um usuário com senha e anote essas credenciais
5. Em "Network Access", clique em "Add IP Address"
6. Selecione "Allow Access from Anywhere" (para facilitar o desenvolvimento)
7. Clique em "Confirm"

### 1.3. Obter a String de Conexão

1. No dashboard, clique em "Connect"
2. Selecione "Connect your application"
3. Copie a string de conexão (será algo como: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
4. Substitua `<username>`, `<password>` e `myFirstDatabase` pelos valores corretos
5. Guarde esta string para uso posterior

## 2. Implantação do Backend no Render

### 2.1. Criar uma conta no Render

1. Acesse [Render](https://render.com/register)
2. Registre-se usando sua conta GitHub ou e-mail
3. Confirme seu e-mail se necessário

### 2.2. Preparar o Código do Backend

1. Certifique-se de que o arquivo `.env.example` está atualizado com todas as variáveis necessárias
2. Crie um arquivo `render.yaml` na raiz do projeto backend com o seguinte conteúdo:

```yaml
services:
  - type: web
    name: secgenesis-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: WHATSAPP_SERVICE_URL
        sync: false
      - key: WHATSAPP_API_TOKEN
        sync: false
```

### 2.3. Implantar o Backend no Render

1. No dashboard do Render, clique em "New" e selecione "Web Service"
2. Conecte sua conta GitHub ou forneça o URL do repositório
3. Selecione o repositório do backend
4. Configure o serviço:
   - Nome: secgenesis-api
   - Ambiente: Node
   - Comando de Build: npm install
   - Comando de Start: npm start
5. Em "Advanced", adicione as variáveis de ambiente:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `MONGODB_URI`: (string de conexão do MongoDB Atlas)
   - `JWT_SECRET`: (uma string aleatória para segurança)
   - `WHATSAPP_SERVICE_URL`: (deixe em branco por enquanto)
   - `WHATSAPP_API_TOKEN`: (uma string aleatória para autenticação)
6. Clique em "Create Web Service"
7. Aguarde a implantação (pode levar alguns minutos)
8. Anote a URL do serviço (será algo como `https://secgenesis-api.onrender.com`)

## 3. Implantação do Frontend no Vercel

### 3.1. Criar uma conta no Vercel

1. Acesse [Vercel](https://vercel.com/signup)
2. Registre-se usando sua conta GitHub ou e-mail
3. Confirme seu e-mail se necessário

### 3.2. Preparar o Código do Frontend

1. No arquivo `.env.example` do frontend, atualize a URL da API para apontar para o backend implantado:

```
VITE_API_URL=https://secgenesis-api.onrender.com/api
```

2. Crie um arquivo `vercel.json` na raiz do projeto frontend:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 3.3. Implantar o Frontend no Vercel

1. No dashboard do Vercel, clique em "New Project"
2. Importe o repositório do frontend
3. Configure o projeto:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
4. Em "Environment Variables", adicione:
   - `VITE_API_URL`: https://secgenesis-api.onrender.com/api
5. Clique em "Deploy"
6. Aguarde a implantação (geralmente é rápido)
7. Anote a URL do frontend (será algo como `https://secgenesis.vercel.app`)

## 4. Implantação da Automação WhatsApp no Oracle Cloud

### 4.1. Criar uma conta no Oracle Cloud

1. Acesse [Oracle Cloud](https://www.oracle.com/cloud/free/)
2. Clique em "Comece gratuitamente"
3. Preencha o formulário de registro (será necessário um cartão de crédito para verificação, mas não será cobrado)
4. Complete o processo de verificação

### 4.2. Criar uma Instância de VM

1. No dashboard do Oracle Cloud, vá para "Compute" > "Instances"
2. Clique em "Create Instance"
3. Configure a instância:
   - Nome: secgenesis-whatsapp
   - Imagem: Canonical Ubuntu 20.04
   - Tipo: VM.Standard.E2.1.Micro (sempre gratuito)
   - Rede: Criar nova VCN
   - Acesso SSH: Gerar um novo par de chaves e baixar a chave privada
4. Clique em "Create"
5. Aguarde a criação da instância

### 4.3. Configurar Regras de Firewall

1. Vá para "Networking" > "Virtual Cloud Networks"
2. Clique na VCN criada para sua instância
3. Vá para "Security Lists" e clique na lista de segurança padrão
4. Clique em "Add Ingress Rules" e adicione:
   - Source CIDR: 0.0.0.0/0
   - IP Protocol: TCP
   - Destination Port Range: 3001
5. Clique em "Add Ingress Rules"

### 4.4. Conectar à Instância e Configurar

1. Abra um terminal em seu computador
2. Torne a chave SSH privada segura: `chmod 400 caminho/para/sua/chave.key`
3. Conecte-se à instância: `ssh -i caminho/para/sua/chave.key ubuntu@IP_DA_INSTANCIA`
4. Instale o Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
5. Instale o Git: `sudo apt-get install -y git`
6. Clone o repositório: `git clone URL_DO_REPOSITORIO secgenesis`
7. Navegue até o diretório da automação WhatsApp: `cd secgenesis/whatsapp-automation`
8. Instale as dependências: `npm install`
9. Crie o arquivo .env:
   ```bash
   cat > .env << EOL
   PORT=3001
   API_URL=https://secgenesis-api.onrender.com/api
   API_TOKEN=seu_token_de_api
   EOL
   ```
10. Instale o PM2: `sudo npm install -g pm2`
11. Inicie o serviço: `pm2 start server.js --name secgenesis-whatsapp`
12. Configure o PM2 para iniciar na inicialização: `pm2 startup` e siga as instruções
13. Salve a configuração do PM2: `pm2 save`

### 4.5. Autenticar o WhatsApp

1. Inicie o serviço: `node server.js`
2. Você verá um QR code no terminal
3. Abra o WhatsApp no seu smartphone
4. Vá para Configurações > WhatsApp Web/Desktop
5. Escaneie o QR code exibido no terminal
6. Após a autenticação, pressione Ctrl+C para parar o processo
7. Reinicie usando PM2: `pm2 restart secgenesis-whatsapp`

### 4.6. Atualizar a URL do Serviço WhatsApp no Backend

1. Volte ao dashboard do Render
2. Acesse as configurações do serviço backend
3. Atualize a variável de ambiente `WHATSAPP_SERVICE_URL` para `http://IP_DA_INSTANCIA:3001/api`
4. Clique em "Save Changes"
5. Aguarde a reimplantação do backend

## 5. Compilação e Distribuição do Aplicativo Mobile

### 5.1. Configurar o Projeto no Expo

1. Crie uma conta no [Expo](https://expo.dev/signup)
2. Instale a CLI do Expo: `npm install -g expo-cli`
3. Navegue até o diretório do aplicativo mobile: `cd secgenesis/mobile`
4. Atualize o arquivo de configuração para apontar para a API em produção:
   ```javascript
   // Edite o arquivo src/config/config.js
   export const API_URL = 'https://secgenesis-api.onrender.com/api';
   ```
5. Faça login no Expo: `expo login`
6. Inicialize o projeto: `expo init . --template blank`
7. Responda "yes" quando perguntado se deseja sobrescrever arquivos

### 5.2. Publicar o Aplicativo no Expo

1. Configure o app.json:
   ```json
   {
     "expo": {
       "name": "SecGenesis",
       "slug": "secgenesis",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#000000"
       },
       "updates": {
         "fallbackToCacheTimeout": 0
       },
       "assetBundlePatterns": [
         "**/*"
       ],
       "ios": {
         "supportsTablet": true
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#000000"
         }
       },
       "web": {
         "favicon": "./assets/favicon.png"
       }
     }
   }
   ```
2. Publique o aplicativo: `expo publish`
3. Aguarde a conclusão do processo
4. Anote a URL do projeto (será algo como `https://expo.dev/@seu-usuario/secgenesis`)

### 5.3. Distribuir o Aplicativo

1. Para distribuir o aplicativo, você pode:
   - Compartilhar o link do Expo com os seguranças
   - Gerar um QR code que, quando escaneado com o aplicativo Expo Go, abre seu aplicativo
   - Criar builds standalone para Android/iOS (requer contas de desenvolvedor)

2. Para gerar um QR code para acesso rápido:
   ```bash
   npx qrcode-terminal "exp://exp.host/@seu-usuario/secgenesis"
   ```

3. Para criar um build para Android (opcional):
   ```bash
   expo build:android -t apk
   ```

## 6. Teste e Validação do Sistema em Produção

### 6.1. Verificar Conexões entre Componentes

1. Acesse o frontend através da URL do Vercel
2. Tente fazer login (crie uma conta se necessário)
3. Verifique se consegue criar eventos e adicionar convidados
4. Verifique se o QR code é gerado corretamente
5. Teste o envio de QR code por WhatsApp
6. Teste o aplicativo mobile escaneando um QR code

### 6.2. Solução de Problemas Comuns

#### Backend não responde:
- Verifique os logs no dashboard do Render
- Confirme se a string de conexão do MongoDB está correta
- Verifique se as variáveis de ambiente estão configuradas corretamente

#### Frontend não se conecta ao backend:
- Verifique se a URL da API está correta nas variáveis de ambiente
- Verifique se o backend está online
- Verifique se há erros de CORS nos logs do console do navegador

#### Automação WhatsApp não funciona:
- Verifique se o serviço está em execução: `pm2 status`
- Verifique os logs: `pm2 logs secgenesis-whatsapp`
- Confirme se o WhatsApp está autenticado
- Verifique se o IP e porta estão acessíveis publicamente

#### Aplicativo mobile não se conecta:
- Verifique se a URL da API está correta no arquivo de configuração
- Confirme se o backend está acessível publicamente
- Verifique se há erros no console do Expo

## 7. Manutenção e Monitoramento

### 7.1. Monitoramento do Backend

1. No dashboard do Render, você pode:
   - Visualizar logs em tempo real
   - Configurar alertas para falhas
   - Monitorar o uso de recursos

### 7.2. Monitoramento da Automação WhatsApp

1. Configure o monitoramento com PM2:
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

2. Para verificar o status: `pm2 status`
3. Para verificar logs: `pm2 logs secgenesis-whatsapp`

### 7.3. Backups do Banco de Dados

1. No MongoDB Atlas, configure backups automáticos:
   - Vá para "Clusters" > seu cluster > "Backup"
   - Configure a frequência dos backups (diária, semanal)
   - Defina o período de retenção

## 8. Segurança e Boas Práticas

### 8.1. Segurança do Backend

1. Certifique-se de que o `JWT_SECRET` é uma string longa e aleatória
2. Considere adicionar rate limiting para evitar abusos
3. Mantenha as dependências atualizadas: `npm audit fix`

### 8.2. Segurança do Frontend

1. Implemente autenticação de dois fatores (2FA) para contas de administrador
2. Use HTTPS para todas as comunicações
3. Não armazene informações sensíveis no localStorage

### 8.3. Segurança da Automação WhatsApp

1. Restrinja o acesso à VM apenas a IPs confiáveis
2. Mantenha o sistema operacional atualizado: `sudo apt update && sudo apt upgrade`
3. Considere usar um firewall: `sudo ufw enable`

## 9. Próximos Passos e Melhorias

1. **Domínio Personalizado**: Configure um domínio personalizado para o frontend e backend
2. **SSL/TLS**: Configure certificados SSL para o serviço de automação WhatsApp
3. **Escalabilidade**: Monitore o uso e considere planos pagos se necessário
4. **Backup Automatizado**: Configure scripts para backup regular de todos os dados
5. **Monitoramento Avançado**: Implemente ferramentas como Sentry para monitoramento de erros

## Conclusão

Parabéns! Você agora tem o sistema SecGenesis completamente implantado em ambiente de produção, utilizando apenas serviços gratuitos. O sistema está pronto para ser utilizado em eventos reais, proporcionando um controle de acesso moderno e eficiente.

Para qualquer dúvida ou problema durante a implantação, consulte a documentação específica de cada serviço ou entre em contato com o suporte.

---

**SecGenesis - Controle de Acesso Inteligente**
