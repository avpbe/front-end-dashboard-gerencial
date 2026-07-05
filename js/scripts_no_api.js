/*
  ======================================================================================
  CONTROLE DE NAVEGAÇÃO DA SPA (SINGLE PAGE APPLICATION)
  ======================================================================================
*/

const showView = (viewId, headerTitle) => {
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.style.display = 'block';
    const titleElement = document.getElementById('header-title');
    if (titleElement) titleElement.textContent = headerTitle;

    // Ações específicas ao mostrar uma view
    if (viewId === 'projects-view') populateEngineersDropdown('projectEngineer');
    if (viewId === 'schedule-view') {
        populateEngineersDropdown('ganttEngineerSelect');
        renderGanttChart(); // Renderiza o gantt vazio ou com seleção anterior
    }
};

/*
  ======================================================================================
  ARMAZENAMENTO LOCAL SIMULADO (localStorage)
  ======================================================================================
*/

const getLocalData = (key, defaultValue) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

let localProjects = getLocalData('localProjects', [
    { nome_projeto: "Projeto Alfa", disciplina: "Estruturas", descricao: "Análise da P-76.", status: "Aberta", engineer: "João da Silva", startDate: "2024-01-15", endDate: "2024-03-20" },
    { nome_projeto: "Projeto Beta", disciplina: "Instalação", descricao: "Dutos de Tupi.", status: "Em Andamento", engineer: "Maria Oliveira", startDate: "2024-02-10", endDate: "2024-05-30" },
    { nome_projeto: "Projeto Delta", disciplina: "Estruturas", descricao: "Conectores.", status: "Aberta", engineer: "João da Silva", startDate: "2024-04-01", endDate: "2024-07-15" }
]);

let localEngineers = getLocalData('localEngineers', [
    { name: "João da Silva", role: "Engenheiro Sênior", discipline: "Estruturas", platformRole: "Admin" },
    { name: "Maria Oliveira", role: "Engenheira Plena", discipline: "Análise de Instalação", platformRole: "Checker" },
    { name: "Carlos Pereira", role: "Engenheiro Júnior", discipline: "Protótipos", platformRole: "Executer" }
]);

/*
  ======================================================================================
  LÓGICA PARA PROJETOS
  ======================================================================================
*/

