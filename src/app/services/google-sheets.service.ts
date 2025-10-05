import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

export interface GoogleSheetsTask {
  id: number;
  text: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private readonly WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbysemKrmIhgZCCiYvNTpS0-7nYvQHPAt2sKBKoeRqrq32c6dOLRy0KcGNMsVQ44_gOV/exec';

  constructor() {}

  // JSONP approach to bypass CORS
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
      script.onerror = () => {
        observer.error('JSONP request failed');
        document.head.removeChild(script);
        delete (window as any)[callbackName];
      };
      
      document.head.appendChild(script);
    });
  }

  getTasks(): Observable<any[]> {
    return new Observable(observer => {
      this.makeJSONPRequest({ action: 'getTasks' }).subscribe({
        next: (response) => {
          if (response.success) {
            observer.next(response.tasks || []);
          } else {
            observer.error('Failed to get tasks: ' + response.error);
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

  addTask(task: { id: number, text: string, completed: boolean }): Observable<any> {
    return this.makeJSONPRequest({
      action: 'addTask',
      id: task.id.toString(),
      text: task.text,
      completed: task.completed.toString()
    });
  }

  updateTask(task: { id: number, text: string, completed: boolean }): Observable<any> {
    return this.makeJSONPRequest({
      action: 'updateTask',
      id: task.id.toString(),
      text: task.text,
      completed: task.completed.toString()
    });
  }

  deleteTask(id: number): Observable<any> {
    return this.makeJSONPRequest({
      action: 'deleteTask',
      id: id.toString()
    });
  }
}