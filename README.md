#  Gerenciador de Cursos

## Descrição do Módulo
API desenvolvida com **Spring Boot** para gerenciar cursos, categorias, usuários e matrículas.  
Inclui autenticação com **JWT**, documentação automática com **Swagger/OpenAPI**, e integração com um banco de dados **MySQL** executado via **Docker**.

O módulo faz parte de um sistema de gestão educacional, integrando o **back-end (Spring Boot)** com o **front-end (Next js)**.

---

## Tecnologias e Bibliotecas Utilizadas

### Back-end (Java / Spring Boot)
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

### Front-end (React / Vite)
- **Next.js 14+** — Framework React para renderização híbrida
- **React 18+** — Biblioteca base de componentes  
- **Axios ou Fetch API** — Comunicação com a API Spring Boot  
- **Node.js / npm** — Ambiente de execução e gerenciamento de pacotes 

---

##  Passo a Passo para Executar o Projeto

# 1. Executar o Banco de Dados (MySQL via Docker)
docker run --name mysql-fsa \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=fsa_db \
  -p 3306:3306 \
  -d mysql:8

# 2. Executar o Back-end (Spring Boot)
# Certifique-se de estar na pasta do projeto Java
mvn spring-boot:run
# ou, se preferir, execute diretamente pela IDE:
# FsaApplication.java

# 3. Executar o Front-end (Next.js)
# Entre na pasta do projeto front-end
npm install
npm run build
npm start




