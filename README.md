# FSA Plataforma de Cursos

Aplicação de gerenciamento de cursos composta por:
- Backend `Spring Boot` (Java 17) com autenticação JWT, MySQL e armazenamento de mídias em disco
- Frontend `Next.js` (App Router) consumindo a API via proxy (`/api`)

## Arquitetura
- Backend: REST (`/auth`, `/cursos`, `/categorias`, `/inscricoes`, `/media`) com Swagger UI, segurança stateless (JWT) e migrações Flyway
- Frontend: Next.js com rewrites de `/api/*` para o backend (`NEXT_PUBLIC_API_BASE_URL`), páginas de login, listagem, detalhe e gestão
- Banco: MySQL (dialeto Hibernate MySQL), migrações em `src/main/resources/db/migration`
- Mídias: arquivos armazenados em disco sob o diretório configurado (`.data/uploads` por padrão)

## Pré‑requisitos
- `Java 17`
- `Maven 3.9+`
- `MySQL 8+`
- `Node.js 18+` e `npm`/`pnpm`

## Configuração
### Backend (Spring Boot)
- Porta padrão: `8080` (`server.port` ajustável)
- Variáveis de ambiente suportadas:
  - `SPRING_DATASOURCE_URL` (padrão: `jdbc:mysql://localhost:3306/plataforma_cursos?...`)
  - `SPRING_DATASOURCE_USERNAME` (padrão: `root`)
  - `SPRING_DATASOURCE_PASSWORD` (padrão: vazio)
  - `APP_JWT_SECRET` (obrigatório em produção)
  - `APP_STORAGE_BASE_DIR` (padrão: `.data/uploads`)
  - `app.jwt.expiration-ms` (padrão: `3600000`)

### Frontend (Next.js)
- Variáveis:
  - `NEXT_PUBLIC_API_BASE_URL` (padrão: `http://localhost:8080`)
- Rewrites: `/api/:path*` → `${NEXT_PUBLIC_API_BASE_URL}/:path*`

## Instalação
### Banco de Dados
- Criar o banco se necessário:
  - `CREATE DATABASE plataforma_cursos CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
- Usar um usuário de banco com privilégios mínimos (não admin) para `SPRING_DATASOURCE_USERNAME`

### Backend
- Rodar em desenvolvimento:
  - Defina `APP_JWT_SECRET`
  - `mvn spring-boot:run`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Frontend
- Instalar dependências:
  - `cd interface(Next.Js)/GerenciaCurso`
  - `npm install`
- Rodar em desenvolvimento:
  - `npm run dev`
- Aplicação: `http://localhost:3000`

## Uso
### Via UI
- Cadastro e login: páginas `/signup` e `/login`
- Cursos:
  - Listagem: `/courses`
  - Detalhe: `/course/[id]`
  - Meus cursos: `/my-courses`
- Gestão (ADMIN ou instrutor proprietário):
  - `/manage/courses`, criar/editar/excluir cursos e enviar imagens

### Via API
- Autenticação:
  - `POST /auth/signup` → cria usuário com papel
  - `POST /auth/login` → retorna JWT (`Authorization: Bearer <token>`) e claims `uid`, `admin`, `roles`
- Categorias (`/categorias`): listar, criar, atualizar, excluir (autenticado)
- Cursos (`/cursos`):
  - `GET /cursos` (público): filtros `id`, `categoria`, `instrutor`, `inscritoPor`, `disponibilidade`, `maisRecente`, `maisAntigos`
  - `GET /cursos/{id}` (público; rascunho visível apenas a ADMIN/instrutor)
  - `POST/PUT/DELETE` (ADMIN ou instrutor proprietário)
  - Status: `RASCUNHO`, `ATIVO`, `ENCERRADO` (não lista `ENCERRADO`)
- Matrículas:
  - `POST /cursos/{id}/inscricoes` (ALUNO) → cria inscrição ativa
  - `DELETE /inscricoes/{id}` → cancela inscrição
  - `DELETE /cursos/{id}/inscricoes` → cancela todas as ativas do curso
- Imagens de curso:
  - `GET /cursos/{courseId}/imagens` → lista metadados
  - `POST /cursos/{courseId}/imagens` (multipart `files`) → upload
  - `DELETE /cursos/{courseId}/imagens/{imageId}` → remoção
  - `GET /media/cursos/{courseId}/{filename}` → servir arquivo

## Regras de Negócio
- Usuários e Papéis
  - Papéis disponíveis: `ALUNO`, `INSTRUTOR`; flag `admin` separada
  - `signup` exige `roleCode` válido; `login` exige email existente
  - JWT inclui `uid`, `admin`, `roles`; expiração configurável (`app.jwt.expiration-ms`)
- Cursos
  - Criação: não permitir status `ENCERRADO`; status padrão `RASCUNHO`
  - Edição/remoção: apenas `ADMIN` ou instrutor proprietário
  - Exclusão bloqueada se houver alunos ativos
  - `creditos` ≥ 1; `limiteAlunos` não pode ser menor que inscritos ativos
  - `RASCUNHO` visível apenas para `ADMIN` ou instrutor do curso; `ENCERRADO` não é listado
  - Filtros suportados e ordenação por `createdAt` (mais recentes/antigos)
- Matrículas
  - Apenas usuários com papel `ALUNO` podem se inscrever
  - Bloqueio por limite de vagas; cancelamento individual ou em massa por curso
- Imagens
  - Armazenadas em disco sob o diretório configurado; URL pública via `/media/cursos/...`
- Segurança
  - Endpoints públicos: `/auth/**`, `GET /cursos/**`, `/media/**`, Swagger UI
  - Demais endpoints requerem `Authorization: Bearer` válido

## Boas Práticas e Produção
- Banco: mínimo privilégio (sem usuários admin em serviços), senha forte, pool de conexões
- Armazenamento de mídias: persistir volume, backups e limites de tamanho
- Configurações:
  - Defina `APP_JWT_SECRET` forte
  - Ajuste `SPRING_DATASOURCE_*` para usuário restrito e banco dedicado
  - Defina `NEXT_PUBLIC_API_BASE_URL` para o endereço do backend
- Build:
  - Backend: `mvn -q -DskipTests package` e executar o jar com as variáveis
  - Frontend: `npm run build` e servir com `npm run start` atrás de um reverse proxy

## Pastas Importantes
- Backend: `src/main/java/com/fsa/**`, `src/main/resources/db/migration`, `application.yml`
- Frontend: `interface(Next.Js)/GerenciaCurso/app/**`, `lib/api.ts`, `next.config.mjs`




