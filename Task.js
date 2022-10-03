class Task{
    constructor(text){
        this.id = TasksManager.getTasks().length + 1;
        this.task = text,
        this.isCompleted = false;
    }
}

class TaskManager{
    tasks = [];
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
        const task = new Task(text);
        this.tasks.push(task);
        this.save();
    }

    remove(id){
        this.tasks.splice(Number(id), 1);
        this.save();
    }


    updateStatus(task){
        task.isCompleted = !task.isCompleted;
        this.save();
    }

    saveEdit(index, newText, oldText){
        newText.length === 0 ? this.tasks[index].task = oldText : this.tasks[index].task = newText;
        this.save();
    }   

    getTasks(){
        return this.tasks;
    }
}