class Task{
    constructor(text){
        this.task = text,
        this.isCompleted = false,
        this.dateCreated = new Date().toLocaleString();
    }
}

class TaskManager{
    tasks = [];
    id = this.tasks.length + 1;
    constructor() {
        this.load();
    }

    load() {
        if(localStorage.getItem("tasks")) {
          this.tasks = JSON.parse(localStorage.getItem("tasks"));
        }
        
    }

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    add(text){
        const task = new Task(text)
        this.tasks.push(task);
        this.save();
    }
    deleteTask(index){
        this.tasks.splice(Number(index), 1);
        this.save();
    }

    updateCompletion(task, state){
        if(state === true){
            task.isCompleted = true;
            this.save();
            return;
        }
        if(state === false){
            task.isCompleted = false;
            console.log(task);
            this.save();
            return;
        }
        this.save();
    }

    getTasks(){
        return this.tasks;
    }
}