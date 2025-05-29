# API Documentation - SecGenesis

## Visão Geral

A API SecGenesis fornece endpoints para gerenciamento completo de eventos, convidados, QR codes e check-ins para o sistema de controle de acesso SecGenesis.

## Base URL

```
http://localhost:5000/api
```

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, inclua o token no header da requisição:

```
x-auth-token: seu_token_jwt
```

### Endpoints de Autenticação

#### Registro de Usuário
- **URL**: `/auth/register`
- **Método**: `POST`
- **Descrição**: Registra um novo usuário no sistema
- **Corpo da Requisição**:
  ```json
  {
    "name": "Nome Completo",
    "email": "email@exemplo.com",
    "password": "senha123",
    "role": "organizer", // "admin", "organizer" ou "security"
    "phone": "11999999999"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "message": "Usuário registrado com sucesso",
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "name": "Nome Completo",
      "email": "email@exemplo.com",
      "role": "organizer"
    }
  }
  ```

#### Login
- **URL**: `/auth/login`
- **Método**: `POST`
- **Descrição**: Autentica um usuário e retorna um token JWT
- **Corpo da Requisição**:
  ```json
  {
    "email": "email@exemplo.com",
    "password": "senha123"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "message": "Login realizado com sucesso",
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "name": "Nome Completo",
      "email": "email@exemplo.com",
      "role": "organizer"
    }
  }
  ```

### Endpoints de Eventos

#### Criar Evento
- **URL**: `/events`
- **Método**: `POST`
- **Autenticação**: Requerida (Organizador ou Admin)
- **Corpo da Requisição**:
  ```json
  {
    "name": "Nome do Evento",
    "date": "2023-12-31",
    "time": "20:00",
    "location": "Local do Evento",
    "description": "Descrição do evento",
    "contactPhone": "11999999999"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "message": "Evento criado com sucesso",
    "event": {
      "_id": "event_id",
      "name": "Nome do Evento",
      "date": "2023-12-31T00:00:00.000Z",
      "time": "20:00",
      "location": "Local do Evento",
      "description": "Descrição do evento",
      "organizerId": "user_id",
      "contactPhone": "11999999999",
      "status": "active",
      "createdAt": "2023-05-15T14:30:00.000Z",
      "updatedAt": "2023-05-15T14:30:00.000Z"
    }
  }
  ```

#### Listar Eventos
- **URL**: `/events`
- **Método**: `GET`
- **Autenticação**: Requerida
- **Parâmetros de Query**:
  - `page`: Número da página (padrão: 1)
  - `limit`: Limite de itens por página (padrão: 10)
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "count": 2,
    "total": 5,
    "totalPages": 3,
    "currentPage": 1,
    "events": [
      {
        "_id": "event_id_1",
        "name": "Evento 1",
        "date": "2023-12-31T00:00:00.000Z",
        "time": "20:00",
        "location": "Local do Evento 1",
        "status": "active"
      },
      {
        "_id": "event_id_2",
        "name": "Evento 2",
        "date": "2023-11-15T00:00:00.000Z",
        "time": "19:00",
        "location": "Local do Evento 2",
        "status": "active"
      }
    ]
  }
  ```

### Endpoints de Convidados

#### Adicionar Convidado
- **URL**: `/guests`
- **Método**: `POST`
- **Autenticação**: Requerida (Organizador ou Admin)
- **Corpo da Requisição**:
  ```json
  {
    "eventId": "event_id",
    "name": "Nome do Convidado",
    "phone": "11999999999",
    "email": "convidado@exemplo.com",
    "notes": "Observações sobre o convidado"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "message": "Convidado adicionado com sucesso",
    "guest": {
      "_id": "guest_id",
      "eventId": "event_id",
      "name": "Nome do Convidado",
      "phone": "11999999999",
      "email": "convidado@exemplo.com",
      "notes": "Observações sobre o convidado",
      "status": "pending",
      "qrCodeData": "json_string_qr_data",
      "createdAt": "2023-05-15T14:35:00.000Z",
      "updatedAt": "2023-05-15T14:35:00.000Z"
    }
  }
  ```

#### Listar Convidados por Evento
- **URL**: `/guests/event/:eventId`
- **Método**: `GET`
- **Autenticação**: Requerida (Segurança, Organizador ou Admin)
- **Parâmetros de Query**:
  - `page`: Número da página (padrão: 1)
  - `limit`: Limite de itens por página (padrão: 50)
  - `status`: Filtrar por status (opcional)
  - `search`: Buscar por nome, telefone ou email (opcional)
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "count": 2,
    "total": 100,
    "totalPages": 50,
    "currentPage": 1,
    "guests": [
      {
        "_id": "guest_id_1",
        "eventId": "event_id",
        "name": "Convidado 1",
        "phone": "11999999991",
        "email": "convidado1@exemplo.com",
        "status": "pending"
      },
      {
        "_id": "guest_id_2",
        "eventId": "event_id",
        "name": "Convidado 2",
        "phone": "11999999992",
        "email": "convidado2@exemplo.com",
        "status": "invited"
      }
    ]
  }
  ```

