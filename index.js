


const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const taskDisplay = document.getElementById("taskDisplay");
const year = document.getElementById("year");
const dark = document.getElementById("dark");
const sunMode = document.getElementById("sun");
const moonMode = document.getElementById("moon");
const date = new Date();
let mydate = date.toDateString();

// Function to save tasks to local storage
function saveToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to get tasks from local storage
function getFromLocalStorage() {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

// Function to display tasks
function displayTasks() {
    const tasks = getFromLocalStorage();
    taskDisplay.innerHTML = ""; // Clear current tasks

    tasks.forEach((task) => {
        addTaskToDOM(task.title, task.description, task.date, task.completed);
    });
}

// Function to add a task to the DOM
function addTaskToDOM(title, description, taskDate, completed = false) {
    let task = document.createElement("div");
    task.classList.add("task");

    let textContent = document.createElement("div");
    textContent.classList.add("texts");

    let titlePane = document.createElement("div");
    titlePane.classList.add("active");
    titlePane.textContent = title;

    let descriptionPane = document.createElement("div");
    descriptionPane.textContent = description;

    if (completed) {
        titlePane.classList.add("display");
        descriptionPane.classList.add("display");
    }

    textContent.appendChild(titlePane);
    textContent.appendChild(descriptionPane);

    let dates = document.createElement("div");
    dates.classList.add("dates");
    dates.textContent = taskDate;

    let buttons = document.createElement("div");
    buttons.classList.add("buttons");

    let completeButton = document.createElement("div");
    completeButton.classList.add("complete");
    completeButton.textContent = "Complete";
    completeButton.onclick = function () {
        titlePane.classList.toggle("display");
        descriptionPane.classList.toggle("display");

        // Update local storage
        const tasks = getFromLocalStorage();
        const index = tasks.findIndex((t) => t.title === title && t.description === description);
        if (index > -1) {
            tasks[index].completed = !tasks[index].completed;
            saveToLocalStorage(tasks);
        }
    };

    let deleteButton = document.createElement("div");
    deleteButton.classList.add("delete");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        task.remove();

        // Update local storage
        const tasks = getFromLocalStorage();
        const updatedTasks = tasks.filter((t) => !(t.title === title && t.description === description));
        saveToLocalStorage(updatedTasks);
    };

    buttons.appendChild(completeButton);
    buttons.appendChild(deleteButton);

    task.appendChild(textContent);
    task.appendChild(dates);
    task.appendChild(buttons);

    taskDisplay.appendChild(task);
}

// Function to add a task
function addTask() {
    let title = titleInput.value.trim();
    let description = descriptionInput.value.trim();
    let caseUp = description.charAt(0).toUpperCase() + description.slice(1);

    if (title === "" || description === "") {
        alert("Please fill in all fields");
    } else {
        // Get the current time dynamically
        let currentTime = new Date().toLocaleTimeString();
        let taskDate = `${mydate} ${currentTime}`;

        // Save to local storage
        const tasks = getFromLocalStorage();
        tasks.push({
            title: title,
            description: caseUp,
            date: taskDate,
            completed: false,
        });
        saveToLocalStorage(tasks);

        // Add to DOM
        addTaskToDOM(title, caseUp, taskDate);

        titleInput.value = "";
        descriptionInput.value = "";
    }
}

// Function to save mode to local storage
function saveModeToLocalStorage(mode) {
    localStorage.setItem("mode", mode);
}

// Function to get the current mode from local storage
function getModeFromLocalStorage() {
    return localStorage.getItem("mode");
}

// Dark mode toggle function
function darkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");

    // Check the current mode and save to local storage
    if (body.classList.contains("dark-mode")) {
        sunMode.style.display = "block";
        moonMode.style.display = "none";
        saveModeToLocalStorage("dark");
    } else {
        sunMode.style.display = "none";
        moonMode.style.display = "block";
        saveModeToLocalStorage("light");
    }
}

// Apply the saved mode on page load
document.addEventListener("DOMContentLoaded", function () {
    const savedMode = getModeFromLocalStorage();

    if (savedMode === "dark") {
        document.body.classList.add("dark-mode");
        sunMode.style.display = "block";
        moonMode.style.display = "none";
    } else {
        document.body.classList.remove("dark-mode");
        sunMode.style.display = "none";
        moonMode.style.display = "block";
    }

    // Display the current year
    year.textContent = date.getFullYear();
});


// Load tasks on page load
document.addEventListener("DOMContentLoaded", displayTasks);

