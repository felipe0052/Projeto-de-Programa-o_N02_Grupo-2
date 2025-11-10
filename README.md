# :jigsaw: Gerenciador de Cursos

## :blue_book: Descrição do Módulo
API desenvolvida com **Spring Boot** para gerenciar cursos, categorias, usuários e matrículas.  
Inclui autenticação com **JWT**, documentação automática com **Swagger/OpenAPI**, e integração com um banco de dados **MySQL** executado via **Docker**.

O módulo faz parte de um sistema de gestão educacional, integrando o **back-end (Spring Boot)** com o **front-end (React + Vite)**.

---

## :gear: Tecnologias e Bibliotecas Utilizadas

### :desktop: Back-end (Java / Spring Boot)
- **Spring Boot 3.3.4**
- **Spring Web** — Criação de endpoints RESTful  
- **Spring Data JPA** — Persistência e acesso a dados  
- **Spring Security** — Autenticação e autorização  
- **Bean Validation** — Validação de campos de entrada  
- **JJWT (io.jsonwebtoken)** — Geração e validação de tokens JWT  
- **Lombok** — Redução de código boilerplate (`@Getter`, `@Setter`, etc.)  
- **MySQL Connector/J** — Conector JDBC para MySQL  
- **Springdoc OpenAPI** — Documentação Swagger em `/swagger-ui.html`  
- **Maven** — Gerenciamento de dependências e build

### :computer: Front-end (React / Vite)
- **React.js**
- **Vite** — Build rápido e leve  
- **ESLint** — Padronização de código  
- **Axios** (opcional) — Comunicação com a API  
- **Node.js / npm** — Execução do ambiente

---

##  Execução do Projeto
npm install 
npm build 
npm start 




```bash
docker run --name mysql-fsa -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=fsa_db -p 3306:3306 -d mysql:8
