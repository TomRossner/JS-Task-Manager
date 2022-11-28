const TasksManager = new TaskManager();
renderTasks();
const addBtn = document.getElementById("addButton");
const checkButtons = document.querySelectorAll(".btn.check");
const removeButtons = document.querySelectorAll(".remove");
const editButtons = document.querySelectorAll(".btn.edit");
const inputText = document.getElementById("taskInput").value;
const tasksContainer = document.getElementById("tasksContainer");
const tasksList = TasksManager.getTasks();
const errorContainer = document.getElementById("errors");
const minimumCharacters = 3;
const maximumCharacters = 30;
const myTasksTitle = document.getElementById("myTasksTitle");
const noTasks = document.getElementById("noTasks");
const clearAllBtn = document.getElementById("clearTasks");
clearAllBtn.addEventListener("click", clearAllTasks);
enableClearAllBtn();
loadEventListener();
displayTitle();


// Event Listeners
addBtn.addEventListener("click", isValid);
document.addEventListener("keydown", (e) => {isValid(e);})
tasksContainer.addEventListener("click", function (e){
    if(e.target.classList.contains("bi-trash3") || e.target.classList.contains("remove")){
        removeTask(e);
        return;
    }
    if(e.target.classList.contains("edit") || e.target.classList.contains("bi-pencil-fill")){
        editTask(e);
    }
})


// Functions
function isValid(event){
    const input = document.getElementById("taskInput");
    if(event.key === "Enter" && input.value.length >= minimumCharacters && input.value.length <= maximumCharacters){
        createTask();
        errorContainer.style.opacity = 0;
        return;
    }
    if(event.key === "Enter" && input.value.length >= 1 || event.key === "Enter" && input.value === ""){
        errorContainer.innerHTML = `Task must contain at least ${minimumCharacters} characters.`;
        errorContainer.style.opacity = 1;
    }
    if(event.key === "Enter" && input.value.length > maximumCharacters){
        errorContainer.innerHTML = `Task must not exceed ${maximumCharacters} characters.`;
        errorContainer.style.opacity = 1;
    }


    if(event.type === "click" && input.value.length >= minimumCharacters && input.value.length <= maximumCharacters){
        console.log(input.value.length);
        createTask();
        errorContainer.style.opacity = 0;
        return;
    }
    if(event.type === "click" && input.value.length >= 1 || event.type === "click" && input.value === ""){
        errorContainer.innerHTML = `Task must contain at least ${minimumCharacters} characters.`;
        errorContainer.style.opacity = 1;
    }
    if(event.type === "click" && input.value.length > maximumCharacters){
        errorContainer.innerHTML = `Task must not exceed ${maximumCharacters} characters.`;
        errorContainer.style.opacity = 1;
    }
}

function removeTask(event){
    const currentTask = (event.target.closest(".btn").closest(".task"));
    const currentTaskID = Number(currentTask.getAttribute("data-id"));
    TasksManager.deleteTask(currentTaskID)
    TasksManager.save();
    removeTaskFromDOM(currentTask);
    displayTitle();
    enableClearAllBtn();
}

function removeTaskFromDOM(element){
    element.remove();
}

function checkIcons(task){
    if(task.isCompleted){
        return `<span><i class="bi bi-arrow-counterclockwise"></i></span>`;
    }else{
        return `<span><i class="bi bi-check2"></i></span>`;
    }
}

function isComplete(task){
    if(task.isCompleted){
        return "task completed"
    }
    if(!task.isCompleted){
        return "task";
    }
}

function updateCompletionBtn(button){
    const currentTask = (button.closest(".task"));
    const currentTaskInput = currentTask.getElementsByTagName("input")[0];
    if(!currentTask.classList.contains("completed")){
        currentTask.classList.add("completed")
        TasksManager.updateCompletion(TasksManager.getTasks().find(task => task.task === currentTaskInput.value), true)
        return;
    }else {
        currentTask.classList.remove("completed");
        TasksManager.updateCompletion(TasksManager.getTasks().find(task => task.task === currentTaskInput.value), false);
        return;
    }
}

