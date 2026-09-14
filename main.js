let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
function addTask(text) {
  const trimmed = text.trim();
  if (trimmed === '') return;
tasks.push({
    id: Date.now(),
    text: trimmed,
    completed: false
  });
saveAndRender();
  taskInput.value = '';
}

function toggleTask(id) {
  const newTasks = [];
for (let task of tasks) {
  if (task.id === id) {
        const updatedTask = {
            ...task,
            completed: !task.completed
        };
        newTasks.push(updatedTask);
        } else {
        newTasks.push(task);
    }
}
tasks = newTasks;
  saveAndRender();
}
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveAndRender();
}

function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  render();
}

function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}


function render() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.className = 'empty-state';
    emptyMsg.textContent = 'No tasks here.';
    taskList.appendChild(emptyMsg);
  } else {
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      li.innerHTML = `
        <span class="checkbox">${task.completed ? '✓' : ''}</span>
        <span class="task-text"></span>
        <span class="delete-btn">🗑</span>
      `;

      
      li.querySelector('.task-text').textContent = task.text;

      taskList.appendChild(li);
    });
  }

  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${remaining} of ${tasks.length} remaining`;
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

addBtn.addEventListener('click', () => {
  addTask(taskInput.value);
});

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask(taskInput.value);
  }
});

taskList.addEventListener('click', (e) => {
  const item = e.target.closest('.task-item');
  if (!item) return;

  const id = Number(item.dataset.id);

  if (e.target.classList.contains('checkbox')) {
    toggleTask(id);
  }

  if (e.target.classList.contains('delete-btn')) {
    deleteTask(id);
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

clearCompletedBtn.addEventListener('click', clearCompleted);
render();
