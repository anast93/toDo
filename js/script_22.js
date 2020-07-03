'use strict'

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    addTodo(event) {
        event.preventDefault();
        if(this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.input.value = '';
            this.render();
        } else {
            alert('Пустую запись добавить нельзя!');
            return;
        }
        
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(elem) {
        const text = elem.closest('li').textContent.trim();
  
        this.todoData.forEach((value, key) => {
            if (value.value === text) {
                this.todoData.delete(key);
            }
        });
        this.render();
        // удаляет дело
        // по ключу найти элемент и удалить его из map, сделать render()
    }

    completedItem(elem) {
        const text = elem.closest('li').textContent.trim();

        this.todoData.forEach((value) => {
            if (value.value === text) {
                value.completed = !value.completed;
            }
        });
        this.render();
    }

    handler() {

        const body = document.querySelector('body');

        body.addEventListener('click', (event) => {
            const target = event.target;
            if(target.closest('.todo-remove')) {
                this.deleteItem.bind(this);
                return this.deleteItem(target)
            } else if(target.closest('.todo-complete')) {
                this.completedItem.bind(this);
                return this.completedItem(target)
            }
        });
        // метод определяет, на какую кнопку (корзина или галочка) нажал пользователь
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem);
        this.addToStorage();
    }

    createItem = (todo) => {

        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;

        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
            </div>`);
        
        if(todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    init () {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
todo.handler();