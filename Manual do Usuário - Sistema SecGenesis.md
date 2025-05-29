# Manual do Usuário - Sistema SecGenesis

## Introdução

Bem-vindo ao SecGenesis, um sistema completo de controle de acesso com QR code para eventos. Este manual foi desenvolvido para ajudar você a utilizar todas as funcionalidades do sistema de forma simples e eficiente.

O SecGenesis permite que organizadores de eventos cadastrem convidados, gerem QR codes únicos e os enviem automaticamente via WhatsApp. Na entrada do evento, os seguranças utilizam um aplicativo móvel para escanear os QR codes e validar o acesso dos convidados.

## Componentes do Sistema

O SecGenesis é composto por quatro componentes principais:

1. **Painel Administrativo Web**: Interface para organizadores gerenciarem eventos e convidados
2. **Aplicativo Leitor de QR Code**: App mobile para seguranças na portaria
3. **Backend e API**: Servidor central que gerencia todos os dados
4. **Automação WhatsApp**: Sistema que envia QR codes automaticamente para os convidados

## Primeiros Passos

### Acessando o Painel Administrativo

1. Abra seu navegador e acesse: `http://secgenesis.vercel.app`
2. Na tela de login, clique em "Registrar-se" para criar uma nova conta
3. Preencha seus dados:
   - Nome completo
   - Email
   - Telefone
   - Senha (mínimo 6 caracteres)
4. Clique em "Registrar"
5. Após o registro, você será redirecionado para o Dashboard

### Criando seu Primeiro Evento

1. No Dashboard, clique no botão "Criar Evento"
2. Preencha os dados do evento:
   - Nome do evento
   - Data
   - Horário
   - Local
   - Descrição (opcional)
   - Telefone de contato
3. Clique em "Criar Evento"
4. Seu evento será criado e você será redirecionado para a página de detalhes

### Cadastrando Convidados

#### Cadastro Individual

1. Na página do evento, clique na aba "Convidados"
2. Clique no botão "Adicionar"
3. Preencha os dados do convidado:
   - Nome completo
   - Telefone (com DDD, ex: 11999999999)
   - Email (opcional)
   - Observações (opcional)
4. Clique em "Adicionar"
5. O convidado será adicionado à lista

#### Cadastro em Lote

1. Na página do evento, clique na aba "Convidados"
2. Clique no botão "Importar"
3. Cole a lista de convidados no formato CSV:
   ```
   Nome, Telefone, Email, Observações
   João Silva, 11999999999, joao@email.com, VIP
   Maria Oliveira, 11988888888, maria@email.com, Mesa 5
   ```
4. Clique em "Importar"
5. Os convidados serão adicionados à lista

### Enviando QR Codes por WhatsApp

#### Envio Individual

1. Na lista de convidados, localize o convidado desejado
2. Clique no ícone do WhatsApp na linha do convidado
3. Na página de envio, confirme os dados do convidado
4. Clique no botão "Enviar por WhatsApp"
5. Aguarde a confirmação de envio
6. O status do convidado será atualizado para "Convidado"

#### Envio em Lote

1. Na lista de convidados, selecione os convidados desejados marcando as caixas de seleção
2. Clique no botão "Enviar QR Codes" no topo da lista
3. Confirme a ação na janela de confirmação
4. Aguarde o processamento do envio em lote
5. O sistema exibirá um relatório com os resultados do envio

## Usando o Aplicativo Leitor na Portaria

### Instalação do Aplicativo

1. No seu dispositivo móvel, acesse a loja de aplicativos:
   - Android: Google Play Store
   - iOS: App Store
2. Busque por "SecGenesis" ou "SecGenesis Scanner"
3. Instale o aplicativo gratuito
4. Abra o aplicativo após a instalação

### Configuração Inicial

1. Na tela inicial, faça login com as credenciais fornecidas pelo organizador
2. Permita o acesso à câmera quando solicitado
3. Selecione o evento em que você está trabalhando na lista de eventos disponíveis

### Escaneando QR Codes

