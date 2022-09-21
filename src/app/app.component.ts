import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Todo } from './interfaces/Todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form!: FormGroup<{
    description: FormControl<string | null>;
  }>;

  title = 'ToDo List';

  todoList: Todo[] = [];

  mode!: 'create' | 'list';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadTodos();
    this.buildForm();
    this.setMode();
  }

  enterSubmit(event: KeyboardEvent): void {
    const enterKeyPressed = event.key === 'Enter';

    if (!enterKeyPressed) {
      return;
    }

    if (this.mode === 'create') {
      this.onAddTodo();
      this.onToggleMode();
      return;
    }
  }

  onToggleMode(): void {
    if (this.mode === 'create') {
      this.mode = 'list';
      return;
    }
    this.mode = 'create';
    this.form.reset();
  }

  onToggleDoneTask(todo: Todo): void {
    todo.done = !todo.done;

    this.onSaveTodos();
  }

  onAddTodo(): void {
    if (this.form.invalid) {
      return;
    }

    const inputValue = this.form.controls['description']?.value;
    const id = this.todoList.length;

    this.todoList.unshift(new Todo(id, inputValue!, false));
    this.onSaveTodos();
    this.form.reset();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      description: this.fb.control('', Validators.required),
    });
  }

  private setMode(): void {
    if (this.todoList.length) {
      this.mode = 'list';
      return;
    }
    this.mode = 'create';
  }

  private onSaveTodos(): void {
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  onClearLocalStorage(): void {
    localStorage.removeItem('todoList');
    location.reload();
  }

  // onDeleteTodo(todos: Todo[], id: number): void {
  //   const index = todos.findIndex((t) => t.id === id);

  //   todos.splice(index, 1);
  //   this.onSaveTodos();
  // }

  loadTodos(): void {
    if (!localStorage['todoList']) {
      return;
    }

    this.todoList = JSON.parse(localStorage.getItem('todoList')!);
  }
}
