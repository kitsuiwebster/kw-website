import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

export interface BubbleGoogleSheetsTask {
  id: number;
  text: string;
  completed: boolean;
  isToday?: boolean;
  label?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BubbleGoogleSheetsService {
  private readonly WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyms6aM7XCdAzB0SUS6R8wJ2VhfvmOPsIA1NH9zNtU982SNZ4L32NOPEen5xZzE_r4nmw/exec';

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

  getTasks(): Observable<any[]> {
    console.log('BubbleGoogleSheetsService.getTasks() called');
    return new Observable(observer => {
      this.makeJSONPRequest({ action: 'getTasks' }).subscribe({
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

  addTask(task: { id: number, text: string, completed: boolean, isToday?: boolean, label?: string }): Observable<any> {
    return this.makeJSONPRequest({
      action: 'addTask',
      id: task.id.toString(),
      text: task.text,
      completed: task.completed.toString(),
      isToday: (task.isToday || false).toString(),
      label: task.label || 'random'
    });
  }

  updateTask(task: { id: number, text: string, completed: boolean, isToday?: boolean, label?: string }): Observable<any> {
    const params = {
      action: 'updateTask',
      id: task.id.toString(),
      text: task.text,
      completed: task.completed.toString(),
      isToday: (task.isToday || false).toString(),
      label: task.label || 'random'
    };
    console.log('Updating bubble task with params:', params);
    return this.makeJSONPRequest(params);
  }

  deleteTask(id: number): Observable<any> {
    return this.makeJSONPRequest({
      action: 'deleteTask',
      id: id.toString()
    });
  }
}