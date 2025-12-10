import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnifiedTasksService, Task, TaskType } from '../../services/unified-tasks.service';

export interface Label {
  id: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-unified-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unified-tasks.component.html',
  styleUrls: ['./unified-tasks.component.scss']
})
export class UnifiedTasksComponent implements OnInit {
  tasks: Task[] = [];
  newTaskText: string = '';
  selectedLabel: string = '';
  nextId: number = 1;
  isLoading: boolean = false;
  error: string = '';
  
  // Tab management
  activeTab: TaskType = 'kitsui';
  
  // Modal pour les actions de tâche
  showTaskModal: boolean = false;
  selectedTask: Task | null = null;
  
  // Renaming state
  isRenaming: boolean = false;
  renameText: string = '';

  // Labels par type
  kitsuiLabels: Label[] = [
    { id: 'madpoof', name: 'madpoof', color: '#cc0000' },
    { id: 'vcg', name: 'vcg', color: '#4444ff' },
    { id: 'geotrade', name: 'geotrade', color: '#40E0D0' },
    { id: 'cozybot', name: 'cozybot', color: '#FFD700' },
    { id: 'palma', name: 'palma', color: '#18a860' },
    { id: 'bashroom', name: 'bashroom', color: '#00acc1' },
    { id: 'life', name: 'life', color: '#8e24aa' },
    { id: 'ynov', name: 'ynov', color: '#2d5016' },
    { id: 'foenix', name: 'foenix', color: '#e91e63' },
    { id: 'other', name: 'other', color: '#888888' }
  ];

  bubbleLabels: Label[] = [
    { id: 'solnor', name: 'solnor', color: '#18a860' },
    { id: 'philmar', name: 'philmar', color: '#ff8a15' },
    { id: 'maïa', name: 'maïa', color: '#8e24aa' },
    { id: 'bubble', name: 'bubble', color: '#00acc1' },
    { id: 'random', name: 'random', color: '#888888' }
  ];

