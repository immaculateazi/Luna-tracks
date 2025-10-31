const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const taskCounter = document.getElementById('taskCounter');

// --- Add Task ---
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <i class="fa-solid fa-trash delete-icon"></i>
    `;

    attachTaskEvents(li);
    taskList.appendChild(li);

    taskInput.value = "";
    saveData();
    updateTaskCounter();
}

// --- Edit Task ---
function editTask(textElement) {
    const originalText = textElement.textContent;
    textElement.dataset.originalText = originalText;

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
    input.className = "edit-input";

    textElement.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveEdit(input, textElement);
    });

    input.addEventListener("blur", () => {
        saveEdit(input, textElement);
    });
}

function saveEdit(input, textElement) {
    const newText = input.value.trim();
    textElement.textContent = newText || textElement.dataset.originalText;
    input.replaceWith(textElement);
    saveData();
}

// --- Attach Events ---
function attachTaskEvents(li) {
    const deleteIcon = li.querySelector(".delete-icon");
    const taskTextElement = li.querySelector(".task-text");

    // Mark complete
    li.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete-icon")) {
            li.classList.toggle("completed");
            saveData();
            updateTaskCounter();
        }
    });

    // Delete task
    deleteIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        li.classList.add("fade-out");
        setTimeout(() => {
            li.remove();
            saveData();
            updateTaskCounter();
        }, 400);
    });

    // Edit task
    taskTextElement.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        editTask(taskTextElement);
    });
}

// --- Local Storage ---
function saveData() {
    localStorage.setItem("tasks", taskList.innerHTML);
}

function showTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        taskList.innerHTML = savedTasks;
        taskList.querySelectorAll("li").forEach(attachTaskEvents);
    }
    updateTaskCounter();
}

// --- Counter ---
function updateTaskCounter() {
    const remaining = [...taskList.querySelectorAll("li:not(.completed)")].length;
    taskCounter.textContent = remaining;
}

// --- Clear All Tasks ---
clearCompletedBtn.addEventListener("click", () => {
    if (taskList.children.length === 0) {
        return alert("No tasks to clear!");
    }

    if (!confirm("Are you sure you want to clear ALL tasks?")) return;

    taskList.querySelectorAll("li").forEach(li => {
        li.classList.add("fade-out");
        setTimeout(() => {
            li.remove();
            saveData();
            updateTaskCounter();
        }, 300);
    });
});
// --- Add Listeners ---
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

// --- Load Tasks ---
showTasks();
const dropdownItems = document.querySelectorAll(".dropdown");

dropdownItems.forEach(drop => {
    drop.addEventListener("click", function(e) {
        e.stopPropagation(); // prevents closing instantly
        this.classList.toggle("active");
    });
});

// Close dropdown when clicking outside
document.addEventListener("click", () => {
    dropdownItems.forEach(drop => drop.classList.remove("active"));
});
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navmenudropdownItems = document.querySelectorAll(".dropdown");

// Toggle mobile nav
hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // ← prevent immediate close
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const clickInsideNav = navMenu.contains(e.target) || hamburger.contains(e.target);
    if (!clickInsideNav) {
        navMenu.classList.remove('active');
        dropdownItems.forEach(d => d.classList.remove("active"));
    }
});