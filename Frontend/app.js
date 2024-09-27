// frontend/app.js

const API_URL = 'http://localhost:5000/tasks';

document.addEventListener('DOMContentLoaded', () => {
  const tasksList = document.getElementById('tasks-list');
  const addTaskButton = document.getElementById('add-task-button');
  const newTaskInput = document.getElementById('new-task-input');

  // Função para buscar e exibir todas as tarefas
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      renderTasks(data.tasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  // Função para renderizar as tarefas na lista
  const renderTasks = (tasks) => {
    tasksList.innerHTML = ''; // Limpar lista existente
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      if (task.completed) {
        li.classList.add('completed');
      }

      const span = document.createElement('span');
      span.className = 'task-title';
      span.textContent = task.title;

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'task-actions';

      // Botão para completar/descompletar tarefa
      const toggleButton = document.createElement('button');
      toggleButton.textContent = task.completed ? 'Desmarcar' : 'Completar';
      toggleButton.addEventListener('click', () => toggleTaskCompletion(task));

      // Botão para deletar tarefa
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Deletar';
      deleteButton.addEventListener('click', () => deleteTask(task.id));

      actionsDiv.appendChild(toggleButton);
      actionsDiv.appendChild(deleteButton);

      li.appendChild(span);
      li.appendChild(actionsDiv);

      tasksList.appendChild(li);
    });
  };

  // Função para adicionar uma nova tarefa
  const addTask = async () => {
    const title = newTaskInput.value.trim();
    if (title === '') {
      alert('Por favor, insira uma tarefa.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if (response.ok) {
        newTaskInput.value = '';
        fetchTasks();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  // Função para alternar o status de conclusão da tarefa
  const toggleTaskCompletion = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });

      if (response.ok) {
        fetchTasks();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  // Função para deletar uma tarefa
  const deleteTask = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchTasks();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  // Eventos
  addTaskButton.addEventListener('click', addTask);
  newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  // Inicializar lista de tarefas
  fetchTasks();
});
