endpoint de login 
Response: usuário cargo id jwt 
request: email senha

endpoint post curso
response: curso
request: tudo da classe**

endpoint get curso
response: tudo do curso
parâmetros query: id, categoria, disponibilidade, instrutor , mais recente, mais antigos

endpoint put curso
response: curso editado
put all 
put instrutor
put categoria
put status
put vagas (n pode ter menos vagas do que inscritos)

endpoint delete curso
só pode deletar se não tiver mais ngm inscrito

endpoint para desinscrever all
endpoint para desinscrever id

endpoint post inscrever id

endpoint post categoria
endpoint get categoria
endpoint put categoria
endpoint delete categoria (n pode deletar categoria que tem cursos)
Regras de negócios
RN01: Cada curso deve estar vinculado a uma categoria.
RN02: O limite de vagas deve ser maior que zero.
RN03: Apenas o administrador ou o instrutor responsável pode editar um curso.
RN04: Cursos com alunos matriculados não podem ser removidos sem notificação prévia.
RN05: Cada curso deve pertencer a uma ou mais categorias. **
RN06: Cursos propostos só ficam ativos após aprovação do administrador.
RN07: Cursos inativos não devem aparecer na listagem.
RN08: Matrícula só é efetivada se houver vagas e o aluno cumprir pré-requisitos.
RN09: O status da matrícula deve refletir a disponibilidade de vagas e os pré-requisitos atendidos.
RN10: Relatórios devem refletir dados atualizados em tempo real.

■ Criar classes
■ Implementar funcionalidades de cadastro, edição e exclusão de cursos
■ Definir pré-requisitos e limite de vagas
■ Implementar validação automática de instrutor responsável (deve estar
ativo e cadastrado)
■ Permitir associação de múltiplos instrutores e categorias a um mesmo
curso
■ Permitir associação de múltiplos instrutores e categorias a um mesmo
curso
■ Criar repositório para persistir dados
● Criar tabelas curso e categoria_curso
● Implementar o repositório CursoRepository com operações
CRUD
● Criar método para listar cursos por categoria e/ou instrutor
● Garantir relacionamento com aulas, inscrições e avaliacoes
● Validar integridade antes da exclusão (curso com alunos inscritos
não pode ser excluído)