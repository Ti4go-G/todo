# Projeto Todo List

Este é um projeto simples de uma aplicação de **Lista de Tarefas (Todo List)** que permite o cadastro de usuários, autenticação e gerenciamento de tarefas (CRUD).

## Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura das páginas (`index.html`, `login.html`, `register.html`, `dashboard.html`).
- **CSS3**: Estilização com Flexbox e Grid.
- **JavaScript (Vanilla)**: Lógica de interação com o usuário e chamadas à API com Axios.

### Backend
- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Para criação da API REST.
- **MongoDB**: Banco de dados NoSQL (utilizando Mongoose).
- **JWT (JSON Web Token)**: Autenticação dos usuários.
- **Bcrypt**: Hashing de senhas.
- **Cors**: Permite requisições de outras origens (para o frontend).

##  Estrutura do Projeto

O projeto está dividido em duas partes principais:

- `back/`: Contém o servidor, modelos de banco de dados, controladores e rotas da API.
- `front/`: Contém a interface do usuário (páginas HTML, estilos CSS e scripts JS).

##  Como Rodar o Projeto

1. **Backend**:
   - Abra o terminal e navegue até a pasta `back`.
   - Crie um arquivo `.env` com as configurações do banco de dados e JWT (ex: `PORT=3000`, `MONGODB_URI=(**no momento você precisará criar um cluster no mongodb e colocar sua uri aqui, ou solicitar a minha uri**))`, `JWT_SECRET=(seu secret jwt)`).
   - Instale dependências: `npm install`.
   - Inicie o servidor: `npm run dev`.

2. **Frontend**:
   - Navegue até a pasta `front`.
   - Abra o arquivo `index.html` no seu navegador .

##  Funcionalidades

- **Registro**: Crie uma nova conta de usuário.
- **Login**: Autentique-se para acessar o dashboard.
- **CRUD de Tarefas**: Crie, Liste, Atualize e Exclua tarefas.
- **Logout**: Encerre a sessão.