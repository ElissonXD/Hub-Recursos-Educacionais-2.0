# Hub de Recursos Educacionais 2.0

O Hub de Recursos Educacionais 2.0 é uma aplicação full-stack desenvolvida como parte do processo de seleção para a vaga de manutenção de software no VLAB. O projeto consiste em um CRUD completo para o gerenciamento de planos de aula, integrado a serviços de inteligência artificial, servindo também como portfólio de desenvolvimento.

O projeto inclui um vídeo demonstrativo de curta duração que detalha o funcionamento prático da aplicação e as etapas de seu desenvolvimento.

**Acesse o deploy da aplicação:** [https://hub-recursos.onrender.com](https://hub-recursos.onrender.com)

## Especificações Técnicas

### Frontend
- Framework: React + Vite
- Biblioteca de Ícones: Lucide-React
- Notificações: React-hot-toast
- Testes: Vitest e React Testing Library

### Backend
- Ambiente de Execução: Node.js + Express
- Validação de Dados: Express-validator
- Testes: Vitest e Supertest

### Banco de Dados
- Sistema Gerenciador: PostgreSQL

### DevOps
- Conteinerização: Docker e Docker Compose, estruturados através de perfis 'profiles' isolados para desenvolvimento e testes.

## Documentação da API

A especificação completa dos endpoints da API foi desenvolvida utilizando a especificação OpenAPI e está publicada através do SwaggerHub.

**Acesse a documentação:** [https://app.swaggerhub.com/apis-docs/cin-5a0/HubRecursos/1.0.0?view=uiDocs#/](https://app.swaggerhub.com/apis-docs/cin-5a0/HubRecursos/1.0.0?view=uiDocs#/)

## Esquema do Banco de Dados

<img width="296" height="441" alt="image" src="https://github.com/user-attachments/assets/1b175c9b-db1b-413e-87ce-c07c276fbd61" />


## Suíte de Testes

A aplicação conta com uma cobertura de testes automatizados tanto no ecossistema do backend quanto no frontend, garantindo a integridade das renderizações e dos contratos da API. É altamente recomendável executar os testes utilizando o perfil de testes do Docker, que provisiona um banco de dados temporário e efêmero, evitando impactos no ambiente de desenvolvimento.

### Testes de Frontend
- Escopo: Validação do componentes LessonPlanCard, LessonPlanForm e LessonPlanFull, cobrindo renderização correta, tratamento de erros de interface e simulação de chamadas de API por meio de mocks.
- Volume: 10 casos de teste implementados.

### Testes de Backend
- Escopo: Validação dos endpoints de manipulação de planos de aula e da integração com a API do Gemini. Cobre o tratamento de entradas por meio de sanitizações e fluxos de sucesso e exceção.
- Volume: 8 casos de teste implementados.

## Execução do Projeto

O gerenciamento do ambiente é realizado via Docker Compose, permitindo a inicialização completa do ecossistema com comandos unificados.

### Pré-requisitos
Antes de iniciar, configure os arquivos de variáveis de ambiente na raiz do projeto, caso deseje usar Docker, ou 
configure dois arquivos .env, um no frontend e outro no backend, tomando como base o arquivo '.env.example'.

### Opção 1: Execução via Docker (Recomendado)
Para iniciar o ambiente de desenvolvimento:

```cmd
docker-compose --profile dev up
```

O frontend estará disponível na porta 3000 e o backend disponível na porta 5000

Para executar a suíte de testes em um ambiente isolado:

```cmd
docker-compose --profile test up
```

### Opção 2: Execução Local via node e npm
Instale as dependências em ambas as pastas compartilhadas ('frontend' e 'backend'):
```cmd
npm install
```

Inicialize o servidor de desenvolvimento do backend:

```cmd
node index.js
```

Inicialize o servidor de desenvolvimento do frontend:

```cmd
npm run dev
```

O frontend estará disponível na porta 5173 e o backend estará disponível na porta 5000

## Diferenciais Implementados

- **DevOps e Observabilidade:** Implementação de logs estruturados em todas as requisições, capturando fluxos de validação de dados, processamento e tratamento de exceções.
- **Conteinerização:** Isolamento completo de ambientes utilizando múltiplos perfis no Docker Compose.
- **Testes de Software:** Automação de testes em camadas distintas do ecossistema.
- **Deploy:** Ambientes de produção configurados e disponíveis via Render.

## Pontos de Melhoria Contínua

- Expansão da camada de testes utilizando ferramentas E2E com Cypress.
- Implementação de um módulo de autenticação e controle de acesso para restrição de recursos.
- Ampliação da cobertura de testes unitários e de integração na camada do frontend.

---

**Desenvolvido por ElissonXD**