const renderProjects = (projects = localProjects) => {
    const list = document.getElementById('projects-list');
    if (!list) return;
    list.innerHTML = '';
    projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'col-md-6 mb-4';
        card.innerHTML = `
            <div class="card h-100 project-card">
                <div class="card-body">
                    <button class="btn-close delete-btn" onclick="deleteProject('${proj.nome_projeto}')"></button>
                    <h5 class="card-title">${proj.nome_projeto}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${proj.disciplina}</h6>
                    <p class="card-text">${proj.descricao}</p>
                    <p class="card-text"><small class="text-muted">Engenheiro: ${proj.engineer || 'Não atribuído'}</small></p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <small class="text-muted">Status: ${proj.status}</small>
                    <small class="text-muted">${new Date(proj.startDate).toLocaleDateString()} - ${new Date(proj.endDate).toLocaleDateString()}</small>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
};

const addProject = (projectName, discipline, description, engineer, startDate, endDate) => {
    if (new Date(startDate) >= new Date(endDate)) {
        alert("Erro: A data de fim deve ser posterior à data de início.");
        return;
    }
    if (localProjects.some(proj => proj.nome_projeto.toLowerCase() === projectName.toLowerCase())) {
        alert(`Erro: O projeto "${projectName}" já existe.`);
        return;
    }
    const newProject = { nome_projeto: projectName, disciplina, description, engineer, startDate, endDate, status: "Aberta" };
    localProjects.push(newProject);
    setLocalData('localProjects', localProjects);
    alert("Projeto adicionado com sucesso!");
    renderProjects();
};

const deleteProject = (projectName) => {
    if (confirm(`Tem certeza que deseja remover o projeto "${projectName}"?`)) {
        localProjects = localProjects.filter(proj => proj.nome_projeto !== projectName);
        setLocalData('localProjects', localProjects);
        renderProjects();
    }
};

const searchRequest = () => {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const searchTerm = input.value.toLowerCase();
    const filtered = localProjects.filter(proj => proj.nome_projeto.toLowerCase().includes(searchTerm));
    renderProjects(filtered);
};

/*
  ======================================================================================
  LÓGICA PARA CADASTRO DE ENGENHEIROS
  ======================================================================================
*/

const renderEngineers = (engineers = localEngineers) => {
    const list = document.getElementById('engineers-list');
    if (!list) return;
    list.innerHTML = '';
    engineers.forEach(eng => {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        const roleBadge = ((r) => {
            const roles = { 'Admin': 'bg-danger', 'Checker': 'bg-warning text-dark', 'Executer': 'bg-primary' };
            return `<span class="badge ${roles[r] || 'bg-secondary'}">${r}</span>`;
        })(eng.platformRole);
        item.innerHTML = `
            <div>
                <h6 class="mb-0">${eng.name}</h6>
                <small class="text-muted">${eng.role} - ${eng.discipline}</small>
            </div>
            <div>
                ${roleBadge}
                <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteEngineer('${eng.name}')">&times;</button>
            </div>
        `;
        list.appendChild(item);
    });
};

const addEngineer = (name, role, discipline, platformRole) => {
    if (localEngineers.some(eng => eng.name.toLowerCase() === name.toLowerCase())) {
        alert(`Erro: O engenheiro "${name}" já está cadastrado.`);
        return;
    }
    const newEngineer = { name, role, discipline, platformRole };
    localEngineers.push(newEngineer);
    setLocalData('localEngineers', localEngineers);
    alert("Engenheiro cadastrado com sucesso!");
    renderEngineers();
};

const deleteEngineer = (engineerName) => {
    if (confirm(`Tem certeza que deseja remover o engenheiro "${engineerName}"?`)) {
        localEngineers = localEngineers.filter(eng => eng.name !== engineerName);
        setLocalData('localEngineers', localEngineers);
        renderEngineers();
    }
};

const populateEngineersDropdown = (dropdownId) => {
    const select = document.getElementById(dropdownId);
    if (!select) return;
    // Limpa opções antigas, mantendo a primeira ("Selecione...")
    while (select.options.length > 1) {
        select.remove(1);
    }
    localEngineers.forEach(eng => {
        const option = new Option(eng.name, eng.name);
        select.add(option);
    });
};

/*
  ======================================================================================
  LÓGICA PARA CRONOGRAMA (GANTT CHART)
  ======================================================================================
*/

const renderGanttChart = () => {
    const chartContainer = document.getElementById('gantt-chart');
    const timelineHeader = document.getElementById('gantt-timeline-header');
    const title = document.getElementById('gantt-title');
    const selectedEngineer = document.getElementById('ganttEngineerSelect').value;

    if (!chartContainer || !timelineHeader || !title) return;

    chartContainer.innerHTML = '';
    timelineHeader.innerHTML = '';
    title.textContent = selectedEngineer ? `Cronograma de ${selectedEngineer}` : 'Cronograma';

    const projects = localProjects.filter(p => p.engineer === selectedEngineer);
    if (projects.length === 0) {
        chartContainer.innerHTML = `<p class="text-muted p-3">Nenhum projeto encontrado para este engenheiro.</p>`;
        return;
    }

    // Encontrar a data mínima e máxima para a escala do gráfico
    const allDates = projects.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
    const minDate = new Date(Math.min.apply(null, allDates));
    const maxDate = new Date(Math.max.apply(null, allDates));
    minDate.setDate(1); // Começa no dia 1 do primeiro mês
    maxDate.setMonth(maxDate.getMonth() + 1); maxDate.setDate(0); // Termina no último dia do último mês

    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

    // Renderizar cabeçalho de meses
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
        const monthEl = document.createElement('span');
        monthEl.textContent = currentDate.toLocaleString('pt-BR', { month: 'short' });
        timelineHeader.appendChild(monthEl);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Renderizar barras de projetos
    projects.forEach((project, index) => {
        const projStart = new Date(project.startDate);
        const projEnd = new Date(project.endDate);

        const startOffset = (projStart - minDate) / (1000 * 60 * 60 * 24);
        const duration = (projEnd - projStart) / (1000 * 60 * 60 * 24);

        const left = (startOffset / totalDays) * 100;
        const width = (duration / totalDays) * 100;

        const row = document.createElement('div');
        row.className = 'gantt-row';
        row.style.height = '50px';
        row.style.position = 'relative';

        const bar = document.createElement('div');
        bar.className = 'gantt-bar';
        bar.style.left = `${left}%`;
        bar.style.width = `${width}%`;
        bar.textContent = project.nome_projeto;
        bar.title = `${project.nome_projeto} (${projStart.toLocaleDateString()} - ${projEnd.toLocaleDateString()})`;

        row.appendChild(bar);
        chartContainer.appendChild(row);
    });
};

/*
  ======================================================================================
  INICIALIZAÇÃO E LISTENERS DE EVENTOS
  ======================================================================================
*/

const initializeApp = () => {
    // Mostra a tela inicial do dashboard
    showView('dashboard-view', 'Dashboard Principal');

    // Configura o formulário de projetos
    const newProjectForm = document.getElementById('new-project-form');
    if (newProjectForm) {
        renderProjects();
        newProjectForm.addEventListener('submit', function (e) {
            e.preventDefault();
            addProject(
                document.getElementById('projectName').value,
                document.getElementById('discipline').value,
                document.getElementById('description').value,
                document.getElementById('projectEngineer').value,
                document.getElementById('startDate').value,
                document.getElementById('endDate').value
            );
            this.reset();
        });
    }

    // Configura o formulário de engenheiros
    const newEngineerForm = document.getElementById('new-engineer-form');
    if (newEngineerForm) {
        renderEngineers();
        newEngineerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            addEngineer(
                document.getElementById('engineerName').value,
                document.getElementById('engineerRole').value,
                document.getElementById('engineerDiscipline').value,
                document.getElementById('engineerPlatformRole').value
            );
            this.reset();
        });
    }

    // Configura o filtro do Gantt
    const ganttSelect = document.getElementById('ganttEngineerSelect');
    if (ganttSelect) {
        ganttSelect.addEventListener('change', renderGanttChart);
    }
};

document.addEventListener('DOMContentLoaded', initializeApp);