### Endpoints de Check-in

#### Realizar Check-in
- **URL**: `/checkins/perform`
- **Método**: `POST`
- **Autenticação**: Requerida (Segurança, Organizador ou Admin)
- **Corpo da Requisição**:
  ```json
  {
    "qrCodeData": "json_string_qr_data",
    "deviceInfo": {
      "deviceId": "device_id",
      "deviceModel": "iPhone 13",
      "appVersion": "1.0.0"
    },
    "location": {
      "latitude": -23.5505,
      "longitude": -46.6333
    }
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "message": "Check-in realizado com sucesso",
    "guest": {
      "_id": "guest_id",
      "name": "Nome do Convidado",
      "phone": "11999999999",
      "status": "checked-in"
    },
    "event": {
      "_id": "event_id",
      "name": "Nome do Evento"
    },
    "checkin": {
      "_id": "checkin_id",
      "eventId": "event_id",
      "guestId": "guest_id",
      "timestamp": "2023-05-15T19:45:00.000Z"
    }
  }
  ```

#### Validar QR Code
- **URL**: `/checkins/validate`
- **Método**: `POST`
- **Autenticação**: Requerida (Segurança, Organizador ou Admin)
- **Corpo da Requisição**:
  ```json
  {
    "qrCodeData": "json_string_qr_data"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "isValid": true,
    "alreadyCheckedIn": false,
    "guest": {
      "_id": "guest_id",
      "name": "Nome do Convidado",
      "phone": "11999999999",
      "status": "invited"
    },
    "event": {
      "_id": "event_id",
      "name": "Nome do Evento",
      "date": "2023-12-31T00:00:00.000Z"
    }
  }
  ```

### Endpoints de QR Code

#### Gerar QR Code para Convidado
- **URL**: `/qrcodes/generate/:guestId`
- **Método**: `GET`
- **Autenticação**: Requerida (Organizador ou Admin)
- **Resposta de Sucesso**: Imagem PNG do QR Code

#### Gerar QR Codes em Lote
- **URL**: `/qrcodes/generate-batch/:eventId`
- **Método**: `GET`
- **Autenticação**: Requerida (Organizador ou Admin)
- **Resposta de Sucesso**:
  ```json
  {
    "success": true,
    "message": "QR codes gerados com sucesso para 50 convidados.",
    "generatedCount": 50,
    "totalGuests": 50
  }
  ```

## Códigos de Status

- `200`: Requisição bem-sucedida
- `201`: Recurso criado com sucesso
- `400`: Requisição inválida
- `401`: Não autorizado
- `403`: Acesso proibido
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

## Integração com o Aplicativo Mobile

O aplicativo mobile SecGenesis se conecta à API através dos endpoints de autenticação e check-in. O fluxo básico é:

1. Usuário de segurança faz login através do endpoint `/auth/login`
2. O app armazena o token JWT retornado
3. Ao escanear um QR code, o app envia os dados para o endpoint `/checkins/validate`
4. Se válido, o app exibe os dados do convidado e permite confirmar o check-in
5. Ao confirmar, o app envia os dados para o endpoint `/checkins/perform`

## Considerações de Segurança

- Todas as senhas são armazenadas com hash bcrypt
- Todas as comunicações devem ser realizadas via HTTPS em produção
- Os tokens JWT expiram após 24 horas
- Diferentes níveis de permissão são aplicados a cada endpoint
