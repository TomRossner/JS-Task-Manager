class Task{
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
        // console.log(localStorage)
    }

    add(text){
        if (typeof text !== "string" || text.length < 2) {
            throw new Error(`Task must be at least ${minimumCharacters} characters`);
        }
        const task = {
            task: text,
            isCompleted: false,
            dateCreated: new Date,
        };
        this.tasks.push(task);
        console.log(this.tasks)
        this.save();
    }
    deleteTask(index){
        this.tasks.splice(Number(index), 1);
        this.save();
    }

    updateCompletion(task, state){
        if(state === true){
            task.isCompleted = true;
            console.log(task);
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