function renderTasks(){
    const tasksContainer = document.getElementById("tasksContainer");
    const tasksList = TasksManager.getTasks();
    for(let task of tasksList){
        let taskDiv = document.createElement("div");
        taskDiv.className = `${isComplete(task)}`;
        taskDiv.setAttribute(`data-id`, `${TasksManager.getTasks().indexOf(task)}`);
        const newTaskInput = document.createElement("input");
        newTaskInput.defaultValue = `${element.task}`;
        newTaskInput.className = "input-text";
        newTaskInput.setAttribute("type", "text");
        newTaskInput.setAttribute("readOnly", true);
        taskDiv.append(newTaskInput);
        taskDiv.innerHTML +=`<div class="icons"><button class="btn edit"><span><i class="bi bi-pencil-fill"></i></span><button class="btn check">${checkIcons(task)}<button class="btn remove"><span><i class="bi bi-trash3"></i></span></button></div></div>`;
        tasksContainer.append(taskDiv);
    })
}

function createTask(){
    const inputText = document.getElementById("taskInput").value;
    TasksManager.add(inputText);
    renderTask();
    clearInput();
    enableClearAllBtn();
}

function renderTask(){
    const tasksContainer = document.getElementById("tasksContainer");
    let inputText = document.getElementById("taskInput").value;
    inputText = inputText.charAt(0).toUpperCase() + inputText.slice(1);
    let newTask = document.createElement("div");
    newTask.className = "task";
    const newTaskInput = document.createElement("input");
    newTaskInput.defaultValue = `${inputText}`;
    newTaskInput.className = "input-text";
    newTaskInput.setAttribute("type", "text");
    newTaskInput.setAttribute("readOnly", "enabled");
    newTask.append(newTaskInput);
    newTask.innerHTML += `<div class="icons"><button class="btn edit"><span><i class="bi bi-pencil-fill"></i></span><button class="btn check">${checkIcons(newTask)}<button class="btn remove"><span><i class="bi bi-trash3"></i></span></button></div></div>`;
    newTask.dataset.id = TasksManager.getTasks().length - 1;
    tasksContainer.append(newTask);
    loadEventListener();
    displayTitle();
}

function clearInput(){
    const input = document.getElementById("taskInput");
    input.value = "";
    input.focus();
}

function enableClearAllBtn(){
    tasksList.length >= 1 ? clearAllBtn.style.display = "block" : clearAllBtn.style.display = "none";
}

function clearAllTasks(){
    const tasksList = TasksManager.getTasks();
    for(let task = 0; task < tasksList.length; task++){
        let taskIndex = tasksList.indexOf(task);
        TasksManager.deleteTask(taskIndex);
        TasksManager.tasks.pop();
        console.log(TasksManager.getTasks());
        const taskInDOM = document.querySelector(".task");
        taskInDOM.remove();
        console.log("removed");
    }
    localStorage.clear();
    enableClearAllBtn();
    displayTitle();
    window.location.reload();
}

function loadEventListener(){
    const checkButtons = document.querySelectorAll(".check");
    checkButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentButton = button.closest(".btn");
            updateCompletionBtn(currentButton);
            if(currentButton.innerHTML.includes(`<i class="bi bi-check2"></i>`)){
                currentButton.innerHTML = `<span><i class="bi bi-arrow-counterclockwise"></i></span>`;
                return;
            }
            if(currentButton.innerHTML.includes(`<i class="bi bi-arrow-counterclockwise"></i>`)){
                currentButton.innerHTML = `<span><i class="bi bi-check2"></i></span>`;
                return;
            }
        })
    })
}

function displayTitle(){
    const tasksList = TasksManager.getTasks();
    tasksList.length === 0 ? myTasksTitle.style.display = "none" : myTasksTitle.style.display = "block";
    tasksList.length === 0 ? noTasks.style.display = "block" : noTasks.style.display = "none";
    noTasks.innerHTML = `No tasks to display`;
}

function editTask(event){
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
    saveBtn.addEventListener("click", (e) => {
        saveEdit(e, saveBtn, currentTaskButtons);
    });
    document.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && taskInput.focus){
            saveEdit(e, saveBtn, currentTaskButtons);
            errorContainer.style.opacity = 0;
        }
    })
}

function saveEdit(event, saveButton, taskButtons){
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

// function alreadyCreated(text){
//     for(let task of tasksList){
//         if(task.task === text){ 
//             errorContainer.style.opacity = 1;
//             errorContainer.innerText = `You already created this task.`;
//             return;
//         }
//     }
// }