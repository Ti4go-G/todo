const API_BASE_URL = 'http://localhost:3000';
const token = localStorage.getItem('authToken');

if (!token) {
  window.location.href = './login.html';
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
};

const state = {
  tasks: []
};

const messageEl = document.getElementById('dashboard-message');
const pendingGrid = document.getElementById('pending-grid');
const progressGrid = document.getElementById('progress-grid');
const completedGrid = document.getElementById('completed-grid');
const logoutBtn = document.getElementById('logout-btn');
const newTaskBtn = document.getElementById('new-task-btn');

const modalOverlay = document.getElementById('task-modal-overlay');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('task-modal-title');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskStartInput = document.getElementById('task-start');
const taskEndInput = document.getElementById('task-end');
const taskStatusInput = document.getElementById('task-status');
const taskCancelBtn = document.getElementById('task-cancel-btn');

const STATUS_LABEL = {
  pending: 'Pendente',
  'in-progress': 'Em andamento',
  completed: 'Concluida'
};

const showMessage = (message, isError = false) => {
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.style.color = isError ? '#b42318' : '#08623a';
};

const formatDate = (dateValue) => {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  return date.toLocaleString('pt-BR');
};

const toDateTimeLocalValue = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

const buildTaskCard = (task) => {
  return `
    <article class="task-card" data-id="${task._id}">
      <h3>${task.title}</h3>
      <p class="task-description">${task.description}</p>
      <p><strong>Inicio:</strong> ${formatDate(task.start)}</p>
      <p><strong>Termino:</strong> ${formatDate(task.end)}</p>
      <p><strong>Status:</strong> ${STATUS_LABEL[task.status] || task.status}</p>
      <div class="task-actions">
        <button type="button" data-action="edit">Editar</button>
        <button type="button" data-action="status">Alterar status</button>
        <button type="button" data-action="delete" class="danger">Excluir</button>
      </div>
    </article>
  `;
};

const renderTasks = () => {
  const pendingTasks = state.tasks.filter((task) => task.status === 'pending');
  const progressTasks = state.tasks.filter((task) => task.status === 'in-progress');
  const completedTasks = state.tasks.filter((task) => task.status === 'completed');

  pendingGrid.innerHTML = pendingTasks.map(buildTaskCard).join('') || '<p class="empty-message">Nenhuma atividade pendente.</p>';
  progressGrid.innerHTML = progressTasks.map(buildTaskCard).join('') || '<p class="empty-message">Nenhuma atividade em andamento.</p>';
  completedGrid.innerHTML = completedTasks.map(buildTaskCard).join('') || '<p class="empty-message">Nenhuma atividade concluida.</p>';
};

const openModal = (task = null) => {
  modalOverlay.classList.remove('hidden');

  if (task) {
    modalTitle.textContent = 'Editar atividade';
    taskIdInput.value = task._id;
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description;
    taskStartInput.value = toDateTimeLocalValue(task.start);
    taskEndInput.value = toDateTimeLocalValue(task.end);
    taskStatusInput.value = task.status;
    return;
  }

  modalTitle.textContent = 'Nova atividade';
  taskForm.reset();
  taskIdInput.value = '';
  taskStatusInput.value = 'pending';
};

const closeModal = () => {
  modalOverlay.classList.add('hidden');
};

const getTaskById = (taskId) => state.tasks.find((task) => task._id === taskId);

