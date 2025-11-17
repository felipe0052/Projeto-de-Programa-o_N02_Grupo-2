## Objetivo
- Remover todos os dados mocados do frontend e integrar com a API existente (Spring, porta `8080`), garantindo fluxo real, sem placeholders.

## Diagnóstico Rápido
- Mocks centrais: `lib/course-data.ts:35–146` expõe `mockCourses` e `courseCategories`.
- Páginas que usam mocks:
  - Cursos: `app/courses/page.tsx:6, 19–35`
  - Detalhe do curso: `app/course/[id]/page.tsx:5, 11`
  - Gerenciar cursos: `app/manage/courses/page.tsx:6, 14`
  - Editar curso: `app/manage/courses/[id]/edit/page.tsx:5, 12`
  - Meus cursos: `app/my-courses/page.tsx:5, 30–39`
  - Aula do curso: `app/my-courses/[id]/page.tsx:6, 12`
- Autenticação mock: `lib/auth-context.tsx:28–39, 41–52` (login/signup não chamam API).

## API Disponível (back-end)
- Cursos (`/cursos`):
  - `GET /cursos` com filtros `categoria`, `instrutor`, etc. (`src/main/java/com/fsa/controller/CourseController.java:33–43`)
  - `GET /cursos/{id}` (`46–48`)
  - `POST /cursos` (criação) (`28–31`)
  - `PUT /cursos/{id}` (atualização) (`50–53`)
  - `POST /cursos/{id}/inscricoes` (matrícula) (`81–84`)
- Categorias (`/categorias`): `GET /categorias` (`CategoryController`)
- Auth (`/auth/login`): retorna `LoginResponse` com `jwt`, `roles` (`src/main/java/com/fsa/controller/AuthController.java:19–23`).
- Observação: não há GET de "inscrições do usuário" e o modelo de curso não tem módulos/aulas.

## Mapeamento de Dados (API → UI)
- `CourseResponse` (API) → UI:
  - Disponível: `id`, `nome`, `descricao`, `valor`, `status`, `categoryId`, `categoryNome`, `instructorId`, `vagasDisponiveis`, `limiteAlunos`, `horario` (`CourseResponse.java:11–25`).
  - Indisponível (remover da UI): `level`, `type`, `rating`, `students`, `image`, `modules/lessons`, `instructor.name`.
- Categorias: usar `CategoryResponse { id, nome, descricao }`.
- Roles: mapeamento dos `roles` do JWT: `ALUNO` → `student`, `INSTRUTOR` → `instructor`, `ADMIN` → `admin` (derivada).

## Estratégia de Integração
- Criar camada HTTP única (`lib/api.ts`) usando `fetch`, anexando `Authorization: Bearer <jwt>` quando autenticado.
- Adicionar rewrite em `next.config.mjs` para proxy:
  - `/api/*` → `http://localhost:8080/*` (evita CORS no dev).
- Padrões de chamada:
  - Cursos: `GET /api/cursos`, `GET /api/cursos/{id}`, `PUT /api/cursos/{id}`, `POST /api/cursos/{id}/inscricoes`.
  - Categorias: `GET /api/categorias`.
- Sem bibliotecas extras (sem axios/react-query), mantendo stack atual.

## Alterações por Página/Componente
- `lib/auth-context.tsx`:
  - `login`: chamar `POST /api/auth/login` com `{ email, senha }`; persistir `{ id, nome, roles, admin, jwt }`.
  - `signup`: desabilitar (exibir erro "Cadastro indisponível"), pois não há endpoint.
  - Expor `token` e `role` mapeada.
- `app/courses/page.tsx`:
  - Remover `mockCourses`/`courseCategories`.
  - `useEffect` para carregar `categorias` e `cursos`; aplicar filtros compatíveis (categoria, preço: `valor == 0` → "Gratuito").
  - Ajustar UI para campos disponíveis; retirar filtros de nível/tipo.
- `components/course-card.tsx`:
  - Tipar com `CourseResponse` adaptado.
  - Renderizar `nome`, `descricao` (clamp), `categoryNome`, `status`, `valor` e `vagasDisponiveis`.
- `app/course/[id]/page.tsx`:
  - Buscar curso por `id`; mostrar dados disponíveis.
  - Botão "Inscrever-se": `POST /api/cursos/{id}/inscricoes` com `userId` do contexto.
  - Remover seções de módulos/aulas e dados de instrutor não disponíveis.
- `app/manage/courses/page.tsx`:
  - Listar cursos; se `role === instructor`, usar `GET /api/cursos?instrutor=<userId>`.
  - Atualizar estatísticas com dados reais (contagens derivadas disponíveis).
- `app/manage/courses/[id]/edit/page.tsx`:
  - Carregar curso e permitir editar campos suportados (`nome`, `descricao`, `valor`, `limiteAlunos`, `horario`, `categoryId`, `status` se aplicável).
  - `PUT /api/cursos/{id}` ao salvar.
- `app/my-courses/*`:
  - Remover conteúdo e progresso mocados.
  - Exibir estado informativo: sem endpoint de listagem de inscrições, ocultar grade e sugerir navegação para catálogo.

## Configuração e Segurança
- Rewrites no `next.config.mjs` para evitar CORS em desenvolvimento.
- Persistência de `jwt` em `localStorage` (simples e imediato); não logar o token.
- Headers `Authorization` apenas em chamadas protegidas.

## Validação
- Fluxos a validar manualmente:
  - Login real e navegação para `/courses`.
  - Listagem de cursos e filtros compatíveis.
  - Detalhe do curso e matrícula.
  - Edição de curso (PUT) para instrutor/admin.

## Entregáveis
- Remoção de todos os imports e usos de `mockCourses`/`courseCategories`.
- Camada HTTP mínima (`lib/api.ts`) e ajustes de páginas/componentes conforme acima.
- Rewrites em `next.config.mjs` para proxy.

## Observação de Compatibilidade
- Campos não ofertados pela API serão eliminados da UI para cumprir a regra de "Proibição Absoluta de Dados Mocados".

Confirma que posso executar este plano e aplicar as alterações descritas?