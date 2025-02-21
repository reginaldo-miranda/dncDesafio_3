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
    
    // Conta apenas as tarefas concluídas
    const doneTasks = tasks.filter(task => task.done).length;
    tasksProgress.textContent = `${doneTasks} concluídas`;
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
            
            const tasks = getTasksFromLocalStorage();
            const updatedTasks = tasks.map(t => 
                t.id === task.id ? { ...t, done: !t.done } : t
            );
            setTasksInLocalStorage(updatedTasks);
            renderTasksProgressData(updatedTasks);
        }
    };

    buttonContainer.appendChild(removeTaskButton);

    toDo.id = task.id;
    
    const descriptionElement = document.createElement('span');
    descriptionElement.className = 'task-description';
    descriptionElement.textContent = task.description;
    // Create container for description and etiqueta
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';
    
    // Add description
    contentContainer.appendChild(descriptionElement);
    
    // Add etiqueta if exists
    if (task.etiqueta) {
        const etiquetaElement = document.createElement('span');
        etiquetaElement.className = 'task-etiqueta';
        etiquetaElement.textContent = task.etiqueta;
        contentContainer.appendChild(etiquetaElement);
        
        const dateElement = document.createElement('span');
        const dateOnly = task.createdAt.split(',')[0]; // Remove the time part
        dateElement.textContent = `Criado em: ${dateOnly}`;
        dateElement.style.fontSize = '1.2rem';
        dateElement.style.color = '#666';
        dateElement.style.marginTop = '0.3rem';
        contentContainer.appendChild(dateElement);
    }

    // Add content container and button container to the task
    toDo.appendChild(contentContainer);
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
            done: false,
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
                button.innerHTML = '✓';
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
