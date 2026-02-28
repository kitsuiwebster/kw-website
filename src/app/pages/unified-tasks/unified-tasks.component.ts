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

interface HistoryDayGroup {
  dayKey: string;
  dayLabel: string;
  tasks: Task[];
}

interface LabelSlice {
  id: string;
  name: string;
  color: string;
  count: number;
  percent: number;
}

interface PieSegment {
  d: string;
  color: string;
  tooltip: string;
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
  showHistory: boolean = false;
  
  // Modal pour les actions de tâche
  showTaskModal: boolean = false;
  selectedTask: Task | null = null;

  // Renaming state
  isRenaming: boolean = false;
  renameText: string = '';

  // Label editor
  showLabelEditor: boolean = false;
  editingLabels: Label[] = [];

  // Filters
  filterLabel: string = '';
  showFilterRow: boolean = false;

  // Order/Sort
  showOrderModal: boolean = false;
  sortOrder: 'default' | 'alphabetical' | 'newest' | 'oldest' = 'default';

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
    this.loadLabelsFromStorage();

    // Check for hash fragment in URL
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'bubble' || fragment === 'kitsui') {
        this.activeTab = fragment as TaskType;
        this.showHistory = false;
      } else if (fragment === 'bubble-history') {
        this.activeTab = 'bubble';
        this.showHistory = true;
      } else if (fragment === 'kitsui-history') {
        this.activeTab = 'kitsui';
        this.showHistory = true;
      }
    });

    this.selectedLabel = this.defaultLabel;
    setTimeout(() => {
      this.loadTasks();
    }, 100);
  }

  private loadLabelsFromStorage(): void {
    const kitsui = localStorage.getItem('kitsui-labels');
    const bubble = localStorage.getItem('bubble-labels');
    if (kitsui) this.kitsuiLabels = JSON.parse(kitsui);
    if (bubble) this.bubbleLabels = JSON.parse(bubble);
  }

  openLabelEditor(): void {
    this.editingLabels = this.currentLabels.map(l => ({ ...l }));
    this.showLabelEditor = true;
  }

  closeLabelEditor(): void {
    this.showLabelEditor = false;
    this.editingLabels = [];
  }

  updateEditingHex(index: number, value: string): void {
    const clean = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    this.editingLabels[index] = { ...this.editingLabels[index], color: '#' + clean };
  }

  addEditingLabel(): void {
    this.editingLabels.push({ id: 'label-' + Date.now(), name: 'new', color: '#888888' });
  }

  deleteEditingLabel(index: number): void {
    this.editingLabels.splice(index, 1);
  }

  saveLabelChanges(): void {
    const saved = this.editingLabels.map(l => ({ ...l }));
    if (this.activeTab === 'kitsui') {
      this.kitsuiLabels = saved;
      localStorage.setItem('kitsui-labels', JSON.stringify(saved));
    } else {
      this.bubbleLabels = saved;
      localStorage.setItem('bubble-labels', JSON.stringify(saved));
    }
    this.closeLabelEditor();
  }

  get currentLabels(): Label[] {
    return this.activeTab === 'kitsui' ? this.kitsuiLabels : this.bubbleLabels;
  }

  get defaultLabel(): string {
    return this.activeTab === 'bubble' ? 'random' : 'other';
  }

  private sortFn(a: Task, b: Task): number {
    // First: completed tasks always go to bottom
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    // Second: priority tasks always go to top (if both not completed)
    if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;

    // Third: apply selected sort order
    switch (this.sortOrder) {
      case 'alphabetical':
        return a.text.localeCompare(b.text);
      case 'newest':
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      case 'oldest':
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      case 'default':
      default:
        return 0;
    }
  }

  get sortedTasks(): Task[] {
    return this.tasks.filter(task => {
      if (task.isToday) return false;
      if (task.completed) return false;
      if (this.filterLabel && task.label !== this.filterLabel) return false;
      return true;
    }).sort((a, b) => this.sortFn(a, b));
  }

  get sortedTasksTotal(): number {
    return this.tasks.filter(t => !t.isToday && !t.completed).length;
  }

  get todayTasks(): Task[] {
    return this.tasks.filter(task => {
      if (!task.isToday) return false;
      if (task.completed) return false;
      if (this.filterLabel && task.label !== this.filterLabel) return false;
      return true;
    }).sort((a, b) => this.sortFn(a, b));
  }

  get todayTasksTotal(): number {
    return this.tasks.filter(t => t.isToday && !t.completed).length;
  }

  get allTasksTotalCount(): number {
    return this.sortedTasks.length;
  }

  get todayTotalCount(): number {
    return this.todayTasks.length;
  }

  get allTasksLabelSlices(): LabelSlice[] {
    return this.buildLabelSlices(this.sortedTasks);
  }

  get todayLabelSlices(): LabelSlice[] {
    return this.buildLabelSlices(this.todayTasks);
  }

  toggleFilterLabel(labelId: string): void {
    this.filterLabel = this.filterLabel === labelId ? '' : labelId;
  }

  switchTab(tab: TaskType): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.showHistory = false;
      this.selectedLabel = this.defaultLabel;
      this.newTaskText = '';
      this.filterLabel = '';
      this.showFilterRow = false;
      this.closeTaskModal();
      
      // Update URL hash fragment
      this.router.navigate([], { 
        fragment: this.getCurrentFragment(tab, this.showHistory),
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
        const rawTasks = Array.isArray(tasks) ? tasks : [];
        
        // Remove duplicates et initialiser les propriétés front-end
        const taskMap = new Map();
        rawTasks.forEach(task => {
          const now = new Date().toISOString();
          const taskWithDefaults = {
            ...task,
            isPriority: task.isPriority || false,
            createdAt: task.createdAt || now,
            modifiedAt: task.modifiedAt || task.createdAt || now,
            completedAt: task.completedAt || undefined
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
        console.warn('API unavailable, using localStorage:', error);
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
        next: (savedTask) => {
          // Update local task id with the one assigned by the backend
          const index = this.tasks.findIndex(t => t.id === newTask.id);
          if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...savedTask };
          }
          this.saveToLocalStorage();
        },
        error: (error) => {
          console.warn('Could not sync to API:', error);
          this.error = 'API unavailable - local storage only';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  toggleTask(task: Task): void {
    task.completed = !task.completed;
    const now = new Date().toISOString();
    task.modifiedAt = now;
    if (task.completed && !task.completedAt) {
      task.completedAt = now;
    }
    
    if (task.completed && task.isToday) {
      task.isToday = false;
    }
    
    this.saveToLocalStorage();
    
    this.unifiedTasksService.updateTask(task, this.activeTab).subscribe({
      error: (error) => {
        console.warn('Could not sync to API:', error);
      }
    });
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToLocalStorage();
    
    this.unifiedTasksService.deleteTask(id, this.activeTab).subscribe({
      error: (error) => {
        console.warn('Could not sync to API:', error);
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
        error: (error) => {
          console.warn('Could not sync to API:', error);
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
        error: (error) => {
          console.warn('Could not sync to API:', error);
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

  getTextColorForLabel(labelId: string): string {
    const color = this.getLabelColor(labelId);
    return this.getContrastColor(color);
  }

  private getContrastColor(hexColor: string): string {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance (WCAG formula)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    // Lower threshold (0.45) makes it more sensitive to light colors
    return luminance > 0.45 ? '#000000' : '#ffffff';
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

  // Order modal methods
  openOrderModal(): void {
    this.showOrderModal = true;
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
  }

  selectSortOrder(order: 'default' | 'alphabetical' | 'newest' | 'oldest'): void {
    this.sortOrder = order;
    this.closeOrderModal();
  }

  getSortOrderLabel(): string {
    switch (this.sortOrder) {
      case 'alphabetical': return 'A-Z';
      case 'newest': return 'Newest';
      case 'oldest': return 'Oldest';
      case 'default': return 'Default';
      default: return 'Default';
    }
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    this.syncFragment();
  }

  showTasksView(): void {
    this.showHistory = false;
    this.syncFragment();
  }

  private syncFragment(): void {
    this.router.navigate([], {
      fragment: this.getCurrentFragment(this.activeTab, this.showHistory),
      relativeTo: this.route,
      replaceUrl: true
    });
  }

  private getCurrentFragment(tab: TaskType, history: boolean): string {
    return history ? `${tab}-history` : tab;
  }

  get completedHistoryGroups(): HistoryDayGroup[] {
    const now = new Date().toISOString();
    const completedTasks = this.tasks
      .filter((task) => {
        if (!task.completed) return false;
        if (this.filterLabel && task.label !== this.filterLabel) return false;
        return true;
      })
      .slice()
      .sort((a, b) => {
        const bDate = b.completedAt || b.modifiedAt || b.createdAt || '';
        const aDate = a.completedAt || a.modifiedAt || a.createdAt || '';
        return bDate.localeCompare(aDate);
      });

    const grouped = new Map<string, Task[]>();
    completedTasks.forEach((task) => {
      const dateValue = task.completedAt || task.modifiedAt || task.createdAt || now;
      const dayKey = dateValue.slice(0, 10);
      const existing = grouped.get(dayKey) || [];
      existing.push(task);
      grouped.set(dayKey, existing);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([dayKey, tasks]) => ({
        dayKey,
        dayLabel: this.formatHistoryDay(dayKey),
        tasks
      }));
  }

  formatHistoryTime(task: Task): string {
    const dateValue = task.completedAt || task.modifiedAt || task.createdAt;
    if (!dateValue) return '';

    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return '';

    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(parsed);
  }

  private formatHistoryDay(dayKey: string): string {
    const parsed = new Date(`${dayKey}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return dayKey;

    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(parsed);
  }

  getPieSegments(slices: LabelSlice[]): PieSegment[] {
    if (slices.length === 0) return [];

    const center = 53;
    const radius = 52;
    let currentAngle = -90;

    return slices.map((slice) => {
      const sliceAngle = (slice.percent / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const start = this.polarToCartesian(center, center, radius, startAngle);
      const end = this.polarToCartesian(center, center, radius, endAngle);
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      const d = [
        `M ${center} ${center}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        'Z'
      ].join(' ');

      return {
        d,
        color: slice.color,
        tooltip: `${slice.name}: ${slice.count} task${slice.count > 1 ? 's' : ''}`
      };
    });
  }

  private buildLabelSlices(tasks: Task[]): LabelSlice[] {
    if (tasks.length === 0) return [];

    const countMap = new Map<string, number>();
    tasks.forEach((task) => {
      const labelId = task.label || this.defaultLabel;
      countMap.set(labelId, (countMap.get(labelId) || 0) + 1);
    });

    return Array.from(countMap.entries())
      .map(([labelId, count]) => ({
        id: labelId,
        name: this.getLabelName(labelId),
        color: this.getLabelColor(labelId),
        count,
        percent: (count / tasks.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }
}
