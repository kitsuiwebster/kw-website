import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from '../../services/google-sheets.service';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  isToday?: boolean;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTaskText: string = '';
  nextId: number = 1;
  isLoading: boolean = false;
  error: string = '';

  constructor(private googleSheetsService: GoogleSheetsService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  get sortedTasks(): Task[] {
    return this.tasks.filter(task => !task.isToday).sort((a, b) => {
      if (a.completed === b.completed) {
        return 0;
      }
      return a.completed ? 1 : -1;
    });
  }

  get todayTasks(): Task[] {
    return this.tasks.filter(task => task.isToday).sort((a, b) => {
      if (a.completed === b.completed) {
        return 0;
      }
      return a.completed ? 1 : -1;
    });
  }

  private loadTasks(): void {
    this.isLoading = true;
    this.error = '';

    // Try Google Sheets first
    this.googleSheetsService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Loaded tasks from Google Sheets:', tasks);
        this.tasks = tasks;
        
        if (tasks.length > 0) {
          this.nextId = Math.max(...tasks.map(t => t.id)) + 1;
        } else {
          this.nextId = 1;
        }
        
        this.isLoading = false;
        this.error = '';
        this.saveToLocalStorage();
      },
      error: (error) => {
        console.warn('Google Sheets failed, using localStorage:', error);
        this.loadFromLocalStorage();
        this.error = 'Using offline mode';
        this.isLoading = false;
      }
    });
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('tasks-app-data');
      if (saved) {
        const data = JSON.parse(saved);
        this.tasks = data.tasks || [];
        this.nextId = data.nextId || 1;
      }
    } catch (error) {
      console.warn('Could not load tasks from localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const data = {
        tasks: this.tasks,
        nextId: this.nextId
      };
      localStorage.setItem('tasks-app-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save tasks to localStorage:', error);
    }
  }

  addTask(): void {
    if (this.newTaskText.trim()) {
      const newTask = {
        id: this.nextId++,
        text: this.newTaskText.trim(),
        completed: false,
        isToday: false
      };
      
      // Add to local array and save to localStorage
      this.tasks.push(newTask);
      this.newTaskText = '';
      this.saveToLocalStorage();
      
      // Try to sync to Google Sheets (best effort)
      this.googleSheetsService.addTask(newTask).subscribe({
        next: (response) => {
          console.log('Task synced to Google Sheets:', response);
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
        }
      });
    }
  }

  toggleTask(task: Task): void {
    task.completed = !task.completed;
    
    // Si la tâche est cochée et qu'elle est dans Today, la remettre dans All Tasks
    if (task.completed && task.isToday) {
      task.isToday = false;
    }
    
    this.saveToLocalStorage();
    
    // Try to sync to Google Sheets (best effort)
    this.googleSheetsService.updateTask(task).subscribe({
      next: (response) => {
        console.log('Task synced to Google Sheets:', response);
      },
      error: (error) => {
        console.warn('Could not sync to Google Sheets:', error);
      }
    });
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToLocalStorage();
    
    // Try to sync to Google Sheets (best effort)
    this.googleSheetsService.deleteTask(id).subscribe({
      next: (response) => {
        console.log('Task synced to Google Sheets:', response);
      },
      error: (error) => {
        console.warn('Could not sync to Google Sheets:', error);
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addTask();
    }
  }

  // Drag and Drop methods
  onDragStart(event: DragEvent, task: Task): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id.toString());
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDropToToday(event: DragEvent): void {
    event.preventDefault();
    const taskId = parseInt(event.dataTransfer?.getData('text/plain') || '0');
    const task = this.tasks.find(t => t.id === taskId);
    
    if (task && !task.isToday) {
      task.isToday = true;
      this.saveToLocalStorage();
      
      // Sync to Google Sheets
      this.googleSheetsService.updateTask(task).subscribe({
        next: (response) => {
          console.log('Task moved to today synced to Google Sheets:', response);
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
        }
      });
    }
  }

  onDropToTasks(event: DragEvent): void {
    event.preventDefault();
    const taskId = parseInt(event.dataTransfer?.getData('text/plain') || '0');
    const task = this.tasks.find(t => t.id === taskId);
    
    if (task && task.isToday) {
      task.isToday = false;
      this.saveToLocalStorage();
      
      // Sync to Google Sheets
      this.googleSheetsService.updateTask(task).subscribe({
        next: (response) => {
          console.log('Task moved back to tasks synced to Google Sheets:', response);
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
        }
      });
    }
  }
}