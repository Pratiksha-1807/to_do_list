let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');


function addTask(text) {
  text = text.trim();

  if (text === '') {
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  render();

  taskInput.value = '';
}


function toggleTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].completed = !tasks[i].completed;
      break;
    }
  }

  saveTasks();
  render();
}



function deleteTask(id) {
  let newTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== id) {
      newTasks.push(tasks[i]);
    }
  }

  tasks = newTasks;

  saveTasks();
  render();
}


function clearCompleted() {
  let newTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed === false) {
      newTasks.push(tasks[i]);
    }
  }

  tasks = newTasks;

  saveTasks();
  render();
}


function setFilter(filter) {
  currentFilter = filter;

  for (let i = 0; i < filterButtons.length; i++) {
    if (filterButtons[i].dataset.filter === filter) {
      filterButtons[i].classList.add('active');
    } else {
      filterButtons[i].classList.remove('active');
    }
  }

  render();
}


function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(function(task) {
      return task.completed === false;
    });
  }

  if (currentFilter === 'completed') {
    return tasks.filter(function(task) {
      return task.completed === true;
    });
  }

  return tasks;
}



function render() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement('li');

    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = 'No tasks here.';

    taskList.appendChild(emptyMessage);
  } 
  else {
    for (let i = 0; i < filteredTasks.length; i++) {
      const task = filteredTasks[i];

      const li = document.createElement('li');

      li.className = 'task-item';

      if (task.completed === true) {
        li.classList.add('completed');
      }

      li.dataset.id = task.id;

      const checkbox = document.createElement('span');
      checkbox.className = 'checkbox';

      if (task.completed === true) {
        checkbox.textContent = '✓';
      }

      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task.text;

      const deleteButton = document.createElement('span');
      deleteButton.className = 'delete-btn';
      deleteButton.textContent = '🗑';

      li.appendChild(checkbox);
      li.appendChild(taskText);
      li.appendChild(deleteButton);

      taskList.appendChild(li);
    }
  }

  let remaining = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed === false) {
      remaining++;
    }
  }

  taskCount.textContent = remaining + ' of ' + tasks.length + ' remaining';
}


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


addBtn.addEventListener('click', function() {
  addTask(taskInput.value);
});


taskInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    addTask(taskInput.value);
  }
});

taskList.addEventListener('click', function(e) {

  let item = e.target.parentElement;

  if (!item.classList.contains('task-item')) {
    return;
  }

  let id = Number(item.dataset.id);

  if (e.target.classList.contains('checkbox')) {
    toggleTask(id);
  }

  if (e.target.classList.contains('delete-btn')) {
    deleteTask(id);
  }
});

for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', function() {
    setFilter(filterButtons[i].dataset.filter);
  });
}

clearCompletedBtn.addEventListener('click', function() {
  clearCompleted();
});

render();
