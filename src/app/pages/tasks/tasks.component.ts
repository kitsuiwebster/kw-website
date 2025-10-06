import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from '../../services/google-sheets.service';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  isToday?: boolean;
  label?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
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
  selectedLabel: string = 'other';
  nextId: number = 1;
  isLoading: boolean = false;
  error: string = '';

  labels: Label[] = [
    { id: 'madpoof', name: 'madpoof', color: '#cc0000' },
    { id: 'vcg', name: 'vcg', color: '#4444ff' },
    { id: 'pikapi', name: 'pikapi', color: '#ff8800' },
    { id: 'palma', name: 'palma', color: '#18a860' },
    { id: 'bashroom', name: 'bashroom', color: '#00acc1' },
    { id: 'life', name: 'life', color: '#8e24aa' },
    { id: 'other', name: 'other', color: '#888888' }
  ];

  constructor(private googleSheetsService: GoogleSheetsService) {}

  ngOnInit(): void {
    console.log('TasksComponent ngOnInit called');
    // Small delay to ensure page is fully loaded
    setTimeout(() => {
      this.loadTasks();
    }, 100);
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
        console.log('Tasks array length:', tasks ? tasks.length : 'null/undefined');
        console.log('Tasks type:', typeof tasks);
        
        // Ensure tasks is an array
        this.tasks = Array.isArray(tasks) ? tasks : [];
        
        if (this.tasks.length > 0) {
          this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
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
        this.isLoading = false;
      }
    });
  }

  private loadFromLocalStorage(): void {
    console.log('Loading from localStorage...');
    try {
      const saved = localStorage.getItem('tasks-app-data');
      console.log('localStorage data:', saved);
      if (saved) {
        const data = JSON.parse(saved);
        console.log('Parsed localStorage data:', data);
        this.tasks = data.tasks || [];
        this.nextId = data.nextId || 1;
        console.log('Loaded tasks from localStorage:', this.tasks);
      } else {
        console.log('No data in localStorage');
        this.tasks = [];
        this.nextId = 1;
      }
    } catch (error) {
      console.warn('Could not load tasks from localStorage:', error);
      this.tasks = [];
      this.nextId = 1;
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
        isToday: false,
        label: this.selectedLabel
      };
      
      // Add to local array and save to localStorage
      this.tasks.push(newTask);
      this.newTaskText = '';
      this.selectedLabel = 'other'; // Reset to default
      this.saveToLocalStorage();
      
      // Try to sync to Google Sheets (best effort)
      this.googleSheetsService.addTask(newTask).subscribe({
        next: (response) => {
          console.log('Task synced to Google Sheets:', response);
          if (response && !response.success) {
            this.error = 'Erreur Google Sheets: ' + (response.error || 'Fonction non définie');
            setTimeout(() => this.error = '', 5000);
          }
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
          this.error = 'Google Sheets non disponible - sauvegarde locale uniquement';
          setTimeout(() => this.error = '', 5000);
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
    
    console.log('toggleTask - Task before sync:', {
      id: task.id,
      text: task.text,
      completed: task.completed,
      isToday: task.isToday,
      label: task.label
    });
    
    this.saveToLocalStorage();
    
    // Try to sync to Google Sheets (best effort)
    this.googleSheetsService.updateTask(task).subscribe({
      next: (response) => {
        console.log('Task synced to Google Sheets:', response);
        if (response && !response.success) {
          this.error = 'Erreur Google Sheets: ' + (response.error || 'Mise à jour échouée');
          setTimeout(() => this.error = '', 5000);
        }
      },
      error: (error) => {
        console.warn('Could not sync to Google Sheets:', error);
        this.error = 'Google Sheets non disponible - sauvegarde locale uniquement';
        setTimeout(() => this.error = '', 5000);
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
          if (response && !response.success) {
            this.error = 'Erreur Google Sheets: ' + (response.error || 'Déplacement échoué');
            setTimeout(() => this.error = '', 5000);
          }
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
          this.error = 'Google Sheets non disponible - sauvegarde locale uniquement';
          setTimeout(() => this.error = '', 5000);
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
          if (response && !response.success) {
            this.error = 'Erreur Google Sheets: ' + (response.error || 'Déplacement échoué');
            setTimeout(() => this.error = '', 5000);
          }
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
          this.error = 'Google Sheets non disponible - sauvegarde locale uniquement';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  getLabelColor(labelId: string): string {
    const label = this.labels.find(l => l.id === labelId);
    return label ? label.color : '#888888';
  }

  getLabelName(labelId: string): string {
    const label = this.labels.find(l => l.id === labelId);
    return label ? label.name : 'other';
  }
}