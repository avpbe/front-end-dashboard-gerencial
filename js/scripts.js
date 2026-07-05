const API_URL = 'http://127.0.0.1:5000';
  
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de projetos existentes do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getRequests = async () => {
    try {
        const response = await fetch(`${API_URL}/requisicoes`);
        if (!response.ok) {
            throw new Error("Não foi possível carregar os projetos.");
        }
        const data = await response.json();
        const requestsList = document.getElementById('requests-list');
        requestsList.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens
        data.requisicoes.forEach(req => addRequestToTable(req));
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
    }
};
  
/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma requisição na lista de exibição (cria o card)
  --------------------------------------------------------------------------------------
*/
const addRequestToTable = (req) => {
    const requestsList = document.getElementById('requests-list');
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-4 mb-4';
    cardCol.innerHTML = `
        <div class="card h-100 request-card">
            <div class="card-body">
                <button class="btn-close delete-btn" onclick="deleteRequest('${req.nome_projeto}')"></button>
                <h5 class="card-title">${req.nome_projeto}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${req.disciplina}</h6>
                <p class="card-text">${req.descricao}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Status: ${req.status}</small>
            </div>
        </div>
    `;
    requestsList.appendChild(cardCol);
};
  
/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova requisição via requisição POST
  --------------------------------------------------------------------------------------
*/
const postRequest = async (projectName, discipline, description) => {
    const body = {
        nome_projeto: projectName,
        disciplina: discipline,
        descricao: description
    };
  
    try {
        const response = await fetch(`${API_URL}/requisicao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
  
        if (response.ok) {
            alert("Requisição adicionada com sucesso!");
            getRequests(); // Atualiza a lista
        } else {
            const errorData = await response.json();
            alert(`Erro ao adicionar requisição: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao tentar adicionar a requisição.");
    }
};
  
/*
  --------------------------------------------------------------------------------------
  Função para deletar uma requisição da base via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteRequest = async (projectName) => {
    if (confirm(`Tem certeza que deseja remover a requisição "${projectName}"?`)) {
        try {
            const response = await fetch(`${API_URL}/requisicao?nome_projeto=${encodeURIComponent(projectName)}`, {
                method: 'DELETE'
            });
  
            if (response.ok) {
                alert("Requisição removida com sucesso!");
                getRequests(); // Atualiza a lista
            } else {
                const errorData = await response.json();
                alert(`Erro ao remover requisição: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert("Ocorreu um erro ao tentar remover a requisição.");
        }
    }
};
  
/*
  --------------------------------------------------------------------------------------
  Adiciona um listener para o formulário de nova requisição
  --------------------------------------------------------------------------------------
*/
document.getElementById('new-request-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;
    const discipline = document.getElementById('discipline').value;
    const description = document.getElementById('description').value;
    postRequest(projectName, discipline, description);
    this.reset(); // Limpa o formulário
});
  
// Carrega a lista de projetos ao iniciar a página
document.addEventListener('DOMContentLoaded', getRequests);