1. Na tela principal, clique no botão "Escanear QR Code"
2. Aponte a câmera para o QR code apresentado pelo convidado
3. O aplicativo processará automaticamente o QR code
4. Verifique as informações exibidas:
   - Nome do convidado
   - Status (se já realizou check-in anteriormente)
   - Observações (se houver)
5. Se as informações estiverem corretas, clique em "Confirmar Entrada"
6. O sistema registrará o check-in e exibirá uma confirmação visual e sonora
7. Para escanear o próximo convidado, clique em "Novo Escaneamento"

## Monitoramento do Evento

### Visualizando Estatísticas

1. No painel administrativo, acesse a página do evento
2. Na aba "Dashboard", você verá estatísticas em tempo real:
   - Total de convidados
   - Convidados presentes (check-in realizado)
   - Percentual de presença
   - Gráfico de check-ins por hora

### Relatórios

1. Na página do evento, clique na aba "Relatórios"
2. Selecione o tipo de relatório desejado:
   - Lista de presença
   - Convidados ausentes
   - Histórico de check-ins
3. Clique em "Gerar Relatório"
4. O relatório será exibido na tela e poderá ser exportado em formato PDF ou CSV

## Solução de Problemas

### Problemas com o Envio de WhatsApp

**Problema**: QR codes não estão sendo enviados por WhatsApp.

**Solução**:
1. Verifique se o número de telefone está no formato correto (apenas números com DDD)
2. Certifique-se de que o serviço de automação WhatsApp está ativo
3. Verifique se o WhatsApp Web está autenticado
4. Tente enviar novamente após alguns minutos

### Problemas com o Aplicativo Leitor

**Problema**: O aplicativo não consegue escanear o QR code.

**Solução**:
1. Verifique se a câmera está limpa e sem obstruções
2. Certifique-se de que há iluminação adequada
3. Peça ao convidado para aumentar o brilho da tela do celular
4. Tente escanear novamente, mantendo o QR code centralizado

**Problema**: O aplicativo exibe "QR code inválido".

**Solução**:
1. Verifique se o convidado está apresentando o QR code correto para o evento
2. Certifique-se de que o aplicativo está conectado à internet
3. Tente atualizar a lista de convidados no aplicativo
4. Em último caso, busque o nome do convidado manualmente na lista

### Problemas com o Painel Administrativo

**Problema**: Não consigo fazer login no painel.

**Solução**:
1. Verifique se está usando o email e senha corretos
2. Tente recuperar a senha através da opção "Esqueci minha senha"
3. Limpe o cache do navegador e tente novamente
4. Use um navegador diferente

## Dicas e Melhores Práticas

1. **Cadastro de Convidados**: Mantenha os números de telefone atualizados e no formato correto
2. **Envio de QR Codes**: Envie os QR codes com pelo menos 24 horas de antecedência
3. **Check-in**: Tenha pelo menos um dispositivo de backup com o aplicativo instalado
4. **Internet**: Garanta uma conexão de internet estável no local do evento
5. **Bateria**: Mantenha os dispositivos carregados ou tenha carregadores disponíveis

## Suporte Técnico

Se você encontrar problemas que não consegue resolver, entre em contato com nosso suporte técnico:

- Email: suporte@secgenesis.com
- Telefone: (11) 99999-9999
- Horário de atendimento: Segunda a Sexta, das 9h às 18h

## Perguntas Frequentes

**P: O sistema funciona sem internet?**
R: O aplicativo leitor pode funcionar offline por um curto período, mas é recomendado ter conexão com a internet para garantir dados atualizados.

**P: Posso usar o mesmo QR code para vários eventos?**
R: Não, cada QR code é único para um convidado em um evento específico.

**P: Existe limite de convidados por evento?**
R: O plano gratuito suporta até 1.000 convidados por evento.

**P: O convidado precisa ter WhatsApp para receber o QR code?**
R: Sim, o envio automático é feito via WhatsApp. Alternativamente, você pode gerar o QR code e enviá-lo por email ou outro meio.

**P: Posso personalizar a mensagem enviada com o QR code?**
R: Sim, você pode personalizar a mensagem nas configurações do evento.

---

Agradecemos por escolher o SecGenesis para o controle de acesso do seu evento!

© 2025 SecGenesis - Todos os direitos reservados
