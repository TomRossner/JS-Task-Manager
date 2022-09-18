const TasksManager = new Task();
renderTasks();
const addBtn = document.getElementById("addButton");
const checkButtons = document.querySelectorAll(".btn.check");
const removeButtons = document.querySelectorAll(".remove");
const inputText = document.getElementById("taskInput").value;
const tasksContainer = document.getElementById("tasksContainer");
const tasksList = TasksManager.getTasks();
const errorContainer = document.getElementById("errors");
const minimumCharacters = 3;
const maximumCharacters = 25;
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
})


// Functions
function isValid(event){
    const input = document.getElementById("taskInput");
    if(event.key === "Enter" && input.value.length > 2 && input.value.length <= 25){
        console.log(input.value.length);
        createTask();
        errorContainer.style.opacity = 0;
        return;
    }
    if(event.key === "Enter" && input.value.length >= 1 || event.key === "Enter" && input.value === ""){
        errorContainer.innerHTML = `Task must contain at least ${minimumCharacters} characters.`;
        errorContainer.style.opacity = 1;
    }
    if(event.key === "Enter" && input.value.length > 25){
        errorContainer.innerHTML = `Task must not exceed ${maximumCharacters} characters.`;
        errorContainer.style.opacity = 1;
    }


    if(event.type === "click" && input.value.length > 2 && input.value.length <= 25){
        console.log(input.value.length);
        createTask();
        errorContainer.style.opacity = 0;
        return;
    }
    if(event.type === "click" && input.value.length >= 1 || event.type === "click" && input.value === ""){
        errorContainer.innerHTML = `Task must contain at least ${minimumCharacters} characters.`;
        errorContainer.style.opacity = 1;
    }
    if(event.type === "click" && input.value.length > 25){
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
        return "completed"
    }
    if(!task.isCompleted){
        return "task";
    }
}

function updateCompletionBtn(button){
    const currentTask = (button.closest(".task"));
    if(!currentTask.classList.contains("completed")){
        currentTask.classList.add("completed")
        TasksManager.updateCompletion(TasksManager.getTasks().find(task => task.task === currentTask.innerText), true)
        return;
    }else {
        currentTask.classList.remove("completed");
        TasksManager.updateCompletion(TasksManager.getTasks().find(task => task.task === currentTask.innerText), false);
        return;
    }
}

function renderTasks(){
    const tasksContainer = document.getElementById("tasksContainer");
    const tasksList = TasksManager.getTasks();
    let html = "";
    for(let task of tasksList){
        html += `<div class="task ${isComplete(task)}" data-id="${TasksManager.getTasks().indexOf(task)}">${task.task}<div class="icons"><button class="btn check">${checkIcons(task)}<button class="btn remove"><span><i class="bi bi-trash3"></i></span></button></div></div>`;
    }
    tasksContainer.innerHTML += html;
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
    const inputText = document.getElementById("taskInput").value;
    let newTask = document.createElement("div");
    newTask.className = "task";
    newTask.innerHTML = `${inputText}<div class="icons"><button class="btn check">${checkIcons(newTask)}<button class="btn remove"><span><i class="bi bi-trash3"></i></span></button></div></div>`;
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