  constructor(
    private unifiedTasksService: UnifiedTasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('UnifiedTasksComponent ngOnInit called');
    
    // Check for hash fragment in URL
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'bubble' || fragment === 'kitsui') {
        this.activeTab = fragment as TaskType;
      }
    });
    
    this.selectedLabel = this.defaultLabel;
    setTimeout(() => {
      this.loadTasks();
    }, 100);
  }

  get currentLabels(): Label[] {
    return this.activeTab === 'kitsui' ? this.kitsuiLabels : this.bubbleLabels;
  }

  get defaultLabel(): string {
    return this.activeTab === 'bubble' ? 'random' : 'other';
  }

  get sortedTasks(): Task[] {
    return this.tasks.filter(task => !task.isToday).sort((a, b) => {
      // First sort by completed status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by priority (pinned tasks on top)
      if (a.isPriority !== b.isPriority) {
        return a.isPriority ? -1 : 1;
      }
      return 0;
    });
  }

  get todayTasks(): Task[] {
    return this.tasks.filter(task => task.isToday).sort((a, b) => {
      // First sort by completed status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by priority (pinned tasks on top)
      if (a.isPriority !== b.isPriority) {
        return a.isPriority ? -1 : 1;
      }
      return 0;
    });
  }

  switchTab(tab: TaskType): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.selectedLabel = this.defaultLabel;
      this.newTaskText = '';
      this.closeTaskModal();
      
      // Update URL hash fragment
      this.router.navigate([], { 
        fragment: tab, 
        relativeTo: this.route,
        replaceUrl: true 
      });
      
      this.loadTasks();
    }
  }

  private loadTasks(): void {
    this.isLoading = true;
    this.error = '';

    this.unifiedTasksService.getTasks(this.activeTab).subscribe({
      next: (tasks) => {
        console.log('Loaded tasks from Google Sheets:', tasks);
        
        const rawTasks = Array.isArray(tasks) ? tasks : [];
        
        // Remove duplicates et initialiser les propriétés front-end
        const taskMap = new Map();
        rawTasks.forEach(task => {
          const now = new Date().toISOString();
          const taskWithDefaults = {
            ...task,
            isPriority: task.isPriority || false,
            createdAt: task.createdAt || now,
            modifiedAt: task.modifiedAt || task.createdAt || now
          };
          taskMap.set(task.id, taskWithDefaults);
        });
        this.tasks = Array.from(taskMap.values());
        
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
    try {
      const storageKey = `${this.activeTab}-tasks-app-data`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.tasks = data.tasks || [];
        this.nextId = data.nextId || 1;
      } else {
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
      const storageKey = `${this.activeTab}-tasks-app-data`;
      const data = {
        tasks: this.tasks,
        nextId: this.nextId
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
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
        label: this.selectedLabel,
        isPriority: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };
      
      this.tasks.push(newTask);
      this.newTaskText = '';
      this.selectedLabel = this.defaultLabel;
      this.saveToLocalStorage();
      
      this.unifiedTasksService.addTask(newTask, this.activeTab).subscribe({
        next: (response) => {
          if (response && !response.success) {
            this.error = 'Google Sheets error: ' + (response.error || 'Function not defined');
            setTimeout(() => this.error = '', 5000);
          }
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
          this.error = 'Google Sheets unavailable - local storage only';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  toggleTask(task: Task): void {
    task.completed = !task.completed;
    task.modifiedAt = new Date().toISOString();
    
    if (task.completed && task.isToday) {
      task.isToday = false;
    }
    
    this.saveToLocalStorage();
    
    this.unifiedTasksService.updateTask(task, this.activeTab).subscribe({
      next: (response) => {
        if (response && !response.success) {
          this.error = 'Google Sheets error: ' + (response.error || 'Update failed');
          setTimeout(() => this.error = '', 5000);
        }
      },
      error: (error) => {
        console.warn('Could not sync to Google Sheets:', error);
      }
    });
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToLocalStorage();
    
    this.unifiedTasksService.deleteTask(id, this.activeTab).subscribe({
      next: (response) => {
        console.log('Task deleted:', response);
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
      task.modifiedAt = new Date().toISOString();
      this.saveToLocalStorage();
      
      this.unifiedTasksService.updateTask(task, this.activeTab).subscribe({
        next: (response) => {
          console.log('Task moved to today:', response);
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
      task.modifiedAt = new Date().toISOString();
      this.saveToLocalStorage();
      
      this.unifiedTasksService.updateTask(task, this.activeTab).subscribe({
        next: (response) => {
          console.log('Task moved back to tasks:', response);
        },
        error: (error) => {
          console.warn('Could not sync to Google Sheets:', error);
        }
      });
    }
  }

  getLabelColor(labelId: string): string {
    const label = this.currentLabels.find(l => l.id === labelId);
    return label ? label.color : '#888888';
  }

  getLabelName(labelId: string): string {
    const label = this.currentLabels.find(l => l.id === labelId);
    return label ? label.name : this.defaultLabel;
  }

  // Modal pour les actions de tâche
  openTaskModal(task: Task): void {
    this.selectedTask = task;
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
    this.cancelRename();
  }

  // Actions de la modal
  startRename(): void {
    if (this.selectedTask) {
      this.renameText = this.selectedTask.text;
      this.isRenaming = true;
      // Focus the input after the view updates
      setTimeout(() => {
        const input = document.querySelector('.rename-input') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 50);
    }
  }
  
  cancelRename(): void {
    this.isRenaming = false;
    this.renameText = '';
  }
  
  saveRename(): void {
    if (this.selectedTask && this.renameText.trim()) {
      this.selectedTask.text = this.renameText.trim();
      this.selectedTask.modifiedAt = new Date().toISOString();
      this.saveToLocalStorage();
      
      this.unifiedTasksService.updateTask(this.selectedTask, this.activeTab).subscribe({
        next: (response) => {
          if (response && !response.success) {
            this.error = 'Sync error: ' + (response.error || 'Error');
            setTimeout(() => this.error = '', 5000);
          }
        },
        error: (error) => {
          console.warn('Could not sync:', error);
        }
      });
      
      this.isRenaming = false;
      this.renameText = '';
    }
  }
  
  onRenameKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveRename();
    } else if (event.key === 'Escape') {
      this.cancelRename();
    }
  }

  toggleTaskPriority(): void {
    if (this.selectedTask) {
      this.selectedTask.isPriority = !this.selectedTask.isPriority;
      this.selectedTask.modifiedAt = new Date().toISOString();
      this.saveToLocalStorage();
      
      this.unifiedTasksService.updateTask(this.selectedTask, this.activeTab).subscribe({
        next: (response) => {
          if (response && !response.success) {
            this.error = 'Sync error: ' + (response.error || 'Error');
            setTimeout(() => this.error = '', 5000);
          }
        },
        error: (error) => {
          console.warn('Could not sync:', error);
        }
      });
    }
    this.closeTaskModal();
  }

  deleteTaskFromModal(): void {
    if (this.selectedTask) {
      this.deleteTask(this.selectedTask.id);
    }
    this.closeTaskModal();
  }
}