const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`, { headers });
    state.tasks = response.data || [];
    renderTasks();
  } catch (error) {
    const message = error?.response?.data?.message;
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = './login.html';
      return;
    }
    showMessage(message || 'Nao foi possivel carregar as atividades.', true);
  }
};

const createTask = async (payload) => {
  await axios.post(`${API_BASE_URL}/tasks`, payload, { headers });
};

const updateTask = async (id, payload) => {
  await axios.put(`${API_BASE_URL}/tasks/${id}`, payload, { headers });
};

const deleteTask = async (id) => {
  await axios.delete(`${API_BASE_URL}/tasks/${id}`, { headers });
};

const openStatusSelect = (button, task) => {
  const existingSelect = button.parentElement.querySelector('select[data-action="status-select"]');
  if (existingSelect) return;

  const select = document.createElement('select');
  select.setAttribute('data-action', 'status-select');

  Object.entries(STATUS_LABEL).forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });

  select.value = task.status;
  button.replaceWith(select);
  select.focus();

  const restoreButton = () => {
    if (!select.isConnected) return;
    const statusButton = document.createElement('button');
    statusButton.type = 'button';
    statusButton.dataset.action = 'status';
    statusButton.textContent = 'Alterar status';
    select.replaceWith(statusButton);
  };

  select.addEventListener('blur', () => {
    setTimeout(restoreButton, 100);
  });

  select.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') restoreButton();
  });

  select.addEventListener('change', async () => {
    try {
      await updateTask(task._id, {
        title: task.title,
        description: task.description,
        start: task.start,
        end: task.end,
        status: select.value
      });
      showMessage('Status atualizado com sucesso.');
      await fetchTasks();
    } catch (error) {
      const message = error?.response?.data?.message;
      showMessage(message || 'Nao foi possivel atualizar o status.', true);
      restoreButton();
    }
  });
};

const handleTaskAction = async (event) => {
  const actionButton = event.target.closest('button[data-action]');
  if (!actionButton) return;

  const card = actionButton.closest('.task-card');
  if (!card) return;

  const taskId = card.dataset.id;
  const task = getTaskById(taskId);
  if (!task) return;

  try {
    if (actionButton.dataset.action === 'edit') {
      openModal(task);
      return;
    }

    if (actionButton.dataset.action === 'status') {
      openStatusSelect(actionButton, task);
      return;
    }

    if (actionButton.dataset.action === 'delete') {
      const confirmed = window.confirm('Deseja realmente excluir esta atividade?');
      if (!confirmed) return;
      await deleteTask(taskId);
      showMessage('Atividade excluida com sucesso.');
      await fetchTasks();
    }
  } catch (error) {
    const message = error?.response?.data?.message;
    showMessage(message || 'Nao foi possivel concluir a acao.', true);
  }
};

const handleSubmitTaskForm = async (event) => {
  event.preventDefault();

  const id = taskIdInput.value;
  const payload = {
    title: taskTitleInput.value.trim(),
    description: taskDescriptionInput.value.trim(),
    start: new Date(taskStartInput.value).toISOString(),
    end: new Date(taskEndInput.value).toISOString(),
    status: taskStatusInput.value
  };

  if (!payload.title || !payload.description || !taskStartInput.value || !taskEndInput.value) {
    showMessage('Preencha todos os campos da atividade.', true);
    return;
  }

  if (new Date(payload.end) < new Date(payload.start)) {
    showMessage('A data de termino nao pode ser menor que a data de inicio.', true);
    return;
  }

  try {
    if (id) {
      await updateTask(id, payload);
      showMessage('Atividade atualizada com sucesso.');
    } else {
      await createTask(payload);
      showMessage('Atividade criada com sucesso.');
    }

    closeModal();
    await fetchTasks();
  } catch (error) {
    const message = error?.response?.data?.message;
    showMessage(message || 'Nao foi possivel salvar a atividade.', true);
  }
};

logoutBtn?.addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.removeItem('authToken');
  window.location.href = './login.html';
});

newTaskBtn?.addEventListener('click', () => {
  openModal();
});

taskCancelBtn?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModal();
});

taskForm?.addEventListener('submit', handleSubmitTaskForm);
pendingGrid?.addEventListener('click', handleTaskAction);
progressGrid?.addEventListener('click', handleTaskAction);
completedGrid?.addEventListener('click', handleTaskAction);

fetchTasks();
