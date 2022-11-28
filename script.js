const TasksManager = new TaskManager();
const tasksList = TasksManager.getTasks();
const minimumCharacters = 3;
const maximumCharacters = 30;

// Functions

const isValid = (event) => {
    const input = document.getElementById("taskInput");
    const errorContainer = document.getElementById("errors");

    if(event.key === "Enter" && input.value.length >= minimumCharacters && input.value.length <= maximumCharacters){
        const errorContainer = document.getElementById("errors");
        errorContainer.style.opacity = 0;
        createTask();
        return;
    }
    if(event.key === "Enter" && input.value.length < minimumCharacters && input.value.length >= 1){
        errorContainer.innerHTML = `Task must contain at least ${minimumCharacters} characters.`;
        showError();
        return;
    }
    if(event.key === "Enter" && input.value.length > maximumCharacters){
        errorContainer.innerHTML = `Task must not exceed ${maximumCharacters} characters.`;
        showError();
        return;
    }


    if(event.type === "click" && input.value.length >= minimumCharacters && input.value.length <= maximumCharacters){
        const errorContainer = document.getElementById("errors");
        errorContainer.style.opacity = 0;
        createTask();
        return;
    }
    if(event.type === "click" && input.value.length < minimumCharacters && input.value.length >= 1){
        errorContainer.innerHTML = `Task must contain at least ${minimumCharacters} characters.`;
        showError();
        return;
    }
    if(event.type === "click" && input.value.length > maximumCharacters){
        errorContainer.innerHTML = `Task must not exceed ${maximumCharacters} characters.`;
        showError();
        return;
    }
}
const createTask = () => {
    const tasksContainer = document.getElementById("tasksContainer")
    tasksContainer.innerHTML = "";
    const inputText = document.getElementById("taskInput").value;
    TasksManager.add(inputText);
    displayTitle();
    renderTasks(tasksList);
    clearInput();
    loadEventListeners();   
    enableClearAllBtn();
}
const renderTasks = (list) => {
    if (!list.length) return;
    const tasksContainer = document.getElementById("tasksContainer");
    list.map((element) => {
        const taskDiv = document.createElement("div");
        element.isCompleted ? taskDiv.className = "task completed" : taskDiv.className = "task";
        taskDiv.innerHTML = `<button class="btn check"><span><i class="bi bi-check2"></i></span></button>`;
        taskDiv.setAttribute(`data-id`, `${TasksManager.getTasks().indexOf(element)}`);
        const newTaskInput = document.createElement("input");
        newTaskInput.defaultValue = `${element.task}`;
        newTaskInput.className = "input-text";
        newTaskInput.setAttribute("type", "text");
        newTaskInput.setAttribute("readOnly", true);
        taskDiv.append(newTaskInput);
        taskDiv.innerHTML +=`<div class="icons"><button class="btn edit"><span><i class="bi bi-pencil-fill"></i></span><button class="btn remove"><span><i class="bi bi-trash3"></i></span></button></div></div>`;
        tasksContainer.append(taskDiv);
    })
}
const clearInput = () => {
    const input = document.getElementById("taskInput");
    input.value = "";
    input.focus();
}
const removeTask = (event) => {
    const currentTask = (event.target.closest(".task"));
    const taskID = currentTask.getAttribute("data-id");
    TasksManager.remove(taskID);
    const tasksList = TasksManager.getTasks();
    const tasksContainer = document.getElementById("tasksContainer");
    tasksContainer.innerHTML = "";
    const noTasks = document.createElement("p");
    noTasks.setAttribute("id", "noTasks");
    noTasks.innerHTML = "No tasks to display";
    tasksList.length ? "" : tasksContainer.appendChild(noTasks);
    displayTitle();
    renderTasks(tasksList);
    loadEventListeners();
    enableClearAllBtn();
}
const toggleStatus = (event) => {
    const currentTask = (event.target.closest(".task"));
    const taskInput = currentTask.querySelector(".input-text");
    const taskObj = tasksList.filter((task) => task.task.toLowerCase() === taskInput.value.toLowerCase());
    TasksManager.updateStatus(taskObj[0]);
    taskObj[0].isCompleted ? currentTask.classList.add("completed") : currentTask.classList.remove("completed");
    TasksManager.save();
}
const editTask = (event) => {
    const task = event.target.closest(".task");
    const taskInput = task.getElementsByClassName("input-text")[0];
    taskInput.removeAttribute("readOnly");
    taskInput.focus();
    const TaskInputText = taskInput.value;
    taskInput.value = "";
    taskInput.value = TaskInputText;
    const saveBtn = document.createElement("button");
    saveBtn.className = "save";
    saveBtn.innerText = "Save";
    const currentTaskButtons = task.querySelectorAll(".btn");
    for(button of currentTaskButtons){
        button.style.pointerEvents = "none";
        button.classList.add("disabled");
        button.style.display = "none";
    }
    task.append(saveBtn);
    saveBtn.addEventListener("click", (e) => saveEdit(e, saveBtn, currentTaskButtons));
    document.addEventListener("keydown", (event) => handleSave(event, saveBtn, currentTaskButtons, taskInput))
}
const handleSave = (e, btn, taskButtons, input) => {
    const errorContainer = document.getElementById("errors");
    if(e.key === "Enter" && input.focus){
        saveEdit(e, btn, taskButtons);
        errorContainer.style.opacity = 0;
    }
}
const saveEdit = (event, saveButton, taskButtons) => {
    if (!event.target.closest(".task")) return;
    const taskInput = event.target.closest(".task");
    const taskID = taskInput.dataset.id;
    const newTaskText = taskInput.getElementsByClassName("input-text")[0];
    newTaskText.setAttribute("readOnly", true);
    newTaskText.value.length === 0 ? newTaskText.value = newTaskText.defaultValue : newTaskText.value;
    TasksManager.saveEdit(taskID, newTaskText.value, newTaskText.defaultValue);
    newTaskText.defaultValue = newTaskText.value;
    saveButton.style.display = "none";
    for(button of taskButtons){
        button.style.display = "block";
        button.style.pointerEvents = "all";
        button.classList.remove("disabled");
    }
    document.removeEventListener("keydown", () => handleSave(event, saveBtn, currentTaskButtons, taskInput));
}
const displayTitle = () => {
    const tasksList = TasksManager.getTasks();
    const myTasksTitle = document.getElementById("myTasksTitle");
    const tasksContainer = document.getElementById("tasksContainer");
    tasksContainer.innerHTML = "";
    const noTasks = document.createElement("p");
    noTasks.setAttribute("id", "noTasks");
    noTasks.innerHTML = "No tasks to display";
    tasksContainer.appendChild(noTasks);
    tasksList.length ? myTasksTitle.style.opacity = 1 : myTasksTitle.style.opacity = 0;
    tasksList.length ? noTasks.style.display = "none" : noTasks.style.display = "block";
}
const clearAllTasks = () => {
    const tasksList = TasksManager.getTasks();
    for (let task = 0; task < tasksList.length; task++){
        TasksManager.remove(tasksList.indexOf(tasksList[task]));
    }
    localStorage.clear();
    displayTitle();
    enableClearAllBtn();
    window.location.reload();
}
const enableClearAllBtn = () => {
    const clearAllBtn = document.getElementById("clearTasks");
    tasksList.length ? clearAllBtn.style.display = "block" : clearAllBtn.style.display = "none";
}
const loadEventListeners = () => {
    const addBtn = document.getElementById("addButton");
    addBtn.addEventListener("click", isValid);
    
    document.addEventListener("keydown", (e) => isValid(e));

    const clearAllBtn = document.getElementById("clearTasks");
    clearAllBtn.addEventListener("click", clearAllTasks);

    const removeButtons = document.querySelectorAll(".remove");
    removeButtons.forEach(button => {button.addEventListener("click", (event) => removeTask(event))});

    const checkButtons = document.querySelectorAll(".check");
    checkButtons.forEach(button => {button.addEventListener("click", (event) => toggleStatus(event))});

    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(button => {button.addEventListener("click", (event) => editTask(event))});

    document.addEventListener("load", setFooter);
}
const showError = () => {
    const errorContainer = document.getElementById("errors");
    errorContainer.style.opacity = 1;
    errorContainer.style.transition = "";
    setTimeout(() => {
        errorContainer.style.opacity = 0;
        errorContainer.style.transition = "opacity 0.7s";
    }, 4000);
}
const setFooter = () => {
    const year = new Date().getFullYear();
    const footer = document.getElementsByTagName("footer");
    const footerParagraph = document.createElement("p");
    footerParagraph.innerHTML = `by Tom Rossner&copy; ${year}`;
    footer[0].append(footerParagraph);
}

// Init

setFooter();
displayTitle();
enableClearAllBtn();
renderTasks(tasksList);
loadEventListeners();