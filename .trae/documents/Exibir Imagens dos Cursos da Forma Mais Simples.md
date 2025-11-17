## Objetivo
Fazer as imagens aparecerem nos cards da página `/courses` com a solução mais simples possível, sem depender de mudanças complexas no backend.

## Diagnóstico Atual
- A listagem de cursos (`GET /api/cursos`) não está retornando `imagens` para cada curso; por isso os cards mostram `image: undefined`.
- O campo legado `image_url` em `courses` não está mapeado na entidade atual e permanece vazio.

## Plano Simples (Frontend-First)
1. Enriquecer a lista de cursos no frontend:
- Após `getCourses`, chamar `GET /api/cursos/{id}/imagens` para cada curso e obter a primeira imagem.
- Anexar `firstImageUrl` ao objeto do curso em memória.
2. Atualizar `CourseCard`:
- Exibir `firstImageUrl` como miniatura do card; fallback para gradiente quando não houver.
3. Logs e verificação:
- Manter logs no console para confirmar URLs carregadas por curso.

## Passos Técnicos
- `app/courses/page.tsx`:
  - Após `setCourses`, executar `Promise.all(courses.map(c => listCourseImages(c.id)))` e construir um `Map` curso→primeira URL.
  - Guardar isso em estado (`imageByCourseId`) e passar `firstImageUrl` para o `CourseCard`.
- `components/course-card.tsx`:
  - Receber `firstImageUrl` como prop e utilizar no `<Image unoptimized />`.

## Alternativa (Backend Cover Image)
Se preferir deixar definitivo e performático:
1. Adicionar `imageUrl` em `Course` e no `CourseResponse`.
2. No upload de imagens do curso, setar `imageUrl` com a primeira imagem (se vazio).
3. Cards passam a usar `course.imageUrl` diretamente da listagem.

## Validação
- Testar criação e edição com upload e confirmar:
  - `/courses` exibe miniaturas.
  - `/course/[id]` exibe imagem destaque.
- Conferir console: lista de cursos e URLs de imagens por `id`. 

Confirma aplicar o plano simples no frontend agora? Se quiser, já aplico a alternativa backend para tornar definitivo e mais eficiente.