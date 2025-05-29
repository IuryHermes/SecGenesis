# Fluxo de Envio de QR Code pelo WhatsApp

## Visão Geral

O envio de QR codes pelo WhatsApp é um componente crítico do sistema de controle de acesso, pois representa o ponto de contato direto com os convidados. Este processo deve ser automatizado, confiável e personalizado, garantindo que cada convidado receba seu código único de forma conveniente e segura.

## Integração com WhatsApp

### Opções de Integração

Para o envio automatizado de mensagens pelo WhatsApp, existem duas abordagens principais:

1. **API Oficial do WhatsApp Business**: Solução oficial e mais confiável, porém requer aprovação da Meta e tem custos associados. Oferece maior estabilidade e conformidade com os termos de serviço.

2. **Serviços de Terceiros Homologados**: Plataformas como Twilio, MessageBird ou SendPulse que oferecem APIs para envio de mensagens via WhatsApp, já com a aprovação necessária da Meta.

Para este projeto, recomendamos a segunda opção por oferecer implementação mais rápida e menor complexidade inicial, com possibilidade de migração para a API oficial em versões futuras.

## Fluxo de Envio

### 1. Preparação dos Dados

O processo inicia no painel administrativo, onde o organizador do evento:

- Seleciona o evento para o qual deseja enviar os convites
- Filtra ou seleciona os convidados que receberão os QR codes
- Personaliza a mensagem padrão que acompanhará o QR code
- Programa data e hora para envio (opcional) ou escolhe envio imediato

### 2. Geração dos QR Codes

Para cada convidado selecionado, o sistema:

- Gera um identificador único (UUID) associado ao convidado e evento
- Criptografa as informações necessárias no QR code (ID do convidado, ID do evento, timestamp)
- Cria uma imagem de QR code com design personalizado incluindo o nome do evento
- Armazena o QR code no banco de dados, vinculado ao registro do convidado
- Prepara um arquivo de imagem temporário para envio

### 3. Composição da Mensagem

O sistema compõe automaticamente uma mensagem personalizada para cada convidado, incluindo:

- Saudação com o nome do convidado
- Nome do evento, data, horário e local
- Instruções claras sobre como utilizar o QR code na entrada
- A imagem do QR code anexada à mensagem
- Informações adicionais definidas pelo organizador (como regras do evento, estacionamento, etc.)
- Contato para suporte em caso de problemas

### 4. Processo de Envio

O envio ocorre através da API escolhida, seguindo estas etapas:

- Sistema conecta-se à API de mensagens usando credenciais seguras
- Para cada convidado, envia a mensagem personalizada com o QR code anexado
- Monitora o status de entrega de cada mensagem
- Registra confirmações de envio e recebimento no banco de dados
- Identifica e marca para reenvio as mensagens que falharam

### 5. Confirmação e Monitoramento

Após o envio:

- O painel administrativo exibe estatísticas em tempo real (enviados, entregues, lidos)
- Organizador pode verificar quais convidados já receberam seus QR codes
- Sistema permite reenvio seletivo para números que apresentaram falhas
- Notificações são enviadas ao organizador quando o processo de envio é concluído

### 6. Reenvio e Lembretes

O sistema também permite:

- Reenvio manual de QR codes para convidados específicos
- Programação de lembretes automáticos (ex: 1 dia antes do evento)
- Envio de mensagens de atualização caso haja mudanças no evento

## Personalização da Mensagem

### Modelo Base

```
Olá, [NOME DO CONVIDADO]!

Você está convidado para [NOME DO EVENTO] que acontecerá no dia [DATA] às [HORA] em [LOCAL].

Seu convite digital está anexado a esta mensagem. Basta apresentar o QR Code na entrada do evento para liberação rápida do seu acesso.

Informações adicionais:
[INFORMAÇÕES PERSONALIZADAS DO EVENTO]

Em caso de dúvidas, entre em contato: [TELEFONE/EMAIL DO ORGANIZADOR]
```

### Variáveis Dinâmicas

O sistema substituirá automaticamente as seguintes variáveis:

- `[NOME DO CONVIDADO]`: Nome do convidado extraído do cadastro
- `[NOME DO EVENTO]`: Nome do evento atual
- `[DATA]`: Data do evento formatada (ex: "25 de Dezembro de 2025")
- `[HORA]`: Horário de início do evento
- `[LOCAL]`: Endereço completo do evento
- `[INFORMAÇÕES PERSONALIZADAS]`: Campo livre para o organizador adicionar detalhes

## Considerações Técnicas

### Formatação de Números

- Sistema padroniza automaticamente os números de telefone para o formato internacional
- Validação de números antes do envio (formato válido para WhatsApp)
- Suporte a códigos de país diferentes (para eventos internacionais)

### Tratamento de Erros

- Identificação de números inválidos ou inexistentes
- Detecção de mensagens não entregues ou bloqueadas
- Fila de reenvio automático com tentativas programadas
- Notificação ao organizador sobre falhas persistentes

### Limitações e Controle de Envio

- Respeito aos limites de API (evitando bloqueios por spam)
- Envio em lotes para grandes volumes de convidados
- Distribuição temporal para evitar sobrecarga
- Priorização de envios baseada na proximidade do evento

### Segurança e Privacidade

- Conformidade com LGPD para tratamento de dados pessoais
- Criptografia de dados sensíveis no banco de dados
- Acesso restrito às informações de contato dos convidados
- Opção para convidados cancelarem recebimento de mensagens futuras

## Métricas e Análise

O sistema registra e disponibiliza para análise:

- Taxa de entrega das mensagens
- Taxa de abertura/visualização
- Horários de maior engajamento
- Efetividade de lembretes
- Correlação entre recebimento do QR code e comparecimento ao evento

## Testes e Validação

Antes do uso em produção, o fluxo de envio passa por:

- Testes internos com números da equipe
- Envio piloto para um grupo pequeno de convidados
- Validação de tempo médio de entrega
- Verificação da legibilidade do QR code em diferentes dispositivos
- Simulação de cenários de falha e recuperação
