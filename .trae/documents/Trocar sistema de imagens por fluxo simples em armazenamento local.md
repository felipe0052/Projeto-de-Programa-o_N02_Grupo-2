## Objetivo
- Substituir o sistema atual (MinIO + presign + proxy) por um fluxo simples e direto de upload/serving.
- Reduzir complexidade no backend e frontend, mantendo desempenho, segurança e escalabilidade básica.

## Abordagem
- Adotar armazenamento local em disco com URLs públicas estáveis (`/media/{filename}`) servidas pelo próprio Spring Boot.
- Padronizar o backend para upload único via `MultipartFile`, eliminando presign e dependência de MinIO.
- No frontend, usar um único input de arquivo com preview e envio direto para o endpoint, recebendo `imageUrl` para salvar no modelo.

## Backend
- Remover fluxo de presign e integração MinIO do `StorageService` e controllers relacionados.
- Criar `FileStorageService` (disco):
  - `save(MultipartFile file)` — valida conteúdo, gera nome único (UUID + extensão), salva em `uploads/media/`.
  - `getPath(filename)` — resolve caminho físico.
  - `publicUrl(filename)` — retorna `/media/{filename}`.
- Expor `MediaController`:
  - `POST /media` — recebe `MultipartFile` (`image`), retorna `{ imageUrl, filename }`.
  - `GET /media/{filename}` — serve arquivo com `Content-Type` correto e `Cache-Control` configurado.
- Configurar estático:
  - `spring.web.resources.static-locations` para incluir `file:./uploads/`.
  - `spring.web.resources.cache.cachecontrol` com `max-age` apropriado.
- Ajustar modelos/serviços de curso:
  - Persistir somente `imageUrl`.
  - Remover/Depreciar `imagemBase64` do fluxo de criação/atualização (mantendo compatibilidade de leitura se necessário).
- Atualizar `application.yml`:
  - `app.media.base-dir: ./uploads/media`.
  - Remover chaves `app.storage.*` não utilizadas.

## Frontend
- Substituir lógica de presign/upload por:
  - Input `type="file"` com preview local.
  - `fetch('/api/media', { method: 'POST', body: FormData })`.
  - Usar `imageUrl` retornado para salvar no recurso (curso, etc.).
- Exibir imagem com `<img src={imageUrl} />` ou `<Image unoptimized src={imageUrl} />`.

## Migração
- Copiar objetos existentes do bucket para `uploads/media/` mantendo nomes (ou gerando novos e atualizando `imageUrl` nas entidades).
- Script de migração (somente execução controlada): listar `objectKey` em DB, baixar do MinIO, salvar local e atualizar `imageUrl`.
- Manter endpoint antigo de proxy por curto período com aviso de depreciação, se necessário.

## Segurança e Performance
- Validar `Content-Type` e extensão permitida (png, jpg, jpeg, webp, svg se aplicável).
- Limitar tamanho do arquivo (ex.: 5–10MB via `spring.servlet.multipart.max-file-size`).
- Evitar path traversal: normalizar e bloquear `..` em `filename`.
- Cache estático com `Cache-Control`, ETag e compressão quando aplicável.
- Geração de nomes únicos para evitar colisão; opcional: subpastas por data para organização.

## Testes e Validação
- Testes de integração `POST /media` com arquivos válidos e inválidos.
- Teste de serving `GET /media/{filename}` retornando `Content-Type` correto.
- Verificar fluxo de criação/edição de curso persistindo `imageUrl` e exibindo na UI.

## Rollback
- Guardar a antiga config MinIO e endpoints desativados por uma tag/feature flag durante transição.
- Possibilidade de reativar MinIO rapidamente se necessário.

Se estiver de acordo, autorizo aplicar as mudanças agora para entregar a nova solução de imagens.