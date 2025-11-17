## Objetivo
Fazer `GET /api/cursos/{id}/imagens` responder sem 403, para que as miniaturas apareçam nos cards de `/courses`.

## Diagnóstico
- O front chama `http://localhost:3000/api/cursos/{id}/imagens` → rewrite para `http://localhost:8080/cursos/{id}/imagens`.
- O backend está com `.anyRequest().authenticated()` e apenas alguns matchers liberados; o padrão atual não está cobrindo a rota de imagens, resultando em 403.

## Plano Simples
1. Segurança (liberar GET de imagens)
- Alterar `SecurityConfig` para permitir explicitamente `HttpMethod.GET` em:
  - `"/cursos/**/imagens"`
  - `"/cursos/**/imagens/**"`
  - e manter `"/media/**"` como público.
- Não alterar POST/DELETE (upload/remoção) — continuam autenticados.

2. Reinicialização
- Reiniciar o backend para aplicar a configuração.

3. Verificação
- Testar diretamente:
  - `http://localhost:8080/cursos/13/imagens` (deve retornar `[]` ou lista)
  - `http://localhost:3000/api/cursos/13/imagens` (deve acompanhar)
- Confirmar que `/courses` passa a mostrar miniaturas.

4. Plano de Contingência
- Se o matcher ainda não cobrir, ampliar para `HttpMethod.GET` em `"/cursos/**"` temporariamente (apenas GET), garantindo que listagens e detalhes não quebrem.

## Observação
- Mantemos princípio de privilégio mínimo: só GET de imagens é público; escrita continua protegida.

Posso aplicar agora essa alteração de segurança e reiniciar o backend?