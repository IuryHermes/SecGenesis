# Interface do Aplicativo de Leitura para Seguranças

## Princípios de Design

A interface do aplicativo de leitura de QR code para os seguranças foi projetada seguindo princípios fundamentais de usabilidade para usuários com pouca familiaridade tecnológica:

1. **Simplicidade extrema**: Apenas as funções essenciais estão visíveis
2. **Clareza visual**: Textos grandes e contrastantes para fácil leitura em qualquer condição
3. **Feedback imediato**: Confirmações visuais e sonoras para cada ação
4. **Tolerância a erros**: Prevenção de ações acidentais com confirmações simples
5. **Acessibilidade**: Botões grandes e espaçados para evitar toques errados

## Telas do Aplicativo

### Tela de Login

A tela de login é minimalista, exigindo apenas:
- Campo para nome do usuário (segurança)
- Campo para senha (opcional, pode ser substituído por código do evento)
- Botão grande de "ENTRAR" em cor destacada
- Opção "Lembrar de mim" já marcada por padrão

### Tela Principal (Leitura de QR Code)

A tela principal é dominada pela área de captura da câmera, com elementos mínimos:
- Área de visualização da câmera ocupando 70% da tela
- Moldura guia para posicionamento do QR code
- Botão grande "ESCANEAR" na parte inferior (caso não seja automático)
- Indicador de status da conexão (online/offline)
- Contador simples de entradas já realizadas

### Tela de Confirmação (após leitura)

Após a leitura bem-sucedida, a tela exibe:
- Nome do convidado em fonte muito grande (visível a distância)
- Número de telefone (opcional, para confirmação adicional)
- Indicação visual clara de status (verde para autorizado)
- Botão grande "CONFIRMAR ENTRADA" 
- Botão secundário "CANCELAR" (menor e menos destacado)
- Feedback sonoro automático (som diferente para autorizado/não autorizado)

### Tela de Erro ou Não Autorizado

Em caso de QR code inválido ou já utilizado:
- Indicação visual em vermelho
- Mensagem clara do motivo (ex: "QR Code já utilizado" ou "QR Code inválido")
- Som de alerta diferenciado
- Botão "TENTAR NOVAMENTE" em posição destacada
- Opção para contatar organizador em caso de problemas

### Menu Lateral Simplificado

Menu lateral acessível por botão discreto, contendo apenas:
- Nome do evento atual
- Opção para trocar de evento (caso haja mais de um)
- Contador total de entradas realizadas
- Botão para sincronizar dados (caso esteja offline)
- Botão de logout

## Elementos de Interface

### Cores

- **Verde brilhante**: Para confirmações positivas e botões de ação principal
- **Vermelho**: Apenas para alertas e negações
- **Azul escuro**: Cor de fundo principal para contraste
- **Branco**: Para textos e áreas de destaque
- **Cinza claro**: Para elementos secundários

### Tipografia

- Fonte sem serifa de alta legibilidade (como Roboto ou Open Sans)
- Tamanho mínimo de 16pt para qualquer texto
- Nome do convidado exibido em 32pt ou maior
- Botões com texto em caixa alta para maior destaque

### Botões e Controles

- Botões principais com mínimo de 64dp de altura
- Espaçamento mínimo de 16dp entre elementos interativos
- Feedback tátil (vibração) ao pressionar botões
- Estados visuais claros para botões (normal, pressionado, desabilitado)

## Modos de Operação

### Modo Padrão

O modo padrão é otimizado para uso em condições normais, com todas as funcionalidades disponíveis e sincronização em tempo real.

### Modo Offline

Ativado automaticamente quando a conexão é perdida:
- Indicador visual claro de "MODO OFFLINE" no topo da tela
- Validação contra base de dados local
- Armazenamento de entradas para sincronização posterior
- Botão para sincronizar manualmente quando a conexão for restaurada

### Modo Noturno

Otimizado para ambientes com pouca luz:
- Fundo escuro para reduzir brilho da tela
- Cores mais contrastantes
- Lanterna ativada automaticamente durante a leitura
- Ícone para alternar entre modo claro/escuro facilmente acessível

## Fluxo de Interação

1. Segurança inicia o aplicativo
2. Seleciona o evento (ou é direcionado automaticamente ao evento do dia)
3. Aponta a câmera para o QR code do convidado
4. O aplicativo lê automaticamente o código quando bem posicionado
5. Exibe imediatamente o nome do convidado em tela grande
6. Emite som de confirmação e vibração
7. Após 3 segundos, retorna automaticamente para a tela de leitura para o próximo convidado

## Considerações Especiais

### Acessibilidade

- Suporte a aumento de fonte do sistema
- Compatibilidade com leitores de tela
- Contraste adequado para visibilidade em luz solar direta
- Feedback múltiplo (visual, sonoro e tátil) para cada ação importante

### Performance

- Tempo de inicialização inferior a 2 segundos
- Leitura de QR code em menos de 1 segundo
- Transição instantânea entre telas
- Funcionamento fluido mesmo em dispositivos de entrada

### Prevenção de Erros

- Confirmação para ações críticas (como logout durante evento)
- Impossibilidade de fechar o aplicativo acidentalmente durante uso
- Recuperação automática em caso de travamento
- Armazenamento local de dados para evitar perda de informações
