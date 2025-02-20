const renderTasksProgressData = (tasks) => {
    let tasksProgress;

    const tasksProgressDOM = document.getElementById('tasks-progress');
    if (tasksProgressDOM) tasksProgress = tasksProgressDOM;
    else {
        const newTasksProgressDOM = document.createElement('div');
        newTasksProgressDOM.id = 'tasks-progress';
        document.getElementById("todo-footer").appendChild(newTasksProgressDOM);
        tasksProgress = newTasksProgressDOM;
    }
    const doneTasks = tasks.filter(({ checked}) => checked).length
    const totalTasks = tasks.length;
    tasksProgress.textContent = `${doneTasks}/${totalTasks} concluidas`
}

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

const markTaskAsDone = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(t => 
        parseInt(t.id) === parseInt(taskId) 
            ? { ...t, done: true }
            : t
    );
    setTasksInLocalStorage(updatedTasks);
}

const createTaskListItem = (task) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');

    const buttonContainer = document.createElement("div");
    buttonContainer.className = 'button-container';

    const removeTaskButton = document.createElement("button");
    removeTaskButton.className = 'remove-task-btn';
    removeTaskButton.ariaLabel = 'Concluir tarefa';
    removeTaskButton.textContent = 'Concluir';


    removeTaskButton.onclick = () => {
        const taskElement = document.getElementById(task.id);
        if (taskElement) {
            taskElement.classList.toggle('task-concluida');
            removeTaskButton.classList.toggle('concluido');
            const description = taskElement.querySelector('.task-description');
            if (description) {
                description.classList.toggle('text-taxado');
            }
        }
    };

    buttonContainer.appendChild(removeTaskButton);

    toDo.id = task.id;
    
    // Adiciona a descrição da tarefa
    const descriptionElement = document.createElement('span');
    descriptionElement.className = 'task-description';
    descriptionElement.textContent = task.description;
    toDo.appendChild(descriptionElement);
    
    // Adiciona a etiqueta à tarefa
    if (task.etiqueta) {
        const etiquetaElement = document.createElement('span');
        etiquetaElement.className = 'task-etiqueta';
        etiquetaElement.textContent = task.etiqueta;
        toDo.appendChild(etiquetaElement);
    }

    toDo.appendChild(buttonContainer);
    list.appendChild(toDo);

    return toDo;
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage()
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const etiqueta = event.target.elements.etiqueta.value;
    const id = getNewTaskId();
    const createdAt = new Date().toLocaleString('pt-BR');
    return {description, etiqueta, id, createdAt};
}

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event))
    },3000)
})

const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled' , true)
    const newTaskData = await getCreatedTaskInfo(event);

    createTaskListItem(newTaskData);
    markTaskAsDone(newTaskData.id);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [
        ...tasks,
        { 
            id: newTaskData.id, 
            description: newTaskData.description,
            etiqueta: newTaskData.etiqueta,
            checked: false,
            createdAt: newTaskData.createdAt
        }
    ]

    setTasksInLocalStorage(updatedTasks)
    renderTasksProgressData(updatedTasks)

    document.getElementById('description').value = ''
    document.getElementById('save-task').removeAttribute('disabled')
} 

window.onload = function() {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);
 
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        createTaskListItem(task);
        if (task.done) {
            const taskElement = document.getElementById(task.id);
            if (taskElement) {
                taskElement.classList.add('task-concluida');
                const button = taskElement.querySelector('.remove-task-btn');
                if (button) {
                    button.classList.add('concluido');
                }
                const description = taskElement.querySelector('.task-description');
                if (description) {
                    description.classList.add('text-taxado');
                }
            }
        }
    })
    renderTasksProgressData(tasks)
}
