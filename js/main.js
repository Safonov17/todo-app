const form = document.querySelector('#form')
const input = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
let tasks = []

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach(task => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

function addTask(event) {
	event.preventDefault()

	const inputText = input.value

	const newTask = {
		id: Date.now(),
		text: inputText,
		done: false
	}

	tasks.push(newTask)
	saveToLocalStorage()

	renderTask(newTask)

	input.value = ''
	input.focus()

	checkEmptyList()
}

function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return

	parentEl = event.target.closest('li')

	// Находим индекс задачи, которую хотим удалить
	const index = tasks.findIndex(task => {
		const id = +parentEl.id
		return task.id === id
	})

	// Удаляем задачу из массива
	tasks.splice(index, 1)
	saveToLocalStorage()

	// Удаляем задачу из разметки
	parentEl.remove()

	checkEmptyList()
}

function doneTask(event) {
	if (event.target.dataset.action !== 'done') return

	const parentEl = event.target.closest('li')
	const task = tasks.find(task => {
		const id = +parentEl.id
		return task.id === id
	})

	// Меняем в массиве данных статус задачи
	task.done = !task.done
	saveToLocalStorage()

	// Отображаем статус задачи в разметке
	parentEl.querySelector('.task-title').classList.toggle('task-title--done')
}

function checkEmptyList() {
	if (tasks.length < 1) {
		const templateMarkup = `
			<div class="card mb-4">
				<div id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
					<div class="empty-list__title">Список пуст</div>
				</div>
			</div>
		`
		tasksList.insertAdjacentHTML('afterbegin', templateMarkup)
	} else {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title--done' : 'task-title'

	const taskTemplate = `
		<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
			<span class="${cssClass}">${task.text}</span>
			<div class="task-item__buttons">
				<button type="button" data-action="done" class="btn-action">
					<img src="./img/tick.svg" alt="Done" width="18" height="18">
				</button>
				<button type="button" data-action="delete" class="btn-action">
					<img src="./img/cross.svg" alt="Done" width="18" height="18">
				</button>
			</div>
		</li>
	`

	tasksList.insertAdjacentHTML('beforeend', taskTemplate)
}
