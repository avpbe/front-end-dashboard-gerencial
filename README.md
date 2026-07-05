# Frontend - Dashboard de Gerenciamento de Projetos
  
Esta é uma SPA (Single Page Application) desenvolvida para consumir a API de gerenciamento de projetos de engenharia. A aplicação foi construída utilizando apenas **HTML, CSS e JavaScript puro**, com o auxílio do framework de estilo **Bootstrap**.
  
## Funcionalidades
  
- **Dashboard Principal**: Navegação central para as principais seções da aplicação.
- **Gerenciamento de Projetos**:
  - Visualização de todos os projetos em formato de cards.
  - Criação, edição (via modal) e remoção de projetos.
  - Busca dinâmica por nome de projeto com otimização (debounce).
- **Gerenciamento de Equipe**:
  - Visualização da lista de colaboradores cadastrados.
  - Adição, edição (via modal) e remoção de membros da equipe.
- **Cronograma de Projetos**:
  - Visualização em formato de gráfico de Gantt da alocação dos projetos.
  
---
  
## Instruções de Execução
  
### Pré-requisitos

1. A **API backend** deve estar em execução (`http://127.0.0.1:5000`).
2. Um navegador web moderno (Chrome, Firefox, Edge, etc.).
  
### Como Rodar
  
Basta abrir o arquivo `index.html` diretamente no seu navegador. Não é necessário nenhum servidor web, build ou dependência adicional para executar o frontend.