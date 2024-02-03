import { Component } from '@angular/core';

import { TodoCommentsComponent } from './todo-comments/todo-comments.component';
import { BaseTablePageComponent } from '@app/common/classes/base-table-page.component';
import { ToDo } from './todo';
import { PageResult } from '@app/common/classes/page-result';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCommentsComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent extends BaseTablePageComponent<ToDo> {
  getPage(): Observable<PageResult<ToDo>> {
    return this.api.get('todo');
  }
}
