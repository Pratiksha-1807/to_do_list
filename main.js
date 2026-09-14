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


