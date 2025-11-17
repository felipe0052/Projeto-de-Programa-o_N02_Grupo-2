## Objetivo
- Trocar o conceito de preço em dinheiro por créditos acadêmicos.
- Impedir cursos gratuitos (mínimo 1 crédito).
- Alinhar backend, API e frontend ao novo modelo, sem dados mocados.

## Diagnóstico Atual
- Backend armazena e expõe `valor` como dinheiro:
  - `src/main/java/com/fsa/domain/Course.java:29-31` — `BigDecimal valor` com `precision=10, scale=2`.
  - `src/main/java/com/fsa/dto/course/CourseCreateRequest.java:16-17` — `@DecimalMin("0.0") BigDecimal valor`.
  - `src/main/java/com/fsa/dto/course/CourseResponse.java:16` — `BigDecimal valor`.
  - `src/main/java/com/fsa/service/CourseService.java:49,91,154` — mapeamento e atualização de `valor`.
- Frontend usa `valor` e trata 0 como "Gratuito":
  - `interface(Next.Js)/GerenciaCurso/components/course-card.tsx:10` — mostra "Gratuito" quando `valor === 0`.
  - `interface(Next.Js)/GerenciaCurso/app/courses/page.tsx:71-75` — filtro `free/paid` baseado em `valor`.
  - `interface(Next.Js)/GerenciaCurso/app/course/[id]/page.tsx:49-50,107` — exibe moeda e "Gratuito".
  - `interface(Next.Js)/GerenciaCurso/lib/api.ts:20,35` — tipos `valor: number` em request/response.

## Mudanças de Backend
- Modelo:
  - Renomear `valor` → `creditos` em `Course` (`Course.java`).
  - Tipo: `Integer creditos` com `@Column(nullable=false)`.
  - Regra: mínimo 1 crédito (`@NotNull @Min(1)` no DTO de criação/edição).
- DTOs:
  - `CourseCreateRequest`: trocar campo `valor` por `creditos: Integer` com `@Min(1)`.
  - `CourseResponse`: trocar `valor` por `creditos: Integer`.
- Serviço (`CourseService`):
  - Ajustar criação/atualização para usar `creditos`.
  - Garantir que nenhum curso possa ter `creditos <= 0`; lançar `IllegalArgumentException` se violado.
- Controller: sem mudanças de rotas, mas o payload passa a usar `creditos`.

## Migração de Banco (MySQL, `ddl-auto: none`)
- Todas as migrações devem ser executadas via script Python.
- Após verificar que a migração foi concluída com sucesso, o script Python utilizado deve ser deletado.
- Opção direta (se valores atuais já representam créditos inteiros):
  - SQL: `ALTER TABLE courses CHANGE COLUMN valor creditos INT NOT NULL;`
- Opção segura (sem perder dados, quando existir decimal):
  - SQLs:
    - `ALTER TABLE courses ADD COLUMN creditos INT NOT NULL DEFAULT 1;`
    - Definir regra de migração dos valores existentes para créditos (necessita decisão do produto; não inventar taxa de conversão).
    - `ALTER TABLE courses DROP COLUMN valor;`
- O script Python deve:
  - Conectar ao MySQL com usuário de privilégio mínimo suficiente para DDL.
  - Executar as SQLs dentro de transação; registrar logs.
  - Verificar sucesso (checar existência de coluna `creditos`, tipo `INT`, e dados não nulos e `>=1`).
  - Em caso de sucesso, remover o próprio arquivo do script do ambiente.

## Mudanças de API/Contrato
- Quebra controlada ou transição:
  - Quebra simples: substituir `valor` por `creditos` imediatamente em requests/responses.
  - Transição: aceitar ambos por um período, priorizando `creditos` e ignorando `valor` quando ambos forem enviados; documentar depreciação de `valor`.

## Mudanças de Frontend
- Tipos (`lib/api.ts`):
  - Substituir `valor` por `creditos` em `CourseResponse` e `CourseCreateRequest`.
- UI:
  - `course-card.tsx`: mostrar `"{creditos} créditos"` e remover lógica de "Gratuito".
  - `app/courses/page.tsx`: remover filtro `free/paid`; opcionalmente trocar por filtro por faixa de créditos (não obrigatório para este escopo).
  - `app/course/[id]/page.tsx`: exibir `"{creditos} créditos"`; remover moeda e estado de gratuito.
- Integração: atualizar chamadas de criação/edição para enviar `creditos`.

## Validações e Testes
- Backend: testes de serviço para garantir rejeição de `creditos <= 0` e fluxo de criação/edição.
- Frontend: validar renderização com `creditos` e remoção de filtros de gratuito.
- Manual: verificar páginas de listagem/detalhe e payloads no DevTools.

## Rollout
- Passo 1: executar script Python de migração no banco e deletá-lo após sucesso.
- Passo 2: atualizar backend e publicar.
- Passo 3: atualizar frontend e publicar.
- Passo 4: smoke tests de criação/listagem/edição e inscrição.

## Considerações
- Sem dados mocados; nenhuma taxa de conversão será inventada.
- Se houver cursos com `valor=0`, ajustar para `creditos>=1` antes da migração (decisão de produto).
- Manter arquitetura limpa e nomes consistentes (`creditos`).

Confirma para eu executar as alterações?