#  Gerenciador de Cursos

## Descrição do Módulo
API desenvolvida com **Spring Boot** para gerenciar cursos, categorias e matrículas.  
Inclui autenticação com **JWT**, documentação automática com **Swagger/OpenAPI**, e integração com um banco de dados **MySQL**

O módulo faz parte de um sistema de gestão educacional, integrando o **back-end (Spring Boot)** com o **front-end (Next js)**.

---

## Tecnologias e Bibliotecas Utilizadas

#### Back-end (Java / Spring Boot)
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

#### Front-end (Next Js )
- **Next.js 14+** — Framework React para renderização híbrida
- **Axios ou Fetch API** — Comunicação com a API Spring Boot  
- **Node.js / npm** — Ambiente de execução e gerenciamento de pacotes 

---

##  Passo a Passo para Executar o Projeto

#### 1. Executar o Banco de Dados 
Execute o servidor MySQL da maneira que você preferir apos isso importe o banco de dados (schema.sql)

#### 2. Executar o Back-end 
Execute diretamente pela IDE: o arquivo FsaApplication.java

#### 3. Executar o Front-end 
Entre na pasta do projeto front-end pelo cmd:
npm install
npm run build
npm start




