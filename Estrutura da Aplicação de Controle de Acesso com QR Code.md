# Estrutura da Aplicação de Controle de Acesso com QR Code

## Visão Geral

A aplicação será desenvolvida para facilitar o controle de acesso em eventos, permitindo que seguranças na portaria verifiquem rapidamente a identidade dos convidados através de QR codes. O sistema será dividido em duas partes principais: um painel administrativo para cadastro e gerenciamento de convidados, e um aplicativo móvel para leitura dos QR codes na entrada do evento.

## Componentes do Sistema

### 1. Painel Administrativo (Web)

O painel administrativo será uma aplicação web responsiva, acessível tanto por computadores quanto por dispositivos móveis, onde os organizadores do evento poderão:

- Cadastrar eventos com data, local e informações básicas
- Importar listas de convidados através de planilhas ou cadastro manual
- Gerenciar convidados (adicionar, editar, remover)
- Gerar e enviar QR codes automaticamente via WhatsApp
- Visualizar relatórios de presença em tempo real
- Monitorar o fluxo de entrada durante o evento

### 2. Aplicativo de Leitura (Mobile)

O aplicativo móvel será utilizado pelos seguranças na portaria para:

- Escanear QR codes dos convidados
- Visualizar informações do convidado após a leitura (nome, telefone)
- Confirmar entrada com um toque
- Funcionar offline caso haja problemas de conexão (sincronizando posteriormente)
- Interface extremamente simples e intuitiva para uso por pessoas com pouca familiaridade tecnológica

## Banco de Dados

A estrutura do banco de dados incluirá as seguintes tabelas principais:

1. **Eventos**: armazena informações sobre os eventos
2. **Convidados**: armazena dados dos convidados (nome, telefone, etc.)
3. **Convites**: relaciona convidados a eventos e armazena QR codes gerados
4. **Check-ins**: registra entradas confirmadas no evento

## Fluxo de Funcionamento

### Cadastro e Envio de Convites

1. Organizador acessa o painel administrativo
2. Cria um novo evento com todas as informações necessárias
3. Cadastra convidados individualmente ou importa lista
4. Sistema gera QR codes únicos para cada convidado
5. Organizador seleciona convidados e aciona envio automático via WhatsApp
6. Sistema envia mensagem personalizada com QR code para cada convidado

### Controle de Acesso no Evento

1. Segurança inicia o aplicativo de leitura no smartphone
2. Seleciona o evento ativo (ou o sistema carrega automaticamente o evento do dia)
3. Posiciona a câmera para ler o QR code apresentado pelo convidado
4. Aplicativo exibe instantaneamente o nome do convidado em tela grande e clara
5. Segurança confirma a entrada com um toque ou permite automaticamente
6. Sistema registra o horário de entrada e atualiza estatísticas em tempo real

## Tecnologias Propostas

Para garantir simplicidade no desenvolvimento e uso:

- **Backend**: Node.js com Express ou Flask (Python)
- **Frontend Web**: React.js ou Vue.js com design responsivo
- **Aplicativo Mobile**: React Native ou Flutter para desenvolvimento multiplataforma
- **Banco de Dados**: MongoDB ou PostgreSQL
- **Integração WhatsApp**: API oficial do WhatsApp Business ou serviços de terceiros homologados
- **Leitura QR Code**: Bibliotecas nativas de câmera com processamento de QR code

## Considerações de Segurança

- QR codes criptografados e com prazo de validade
- Autenticação segura para acesso ao painel administrativo
- Proteção de dados pessoais conforme LGPD
- Backup automático de dados
- Logs de todas as operações para auditoria

## Requisitos de Usabilidade

- Interface extremamente simples e intuitiva para o aplicativo de leitura
- Botões grandes e textos claros para facilitar o uso pelos seguranças
- Feedback visual e sonoro ao escanear QR codes
- Modo noturno para uso em ambientes com pouca iluminação
- Tempo de resposta inferior a 1 segundo para validação de QR codes
- Funcionamento mesmo com conexão de internet instável
