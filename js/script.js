// Get DOM elements
const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const filterInput = document.getElementById('filter-input');
const todoTableBody = document.querySelector('#todo-list tbody');
const clearAllBtn = document.getElementById('clear-all-btn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to display tasks
function displayTasks(filter = '') {
    todoTableBody.innerHTML = '';
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(filter.toLowerCase())
    ).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort only by date (earliest first)
    
    filteredTasks.forEach((task) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="${task.completed ? 'completed' : ''}">${task.text}</td>
            <td>${new Date(task.date).toLocaleDateString()}</td>
            <td><input type="checkbox" class="status-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}></td>
            <td><button class="delete-btn" data-id="${task.id}">Delete</button></td>
        `;
        todoTableBody.appendChild(row);
    });
}

// Add task event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;
    
    if (taskText && taskDate) {
        const newTask = { id: Date.now(), text: taskText, date: taskDate, completed: false };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        dateInput.value = '';
        displayTasks();
    }
});

// Toggle filter input visibility
filterToggleBtn.addEventListener('click', () => {
    const isVisible = filterInput.style.display === 'block';
    filterInput.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        filterInput.focus(); // Focus on input when shown
    } else {
        filterInput.value = ''; // Clear filter when hidden
        displayTasks(); // Reset display
    }
});

// Filter tasks event (only when input is visible)
filterInput.addEventListener('input', (e) => {
    displayTasks(e.target.value);
});

// Handle status toggle (using 'change' event for checkboxes)
todoTableBody.addEventListener('change', (e) => {
    if (e.target.classList.contains('status-checkbox')) {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks[taskIndex].completed = e.target.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks(filterInput.value);
    }
});

// Handle delete (using 'click' event for buttons)
todoTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks(filterInput.value);
    }
});

// Clear all tasks event
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
        tasks = [];
        localStorage.removeItem('tasks');
        displayTasks();
    }
});

// Initial display
displayTasks();