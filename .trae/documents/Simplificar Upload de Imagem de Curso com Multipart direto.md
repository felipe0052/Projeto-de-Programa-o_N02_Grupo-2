## Problema
- Cursos são criados sem imagem porque o fluxo atual usa URL pré‑assinada (PUT direto no MinIO) e falha quando o bucket não existe, há CORS ou políticas públicas de leitura.
- O frontend cria o curso com `imageUrl`, mas se o upload falha, `imageUrl` fica vazio e nada é salvo no banco.

## Abordagem Proposta (mais fácil e rápida)
- Remover a dependência de upload direto ao storage pelo cliente.
- Implementar upload via backend usando `multipart/form-data`:
  - Frontend envia o arquivo para o backend.
  - Backend grava no MinIO com SDK, garante criação do bucket e retorna `publicUrl`.
- Frontend usa esse `publicUrl` no payload de criação do curso.

## Mudanças no Backend
### Novo endpoint de upload
- `POST /cursos/imagem` em `CourseController` (`d:\Trabalhos\lais\src\main\java\com\fsa\controller\CourseController.java`):
  - Recebe `MultipartFile file`.
  - Gera `objectKey` com `storageService.newObjectKey(file.getOriginalFilename())`.
  - Chama `storageService.upload(file.getInputStream(), objectKey, file.getContentType(), file.getSize())`.
  - Retorna `{ publicUrl: storageService.publicUrl(objectKey), objectKey }`.

### StorageService: método de upload
- Em `StorageService` (`d:\Trabalhos\lais\src\main\java\com\fsa\service\StorageService.java`):
  - Adicionar `upload(InputStream in, String objectKey, String contentType, long size)` usando MinIO:
    - Garantir bucket: `bucketExists`/`makeBucket`.
    - `PutObjectArgs.builder().bucket(bucket).object(objectKey).stream(in, size, -1).contentType(contentType).build()`.
  - Manter `publicUrl(objectKey)` como hoje.

### Segurança e Configuração
- Reusar `APP_STORAGE_*` já existentes (`application.yml`).
- Princípio do menor privilégio: usar credenciais de usuário com acesso somente ao bucket específico.

## Mudanças no Frontend
### Função de upload
- Em `lib/api.ts` (`d:\Trabalhos\lais\interface(Next.Js)\GerenciaCurso\lib\api.ts`):
  - Adicionar `uploadCourseImage(file: File, token: string)`:
    - `fetch('/api/cursos/imagem', { method: 'POST', headers: { Authorization: 'Bearer ...' }, body: FormData })`.
    - Retorno `{ publicUrl, objectKey }`.

### Página de criação de curso
- Em `app/manage/courses/new/page.tsx`:
  - Substituir o fluxo `presignCourseImage + PUT` pelo novo `uploadCourseImage`.
  - Ao sucesso, definir `formData.imageUrl = publicUrl`.
  - Validar limite de 1MB no client (mantém UX e compatibilidade com regra atual).

### Renderização de imagens
- Os componentes já podem exibir `imageUrl` (cards e detalhes). Garantir uso de `imageUrl` prioritariamente e `imagemBase64` como fallback quando presente.

## Passos de Verificação
- Subir MinIO em `APP_STORAGE_ENDPOINT` com bucket `APP_STORAGE_BUCKET` (o serviço cria automaticamente caso não exista).
- No frontend:
  - Selecionar uma imagem (< 1MB), verificar preview.
  - Criar curso e confirmar imagem nos cards (`components/course-card.tsx`) e na página de detalhes (`app/course/[id]/page.tsx`).
- No backend:
  - Conferir logs sem erros ao chamar `/cursos/imagem`.

## Evoluções Futuras (opcional)
- Se precisar manter bucket privado, adicionar endpoint `GET /cursos/imagem/presign-get` para gerar URL pré‑assinada de leitura.
- Persistir também `objectKey` no curso para servir imagens internamente sem depender de `publicUrl`.

Confirma que posso aplicar essa refatoração? Após confirmação, implemento backend e frontend, e valido o fluxo end‑to‑end.