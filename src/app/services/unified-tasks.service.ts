import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  isToday?: boolean;
  label?: string;
  isPriority?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  completedAt?: string;
}

export type TaskType = 'kitsui' | 'bubble';

@Injectable({
  providedIn: 'root'
})
export class UnifiedTasksService {
  private readonly BASE_URL = environment.apiUrl;
  private http = inject(HttpClient);

  getTasks(taskType: TaskType): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.BASE_URL}/tasks`, {
      params: { type: taskType }
    });
  }

  addTask(task: Task, taskType: TaskType): Observable<Task> {
    return this.http.post<Task>(`${this.BASE_URL}/tasks`, {
      text: task.text,
      completed: task.completed,
      isToday: task.isToday ?? false,
      label: task.label ?? null,
      isPriority: task.isPriority ?? false,
      createdAt: task.createdAt,
      modifiedAt: task.modifiedAt,
      completedAt: task.completedAt ?? null
    }, {
      params: { type: taskType }
    });
  }

  updateTask(task: Task, taskType: TaskType): Observable<Task> {
    return this.http.patch<Task>(`${this.BASE_URL}/tasks/${task.id}`, {
      text: task.text,
      completed: task.completed,
      isToday: task.isToday ?? false,
      label: task.label ?? null,
      isPriority: task.isPriority ?? false,
      modifiedAt: task.modifiedAt,
      completedAt: task.completedAt ?? null
    }, {
      params: { type: taskType }
    });
  }

  deleteTask(id: number, taskType: TaskType): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/tasks/${id}`, {
      params: { type: taskType }
    });
  }
}
