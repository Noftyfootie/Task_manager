class Task {
  constructor(title, description, priority, dueDate) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = false;
  }

  toggleStatus() {
    this.completed = !this.completed;
  }
}
class TaskManager {
  #tasks = [];

  addTask(task) {
    this.#tasks.push(task);
    return this;
  }

  deleteTask(id) {
    this.#tasks = this.#tasks.filter(task => task.id !== id);
    return this;
  }

  toggleTask(id) {
    const task = this.#tasks.find(t => t.id === id);
    if (task) task.toggleStatus();
    return this;
  }

  getTasks() {
    return this.#tasks;
  }
}

const manager = new TaskManager();

const titleInput = document.getElementById('title');
const taskDescription = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

function updateUI(filteredTasks = null) {
  const tasksToRender = filteredTasks || manager.getTasks();
  renderTasks(tasksToRender);
  updateCounters();
}

// Render
function renderTasks(tasks) {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <span>
        <strong>${task.title}</strong><br>
        ${task.description}<br>
        (${task.priority}) - ${task.dueDate}
      </span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const description = taskDescription.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;

  if (!title) return alert('Task title is required');
  if (!description) return alert('Task description is required');
  if (!dueDate) return alert('Please select a due date');

  const task = new Task(title, description, priority, dueDate);

  manager.addTask(task);

  updateUI();
  saveToLocalStorage();

  titleInput.value = '';
  taskDescription.value = '';
  dueDateInput.value = '';
});

function deleteTask(id) {
  manager.deleteTask(id);
  updateUI();
  saveToLocalStorage();
}

function toggleTask(id) {
  manager.toggleTask(id);
  updateUI();
  saveToLocalStorage();
}

const filterButtons = document.querySelectorAll('.filters button');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    let tasks;

    if (filter === 'completed') {
      tasks = manager.getTasks().filter(task => task.completed);
    } else if (filter === 'pending') {
      tasks = manager.getTasks().filter(task => !task.completed);
    } else {
      tasks = manager.getTasks();
    }

    updateUI(tasks);
  });
});

function updateCounters() {
  const tasks = manager.getTasks();

  document.getElementById('allCount').textContent = tasks.length;
  document.getElementById('completedCount').textContent = tasks.filter(
    t => t.completed,
  ).length;
  document.getElementById('pendingCount').textContent = tasks.filter(
    t => !t.completed,
  ).length;
}

// Local Storage
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(manager.getTasks()));
}

function loadFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  savedTasks.forEach(taskData => {
    const task = new Task(
      taskData.title,
      taskData.description,
      taskData.priority,
      taskData.dueDate,
    );

    task.completed = taskData.completed;
    task.id = taskData.id;

    manager.addTask(task);
  });

  updateUI();
}
loadFromLocalStorage();

console.log('recipe');
console.log(challenge);
