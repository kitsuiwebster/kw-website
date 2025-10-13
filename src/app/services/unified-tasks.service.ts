import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  isToday?: boolean;
  label?: string;
  isPriority?: boolean;
  createdAt?: string;
  modifiedAt?: string;
}

export type TaskType = 'kitsui' | 'bubble';

@Injectable({
  providedIn: 'root'
})
export class UnifiedTasksService {
  private readonly WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxhX69NdfbZ9-2KoI_G5n9jHvfuK_3mna8fITeuIjpBey8REQeyecKGCNrLBh_XQY7X/exec';

  constructor() {}

  // JSONP approach using direct URL
  private makeJSONPRequest(params: any): Observable<any> {
    return new Observable(observer => {
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      
      // Create script element
      const script = document.createElement('script');
      const url = new URL(this.WEB_APP_URL);
      
      // Add parameters
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
      url.searchParams.append('callback', callbackName);
      
      script.src = url.toString();
      
      // Create global callback
      (window as any)[callbackName] = (data: any) => {
        observer.next(data);
        observer.complete();
        document.head.removeChild(script);
        delete (window as any)[callbackName];
      };
      
      // Error handling
      script.onerror = (error) => {
        console.error('JSONP script error:', error);
        observer.error('JSONP request failed: ' + error);
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        delete (window as any)[callbackName];
      };
      
      // Timeout handling
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          console.error('JSONP timeout - callback still exists');
          observer.error('JSONP request timeout');
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
          delete (window as any)[callbackName];
        }
      }, 10000);
      
      document.head.appendChild(script);
    });
  }

  getTasks(taskType: TaskType): Observable<Task[]> {
    console.log(`UnifiedTasksService.getTasks(${taskType}) called`);
    return new Observable(observer => {
      this.makeJSONPRequest({ 
        action: 'getTasks', 
        sheetType: taskType 
      }).subscribe({
        next: (response) => {
          console.log('getTasks response:', response);
          if (response && response.success) {
            console.log('Tasks received:', response.tasks);
            observer.next(response.tasks || []);
          } else {
            console.error('getTasks failed:', response);
            observer.error('Failed to get tasks: ' + (response?.error || 'Unknown error'));
          }
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
          observer.error(error);
        }
      });
    });
  }

  addTask(task: Task, taskType: TaskType): Observable<any> {
    return this.makeJSONPRequest({
      action: 'addTask',
      sheetType: taskType,
      id: task.id.toString(),
      text: task.text,
      completed: task.completed.toString(),
      isToday: (task.isToday || false).toString(),
      label: task.label || (taskType === 'bubble' ? 'random' : 'other'),
      isPriority: (task.isPriority || false).toString(),
      createdAt: task.createdAt || new Date().toISOString(),
      modifiedAt: task.modifiedAt || new Date().toISOString()
    });
  }

  updateTask(task: Task, taskType: TaskType): Observable<any> {
    const params = {
      action: 'updateTask',
      sheetType: taskType,
      id: task.id.toString(),
      text: task.text,
      completed: task.completed.toString(),
      isToday: (task.isToday || false).toString(),
      label: task.label || (taskType === 'bubble' ? 'random' : 'other'),
      isPriority: (task.isPriority || false).toString(),
      createdAt: task.createdAt || new Date().toISOString(),
      modifiedAt: task.modifiedAt || new Date().toISOString()
    };
    console.log('Updating task with params:', params);
    return this.makeJSONPRequest(params);
  }

  deleteTask(id: number, taskType: TaskType): Observable<any> {
    return this.makeJSONPRequest({
      action: 'deleteTask',
      sheetType: taskType,
      id: id.toString()
    });
  }
}