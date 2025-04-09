const taskInput = document.getElementById('task-input')
const dateInput = document.getElementById('date-input')
const timeInput = document.getElementById('time-input')
const addTaskButton = document.getElementById('add-task-button')
const taskField = document.getElementById('task-field');
const searchField = document.getElementById('search-field')

// To store the tasks in an array
let allTask = [];

let today = new Date().toISOString().split("T")[0];

// To save the tasks in the local storage
const saveItem = () => {
  if (allTask) {
    localStorage.setItem("tasks", JSON.stringify(allTask));
  }
}

// To load the saved tasks from the local storage
document.addEventListener('DOMContentLoaded', () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    allTask = JSON.parse(storedTasks);
    displayTask();
  }
})

// On click the add task button, clears the input field
const clearInput = () => {
  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
}

const displayTask = (taskToRender = allTask) => {

  // clears the task field on every rerender
  taskField.innerHTML = ''
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('tasks');

  // To filter tasks based on today's date
  const todayTask = taskToRender.filter(task => task.date === today);
  const dueTask = taskToRender.filter(task => task.date < today);
  const upcomingTask = taskToRender.filter(task => task.date > today);

  // Create sections as Due task, today, upcoming task
  const createSection = (title, tasks) => {

    // Section heading
    const sectionHeading = document.createElement('h2');
    sectionHeading.textContent = title;
    sectionHeading.classList.add("task-headers")
    taskField.appendChild(sectionHeading)

    tasks.forEach(task => {
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('tasks');

      const taskDate = document.createElement('h3');
      taskDate.textContent = task.date;

      const taskDesc = document.createElement('span');
      taskDesc.textContent = task.task;

      const taskTime = document.createElement('span');
      taskTime.textContent = task.time;
      taskTime.classList.add("task-time")

      // Edit and Delete Buttons
      const editButton = document.createElement('button');
      editButton.textContent = "Edit";
      editButton.classList.add("edit-button")

      const deleteButton = document.createElement('button');
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-button")

      // On clicking the delete button, the task should removed from the DOM
      deleteButton.addEventListener('click', (event) => {
        const currIndex = taskToRender.indexOf(task)
        taskToRender.splice(currIndex, 1)
        saveItem();
        displayTask();
      })
      saveItem();

      // On clickin the edit button, user should be able to edit the task description 
      editButton.addEventListener('click', () => {
        const currIndex = taskToRender.indexOf(task);
        const currTask = taskToRender[currIndex];
        const input = document.createElement('input');
        taskField.appendChild(input)
        input.type = "text"
        input.autofocus = true;
        input.value = currTask.task;
        input.addEventListener('blur', () => {
          currTask.task = input.value;
          currTask.value = input.value
          input.remove();
          saveItem();
          displayTask();
        })
      })

      const taskButtons = document.createElement('div');
      taskButtons.classList.add("task-buttons")
      taskButtons.appendChild(editButton);
      taskButtons.appendChild(deleteButton);

      const taskWrapper = document.createElement('div');
      taskWrapper.classList.add("task-wrapper")
      taskWrapper.appendChild(taskDesc);
      taskDesc.appendChild(taskTime)
      taskWrapper.appendChild(taskButtons);

      taskDiv.appendChild(taskDate);
      taskDiv.appendChild(taskWrapper);

      taskField.appendChild(taskDiv);
    });
  }

  if(upcomingTask.length > 0) createSection('Upcoming Task', upcomingTask)
  if(todayTask.length > 0) createSection('Today', todayTask)
  if(dueTask.length > 0) createSection('Due Task', dueTask)
}

// To add the inputed task, date, time as an object to the allTask array
const addTask = (task, date, time) => {
  const newTask = {
    task: task,
    date: date,
    time: time
  }
  allTask.push(newTask);
  clearInput();
  saveItem();
}

// Add event listener to the add task button to make it functional
addTaskButton.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const date = dateInput.value.trim();
  const time = timeInput.value.trim();
  if (!task && !date && !time) {
    return;
  }
  addTask(task, date, time);
  displayTask();
})

searchField.addEventListener('keyup', () => {
  let search = searchField.value.trim();
  console.log(search)
  let filteredTasks = [];
  if(!search) return;
  allTask.forEach(tasks => {
    if(tasks.task.includes(search)) {
      filteredTasks.push(tasks);
    }
  })
  console.log(filteredTasks)
  displayTask(filteredTasks);
})

searchField.addEventListener('blur', () => {
  displayTask(allTask);
})