# DOXA

Rede social de debates e discussões construída com arquitetura **offline-first**.

O app funciona 100% localmente com SQLite e sincroniza automaticamente com o backend (PostgreSQL) quando há conexão com a internet.

## Arquitetura

```
┌──────────────────────┐         ┌──────────────────────┐
│   App Mobile (DOXA)  │  sync   │   Backend (doxa-api) │
│                      │◄───────►│                      │
│  React Native/Expo   │  HTTP   │  Kotlin/Spring Boot  │
│  SQLite (local)      │         │  PostgreSQL (remoto) │
└──────────────────────┘         └──────────────────────┘
```

- **Frontend**: React Native com Expo, persistência local via Expo SQLite
- **Backend**: Kotlin + Spring Boot 3 + Spring Data JPA + PostgreSQL
- **Sync**: Push/Pull automático via endpoints REST (`/api/sync/push` e `/api/sync/pull`)

## Pré-requisitos

- **Node.js** >= 18
- **Java** 21 (JDK)
- **PostgreSQL** >= 14
- **Maven** (incluído via wrapper `mvnw`)
- **Expo CLI**: `npm install -g expo-cli`

## Como Rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/DOXA.git
cd DOXA
```

### 2. Configurar o Backend (`doxa-api`)

#### 2.1. Criar o banco de dados PostgreSQL

```sql
CREATE DATABASE doxa;
```

#### 2.2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cd doxa-api
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DB_URL=jdbc:postgresql://localhost:5432/doxa
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
SERVER_PORT=8080
```

> O arquivo `.env` está no `.gitignore` e **não será commitado**. Nunca suba credenciais para o repositório.

#### 2.3. Rodar o backend

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

O servidor vai iniciar na porta definida no `.env` (padrão: `8080`).

As tabelas são criadas automaticamente pelo Hibernate (`ddl-auto: update`).

#### 2.4. Verificar se está funcionando

Abra no navegador:
```
http://localhost:8080/api/users
```

Deve retornar `[]` (lista vazia). Se retornar, o backend está rodando corretamente.

### 3. Configurar o Frontend (`DOXA`)

#### 3.1. Instalar dependências

```bash
cd DOXA
npm install
```

#### 3.2. Configurar o endereço da API

Edite o arquivo `services/api.ts` e ajuste o IP conforme seu ambiente:

| Ambiente | URL |
|---|---|
| Emulador Android | `http://10.0.2.2:8080/api` (padrão) |
| Dispositivo físico | `http://SEU_IP_LOCAL:8080/api` |
| iOS Simulator | `http://localhost:8080/api` |

Para descobrir seu IP local no Windows: `ipconfig` → IPv4 Address.

#### 3.3. Rodar o app

```bash
npx expo start
```

Depois pressione:
- `a` para abrir no emulador Android
- Escaneie o QR code com Expo Go no dispositivo físico

## Estrutura do Projeto

```
DOXA/
├── doxa-api/                  # Backend (Kotlin + Spring Boot)
│   ├── .env                   # Variáveis de ambiente (não commitado)
│   ├── .env.example           # Template de variáveis de ambiente
│   ├── pom.xml                # Dependências Maven
│   └── src/main/kotlin/com/doxa/
│       ├── models/            # Entidades JPA (User, Post, Comment, Community)
│       ├── repository/        # Repositórios Spring Data
│       ├── service/           # Lógica de negócio + SyncService
│       ├── controller/        # Endpoints REST
│       ├── dto/               # DTOs de sincronização
│       └── config/            # CORS e tratamento de exceções
│
├── DOXA/                      # Frontend (React Native + Expo)
│   ├── app/                   # Telas (Expo Router)
│   │   ├── (auth)/            # Login e Registro
│   │   ├── (tabs)/            # Feed, Search, Alerts, Profile
│   │   ├── post/              # Detalhe do post
│   │   └── community/         # Detalhe da comunidade
│   ├── components/            # Componentes reutilizáveis
│   ├── contexts/              # AuthContext
│   ├── database/              # SQLite (initialize, useDatabase, useSyncManager)
│   └── services/              # API client + SyncService
│
└── README.md
```

## Como Funciona o Sync

1. **Offline-first**: Todas as operações (criar post, comentar, salvar) são feitas no **SQLite local** e marcadas com `is_synced = 0`
2. **Push Sync**: Quando há conexão, dados com `is_synced = 0` são enviados para o backend via `POST /api/sync/push`
3. **Pull Sync**: O app busca dados do servidor via `GET /api/sync/pull` e insere/atualiza no SQLite local
4. **Automático**: O sync é disparado automaticamente após login/registro e na criação de posts/comunidades
5. **Retry**: Se o sync falhar, o app tenta novamente até 3 vezes antes de notificar o usuário

## 🛠️ Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/sync/pull` | Busca todos os dados do servidor |
| `POST` | `/api/sync/push` | Envia dados locais para o servidor |
| `GET` | `/api/users` | Lista todos os usuários |
| `GET` | `/api/users/{id}` | Busca usuário por ID |
| `POST` | `/api/users` | Cria novo usuário |
| `GET` | `/api/posts` | Lista todos os posts |
| `POST` | `/api/posts` | Cria novo post |
| `GET` | `/api/communities` | Lista todas as comunidades |
| `GET` | `/api/comments/post/{postId}` | Busca comentários de um post |

## Licença

Este projeto está licenciado sob a licença Apache 2.0 — veja o arquivo [LICENSE](LICENSE) para detalhes.