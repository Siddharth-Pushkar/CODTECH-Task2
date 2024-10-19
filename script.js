// Element references
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('new-task');
const taskDateInput = document.getElementById('task-date');
const addTaskButton = document.getElementById('add-task');
const clearCacheButton = document.getElementById('clear-cache');
const progressBarFill = document.querySelector('.progress-bar-fill');
const notification = document.getElementById('notification');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Load data from local storage
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    loadDarkModeSetting();
    updateProgressBar();
});

// Function to show notifications
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.style.backgroundColor = type === 'success' ? '#4caf50' : '#f44336';
    notification.style.opacity = '1';
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

// Add new task
addTaskButton.addEventListener('click', () => addTask());

function addTask(taskText = null, dueDate = null, priority = 'low') {
    taskText = taskText || taskInput.value.trim();
    dueDate = dueDate || taskDateInput.value;

    if (taskText === '') {
        showNotification('Please enter a task!', 'error');
        return;
    }

    const li = document.createElement('li');
    li.className = `task-item ${priority}-priority`;
    li.innerHTML = `
        <span class="task-text">${taskText} <small>${dueDate ? `Due: ${dueDate}` : ''}</small></span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);
    taskInput.value = '';
    taskDateInput.value = '';

    saveTaskToStorage(taskText, dueDate, priority);

    li.querySelector('.delete-btn').addEventListener('click', () => {
        taskList.removeChild(li);
        removeTaskFromStorage(taskText);
        updateProgressBar();
        showNotification('Task deleted.');
    });

    li.querySelector('.edit-btn').addEventListener('click', () => editTask(li, taskText, dueDate, priority));

    updateProgressBar();
    showNotification('Task added.');
}

// Editing a task
function editTask(taskItem, oldTaskText, oldDueDate, oldPriority) {
    taskInput.value = oldTaskText;
    taskDateInput.value = oldDueDate;
    taskList.removeChild(taskItem);
    removeTaskFromStorage(oldTaskText);
    updateProgressBar();
    showNotification('Edit the task and click "Add Task" to save changes.');
}

// Save, load, and remove tasks from local storage
function saveTaskToStorage(taskText, dueDate, priority) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, date: dueDate, priority });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ text, date, priority }) => addTask(text, date, priority));
}

function removeTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear local storage
clearCacheButton.addEventListener('click', () => {
    localStorage.clear();
    taskList.innerHTML = '';
    updateProgressBar();
    showNotification('Cache cleared.');
});

// Update progress bar
function updateProgressBar() {
    const tasks = document.querySelectorAll('.task-item');
    const totalTasks = tasks.length;
    const completedTasks = totalTasks; // Modify if task completion tracking is added
    const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressBarFill.style.width = `${progressPercent}%`;
}

// Dark mode toggle
darkModeToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    document.querySelector('.container').classList.toggle('dark-mode', e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
});

function loadDarkModeSetting() {
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    darkModeToggle.checked = isDarkMode;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.container').classList.add('dark-mode');
    }
}
