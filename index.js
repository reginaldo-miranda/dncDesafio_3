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
    tasksProgress.textContent = `${doneTasks} concluidas`
 //   tasksProgress.textContent = `${totalTasks} concluidas`
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
    removeTaskButton.className = 'concluir-btn';
    removeTaskButton.ariaLabel = 'Concluir tarefa';
    removeTaskButton.textContent = 'Concluir';
    removeTaskButton.style.display = 'flex';
    removeTaskButton.style.alignItems = 'center';
    removeTaskButton.style.justifyContent = 'center';




    removeTaskButton.onclick = () => {
        const taskElement = document.getElementById(task.id);
        if (taskElement) {
            taskElement.classList.toggle('task-concluida');
            removeTaskButton.classList.toggle('concluido');
            // Remove text content when toggling to concluido state
            if (removeTaskButton.classList.contains('concluido')) {
                removeTaskButton.innerHTML = '✓';
                removeTaskButton.style.fontSize = '1.5rem';
                removeTaskButton.style.fontWeight = 'bold';
            } else {
                removeTaskButton.textContent = 'Concluir';
                removeTaskButton.style.fontSize = '1.4rem';
                removeTaskButton.style.fontWeight = 'normal';
            }



            const description = taskElement.querySelector('.task-description');
            if (description) {
                description.classList.toggle('text-taxado');
            }
            // Update task status in localStorage
            const tasks = getTasksFromLocalStorage();
            const updatedTasks = tasks.map(t => 
                t.id === task.id ? { ...t, done: !t.done } : t
            );
            setTasksInLocalStorage(updatedTasks);
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
        const taskElement = createTaskListItem(task);
        if (task.done) {
            taskElement.classList.add('task-concluida');
            const button = taskElement.querySelector('.concluir-btn');

            if (button) {
                button.classList.add('concluido');
                button.innerHTML = '✓'; // Add checkmark when in concluido state
                button.style.fontSize = '1.5rem';
                button.style.fontWeight = 'bold';



            }
            const description = taskElement.querySelector('.task-description');
            if (description) {
                description.classList.add('text-taxado');
            }
        }
    })

    renderTasksProgressData(tasks)
}
