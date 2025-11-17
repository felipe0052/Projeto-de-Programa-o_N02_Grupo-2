## Escopo
- Remover toda funcionalidade de upload, armazenamento e exibição de imagens (MinIO, storage local, presign, base64) no backend e na interface Next.js.
- Remover dependências, configurações, DTOs e campos de banco associados a imagens.
- Adequar UI para não depender de imagens.

## Backend (Spring Boot)
- Controllers:
  - Remover endpoints de imagem em `src/main/java/com/fsa/controller/CourseController.java`:
    - `POST /cursos/imagem/presign` em d:\Trabalhos\lais\src\main\java\com\fsa\controller\CourseController.java:47–53
    - `POST /cursos/imagem` (upload local) em d:\Trabalhos\lais\src\main\java\com\fsa\controller\CourseController.java:55–61
    - `GET /cursos/obj/{key}` (download MinIO) em d:\Trabalhos\lais\src\main\java\com\fsa\controller\CourseController.java:63–75
  - Remover `MediaController` inteiro: d:\Trabalhos\lais\src\main\java\com\fsa\controller\MediaController.java
- Services:
  - Remover `StorageService` (MinIO): d:\Trabalhos\lais\src\main\java\com\fsa\service\StorageService.java
  - Remover `FileStorageService` (local): d:\Trabalhos\lais\src\main\java\com\fsa\service\FileStorageService.java
- DTOs:
  - Remover `PresignRequest`, `PresignResponse`, `UploadResponse` em d:\Trabalhos\lais\src\main\java\com\fsa\dto\storage\*
  - Remover campos de imagem em `CourseCreateRequest` e `CourseResponse`:
    - d:\Trabalhos\lais\src\main\java\com\fsa\dto\course\CourseCreateRequest.java:24–26
    - d:\Trabalhos\lais\src\main\java\com\fsa\dto\course\CourseResponse.java:25–26
- Entidade e Serviço de Curso:
  - Remover colunas da entidade `Course`:
    - `imagemBase64` e `imageUrl` em d:\Trabalhos\lais\src\main\java\com\fsa\domain\Course.java:35–39
  - Ajustar `CourseService` para não ler/validar/retornar imagens:
    - Remover validação base64 em d:\Trabalhos\lais\src\main\java\com\fsa\service\CourseService.java:101–103
    - Remover mapeamento para resposta em d:\Trabalhos\lais\src\main\java\com\fsa\service\CourseService.java:51–52
    - Remover set de imagem em criação d:\Trabalhos\lais\src\main\java\com\fsa\service\CourseService.java:111–113
    - Remover atualização de imagem em d:\Trabalhos\lais\src\main\java\com\fsa\service\CourseService.java:192–197
- Segurança:
  - Remover liberação de rotas de mídia em `SecurityConfig`:
    - d:\Trabalhos\lais\src\main\java\com\fsa\security\SecurityConfig.java:35–37
- Configurações (`application.yml`):
  - Remover suporte a multipart e static uploads:
    - `spring.servlet.multipart.*` em d:\Trabalhos\lais\src\main\resources\application.yml:17–19
    - `spring.web.resources.static-locations` (remover `file:./uploads/`) em d:\Trabalhos\lais\src\main\resources\application.yml:21–25
  - Remover `app.media.base-dir` e todo bloco `app.storage.*`:
    - d:\Trabalhos\lais\src\main\resources\application.yml:32–40
- Dependências:
  - Remover MinIO do `pom.xml`: d:\Trabalhos\lais\pom.xml:93–98
- Variáveis de ambiente (dev):
  - Deixar de usar `APP_MEDIA_BASE_DIR`, `APP_STORAGE_*` nas execuções locais.

## Interface Next.js
- API e Tipos:
  - Remover tipos e funções de upload/presign:
    - `PresignResponse`, `UploadResponse`, `presignCourseImage`, `uploadCourseImage` em d:\Trabalhos\lais\interface(Next.Js)\GerenciaCurso\lib\api.ts:160–191
  - Remover campos de imagem dos tipos `CourseResponse` e `CourseCreateRequest`:
    - d:\Trabalhos\lais\interface(Next.Js)\GerenciaCurso\lib\api.ts:22–23, 39–41
- Páginas/Componentes:
  - Página de novo curso:
    - Remover input de imagem base64, preview e validações: d:\Trabalhos\lais\interface(Next.Js)\GerenciaCurso\app\manage\courses\new\page.tsx:178–217, 327–335
    - Remover exigência de imagem nos passos e no publish: d:\Trabalhos\lais\interface(Next.Js)\GerenciaCurso\app\manage\courses\new\page.tsx:45–49, 63–66, 74–75
    - Remover import `UploadIcon`
  - Detalhe do curso:
    - Remover cálculo/uso de `imageSrc` e `<img ...>`: d:\Trabalhos\lais\interface(Next.Js)\GerenciaCurso\app\course\[id]\page.tsx:50, 104–110
    - Manter layout sem imagem (gradiente/background) ou simplificar o bloco visual.
  - Card de curso:
    - Remover `imageSrc` e `<img ...>`: d:\Trabalhos\lais\interface(Next.Js)\GerenciaCurso\components\course-card.tsx:11, 17–21
- `next.config.mjs`: sem alteração (não há uso específico de imagens remotas; opcional manter `images.unoptimized`).

## Banco de Dados
- Remover colunas da tabela `courses`:
  - `imagem_base64` (MEDIUMTEXT) e `image_url` (VARCHAR(512)).
- Como `ddl-auto: update` não remove colunas, adicionar migração (Flyway) com:
  - `ALTER TABLE courses DROP COLUMN imagem_base64;`
  - `ALTER TABLE courses DROP COLUMN image_url;`
- Alternativa mínima: manter colunas órfãs se não quiser introduzir ferramenta de migração agora, mas recomendável remover em produção.

## Limpeza de arquivos
- Opcional: remover diretório `./uploads/media` e quaisquer arquivos locais de mídia gerados.

## Critérios de Aceitação
- Build do backend compila sem referências a imagens/storage.
- OpenAPI não lista endpoints `/cursos/imagem*`, `/media*`, `/cursos/obj/*`.
- Interface não exibe inputs ou imagens de curso; não há chamadas de upload/presign.
- Banco não possui colunas de imagem após migração.

## Validação
- Rodar backend e verificar 200 em rotas principais sem erros de bean/config.
- Rodar interface e navegar por criação/listagem/detalhe de curso; validar UI sem imagens.

Confirma que posso executar o plano e aplicar as remoções? 