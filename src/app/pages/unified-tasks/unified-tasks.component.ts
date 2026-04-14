import { Component, OnDestroy, OnInit } from '@angular/core';
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

interface LabelPresenceStat {
  labelId: string;
  labelName: string;
  labelColor: string;
  daysPresent: number;
  totalDays: number;
}

interface MonthLabelStats {
  monthKey: string;
  monthLabel: string;
  totalDays: number;
  labels: LabelPresenceStat[];
}

interface YearLabelStats {
  year: number;
  yearLabel: string;
  totalDays: number;
  labels: LabelPresenceStat[];
}

type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

@Component({
  selector: 'app-unified-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unified-tasks.component.html',
  styleUrls: ['./unified-tasks.component.scss']
})
export class UnifiedTasksComponent implements OnInit, OnDestroy {
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
  showHistoryTaskModal: boolean = false;
  selectedHistoryTask: Task | null = null;
  showDeleteConfirmModal: boolean = false;
  deleteCandidateTask: Task | null = null;
  deleteConfirmSource: 'task' | 'history' | null = null;

  // Renaming state
  isRenaming: boolean = false;
  renameText: string = '';
  isEditingLabel: boolean = false;
  labelDraft: string = '';
  isEditingRecurrence: boolean = false;
  recurrenceDraftType: RecurrenceType = 'none';
  recurrenceDraftDays: number[] = [];
  recurrenceDraftStartDate: string = '';
  scheduledForDraftDate: string = '';
  priorityDraft: boolean = false;

  // Label editor
  showLabelEditor: boolean = false;
  editingLabels: Label[] = [];

  // Filters
  filterLabel: string = '';
  showFilterRow: boolean = false;

  // History date range filters
  historyDateFrom: string = '';
  historyDateTo: string = '';
  private readonly historyStartDate = '2026-02-19';

  // Reset schedule
  showResetTimeModal: boolean = false;
  resetTime: string = '00:00';
  private readonly resetTimeStorageKey = 'kw-reset-time';
  private resetCheckInterval: ReturnType<typeof setInterval> | null = null;

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

  readonly weekdayOptions: Array<{ value: number; label: string }> = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 0, label: 'Sun' },
  ];

  constructor(
    private unifiedTasksService: UnifiedTasksService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLabelsFromStorage();
    this.loadLabelsFromApi();
    this.loadResetTimeFromStorage();
    this.startResetScheduler();

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

  ngOnDestroy(): void {
    if (this.resetCheckInterval) {
      clearInterval(this.resetCheckInterval);
      this.resetCheckInterval = null;
    }
  }

  private loadLabelsFromStorage(): void {
    const kitsui = localStorage.getItem('kitsui-labels');
    const bubble = localStorage.getItem('bubble-labels');
    if (kitsui) this.kitsuiLabels = JSON.parse(kitsui);
    if (bubble) this.bubbleLabels = JSON.parse(bubble);
    this.ensureSelectedLabelExists();
  }

  private loadLabelsFromApi(): void {
    this.unifiedTasksService.getLabels('kitsui').subscribe({
      next: (labels) => {
        if (Array.isArray(labels) && labels.length > 0) {
          this.kitsuiLabels = labels;
          localStorage.setItem('kitsui-labels', JSON.stringify(labels));
          this.ensureSelectedLabelExists();
        }
      },
      error: (error) => {
        console.warn('Could not load kitsui labels from API:', error);
      }
    });

    this.unifiedTasksService.getLabels('bubble').subscribe({
      next: (labels) => {
        if (Array.isArray(labels) && labels.length > 0) {
          this.bubbleLabels = labels;
          localStorage.setItem('bubble-labels', JSON.stringify(labels));
          this.ensureSelectedLabelExists();
        }
      },
      error: (error) => {
        console.warn('Could not load bubble labels from API:', error);
      }
    });
  }

  private ensureSelectedLabelExists(): void {
    const labels = this.currentLabels;
    if (!labels.some((label) => label.id === this.selectedLabel)) {
      const fallback = labels.find((label) => label.id === this.defaultLabel)?.id || labels[0]?.id || '';
      this.selectedLabel = fallback;
    }
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
    if (this.editingLabels[index]) {
      this.editingLabels[index].color = '#' + clean;
    }
  }

  addEditingLabel(): void {
    this.editingLabels.push({ id: 'label-' + Date.now(), name: 'new', color: '#888888' });
  }

  deleteEditingLabel(index: number): void {
    this.editingLabels.splice(index, 1);
  }

  saveLabelChanges(): void {
    const existingIds = new Set(
      this.currentLabels
        .map((label) => label.id)
        .filter((id) => !id.startsWith('label-'))
    );

    const usedIds = new Set<string>();
    const toSlug = (value: string): string =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'label';

    const getUniqueId = (base: string): string => {
      let candidate = base;
      let index = 2;
      while (existingIds.has(candidate) || usedIds.has(candidate)) {
        candidate = `${base}-${index}`;
        index++;
      }
      usedIds.add(candidate);
      return candidate;
    };

    const saved = this.editingLabels.map((label) => {
      const shouldGenerateId = !label.id || label.id.startsWith('label-');
      const id = shouldGenerateId ? getUniqueId(toSlug(label.name)) : label.id;
      if (!shouldGenerateId) {
        usedIds.add(id);
      }
      return { ...label, id };
    });
    if (this.activeTab === 'kitsui') {
      this.kitsuiLabels = saved;
      localStorage.setItem('kitsui-labels', JSON.stringify(saved));
    } else {
      this.bubbleLabels = saved;
      localStorage.setItem('bubble-labels', JSON.stringify(saved));
    }
    this.ensureSelectedLabelExists();
    this.unifiedTasksService.saveLabels(saved, this.activeTab).subscribe({
      next: (labels) => {
        const sanitized = Array.isArray(labels) ? labels : [];
        if (this.activeTab === 'kitsui') {
          this.kitsuiLabels = sanitized;
          localStorage.setItem('kitsui-labels', JSON.stringify(sanitized));
        } else {
          this.bubbleLabels = sanitized;
          localStorage.setItem('bubble-labels', JSON.stringify(sanitized));
        }
        this.ensureSelectedLabelExists();
      },
      error: (error) => {
        console.warn('Could not sync labels to API:', error);
      }
    });
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

    // Second: recurring generated instances always stay below normal tasks
    if (!!a.isRecurringInstance !== !!b.isRecurringInstance) {
      return a.isRecurringInstance ? 1 : -1;
    }

    // Second: priority tasks always go to top (if both not completed)
    if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;

    // Third: newest first, oldest last
    const bDate = b.createdAt || b.modifiedAt || '';
    const aDate = a.createdAt || a.modifiedAt || '';
    return bDate.localeCompare(aDate);
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

  get allTasksNonRecurring(): Task[] {
    return this.sortedTasks.filter(t => !t.isRecurringInstance);
  }

  get allTasksRecurring(): Task[] {
    return this.sortedTasks.filter(t => t.isRecurringInstance);
  }

  get allTasksTotalCount(): number {
    return this.allTasksNonRecurring.length;
  }

  get recurringTasksTotalCount(): number {
    return this.allTasksRecurring.length;
  }

  get todayTotalCount(): number {
    return this.todayTasks.length;
  }

  get allTasksLabelSlices(): LabelSlice[] {
    return this.buildLabelSlices(this.allTasksNonRecurring);
  }

  get recurringTasksLabelSlices(): LabelSlice[] {
    return this.buildLabelSlices(this.allTasksRecurring);
  }

  get todayLabelSlices(): LabelSlice[] {
    return this.buildLabelSlices(this.todayTasks);
  }

  get doneTodayTasks(): Task[] {
    const { resetDate } = this.getCurrentResetReference(new Date());
    return this.tasks.filter(task => {
      if (!task.completed) return false;
      if (this.filterLabel && task.label !== this.filterLabel) return false;
      const raw = task.completedAt || task.modifiedAt;
      if (!raw) return false;
      const completedAt = new Date(raw);
      if (isNaN(completedAt.getTime())) return false;
      return completedAt >= resetDate;
    });
  }

  get doneTodayTotalCount(): number {
    return this.doneTodayTasks.length;
  }

  get doneTodayLabelSlices(): LabelSlice[] {
    return this.buildLabelSlices(this.doneTodayTasks);
  }

  get labelPresenceMonthlyStats(): MonthLabelStats[] {
    const completedTasks = this.tasks.filter(t => t.completed);
    const labels = this.currentLabels;
    const now = new Date();
    const startDate = new Date(this.historyStartDate);
    const results: MonthLabelStats[] = [];

    // Build a map: labelId -> Set of day keys (YYYY-MM-DD)
    const labelDaysMap = new Map<string, Set<string>>();
    for (const label of labels) {
      labelDaysMap.set(label.id, new Set());
    }
    for (const task of completedTasks) {
      const dateValue = task.completedAt || task.modifiedAt || task.createdAt || '';
      if (!dateValue) continue;
      const dayKey = dateValue.slice(0, 10);
      const labelId = task.label || this.defaultLabel;
      if (!labelDaysMap.has(labelId)) continue;
      labelDaysMap.get(labelId)!.add(dayKey);
    }

    // Iterate months from startDate to now
    let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (cursor <= now) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Determine actual total days to count in this month
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      const effectiveStart = monthStart < startDate ? startDate : monthStart;
      const effectiveEnd = monthEnd > now ? now : monthEnd;
      const totalDays = Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / 86400000) + 1;

      const monthLabel = cursor.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      const labelStats: LabelPresenceStat[] = labels.map(label => {
        let daysPresent = 0;
        const daySet = labelDaysMap.get(label.id)!;
        const cur = new Date(effectiveStart);
        while (cur <= effectiveEnd) {
          const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
          if (daySet.has(key)) daysPresent++;
          cur.setDate(cur.getDate() + 1);
        }
        return {
          labelId: label.id,
          labelName: label.name,
          labelColor: label.color,
          daysPresent,
          totalDays: daysInMonth,
        };
      });

      results.push({ monthKey, monthLabel, totalDays: daysInMonth, labels: labelStats });
      cursor = new Date(year, month + 1, 1);
    }

    return results.reverse();
  }

  get labelPresenceYearlyStats(): YearLabelStats[] {
    const completedTasks = this.tasks.filter(t => t.completed);
    const labels = this.currentLabels;
    const now = new Date();
    const startYear = new Date(this.historyStartDate).getFullYear();
    const results: YearLabelStats[] = [];

    const labelDaysMap = new Map<string, Set<string>>();
    for (const label of labels) {
      labelDaysMap.set(label.id, new Set());
    }
    for (const task of completedTasks) {
      const dateValue = task.completedAt || task.modifiedAt || task.createdAt || '';
      if (!dateValue) continue;
      const dayKey = dateValue.slice(0, 10);
      const labelId = task.label || this.defaultLabel;
      if (!labelDaysMap.has(labelId)) continue;
      labelDaysMap.get(labelId)!.add(dayKey);
    }

    for (let year = startYear; year <= now.getFullYear(); year++) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      const daysInYear = isLeapYear ? 366 : 365;
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31);
      const startDate = new Date(this.historyStartDate);
      const effectiveStart = yearStart < startDate ? startDate : yearStart;
      const effectiveEnd = yearEnd > now ? now : yearEnd;

      const labelStats: LabelPresenceStat[] = labels.map(label => {
        let daysPresent = 0;
        const daySet = labelDaysMap.get(label.id)!;
        const cur = new Date(effectiveStart);
        while (cur <= effectiveEnd) {
          const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
          if (daySet.has(key)) daysPresent++;
          cur.setDate(cur.getDate() + 1);
        }
        return {
          labelId: label.id,
          labelName: label.name,
          labelColor: label.color,
          daysPresent,
          totalDays: daysInYear,
        };
      });

      results.push({ year, yearLabel: `${year}`, totalDays: daysInYear, labels: labelStats });
    }

    return results.reverse();
  }

  toggleFilterLabel(labelId: string): void {
    this.filterLabel = this.filterLabel === labelId ? '' : labelId;
  }

  switchTab(tab: TaskType): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.showHistory = false;
      this.selectedLabel = this.defaultLabel;
      this.ensureSelectedLabelExists();
      this.newTaskText = '';
      this.filterLabel = '';
      this.showFilterRow = false;
      this.closeTaskModal();
      this.closeHistoryTaskModal();
      
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
            completedAt: task.completedAt || undefined,
            recurrenceType: this.normalizeRecurrenceType(task.recurrenceType),
            recurrenceDays: this.normalizeRecurrenceDays(task.recurrenceDays),
            isRecurringInstance: !!task.isRecurringInstance,
            recurrenceStartDate: this.normalizeRecurrenceStartDate(task.recurrenceStartDate),
            scheduledForDate: this.normalizeScheduledForDate(task.scheduledForDate)
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
        this.runRecurringResetIfNeeded();
      },
      error: (error) => {
        console.warn('API unavailable, using localStorage:', error);
        this.loadFromLocalStorage();
        this.isLoading = false;
        this.runRecurringResetIfNeeded();
      }
    });
  }

  private loadFromLocalStorage(): void {
    try {
      const storageKey = `${this.activeTab}-tasks-app-data`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        const rawTasks = Array.isArray(data.tasks) ? data.tasks : [];
        this.tasks = rawTasks.map((task: Task) => ({
          ...task,
          recurrenceType: this.normalizeRecurrenceType(task.recurrenceType),
          recurrenceDays: this.normalizeRecurrenceDays(task.recurrenceDays),
          isRecurringInstance: !!task.isRecurringInstance,
          recurrenceStartDate: this.normalizeRecurrenceStartDate(task.recurrenceStartDate),
          scheduledForDate: this.normalizeScheduledForDate(task.scheduledForDate)
        }));
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
        recurrenceType: 'none' as RecurrenceType,
        recurrenceDays: [] as number[],
        isRecurringInstance: false,
        recurrenceStartDate: undefined,
        scheduledForDate: undefined,
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
    const wasCompleted = !!task.completed;
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

    if (!wasCompleted && task.completed && this.isTaskRecurring(task)) {
      this.createNextRecurringTask(task);
    }
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

  revokeTaskFromHistory(task: Task): void {
    task.completed = false;
    task.isToday = false;
    task.completedAt = undefined;
    task.modifiedAt = new Date().toISOString();
    this.saveToLocalStorage();

    this.unifiedTasksService.updateTask(task, this.activeTab).subscribe({
      error: (error) => {
        console.warn('Could not sync to API:', error);
      }
    });
  }

  openHistoryTaskModal(task: Task): void {
    this.selectedHistoryTask = task;
    this.showHistoryTaskModal = true;
  }

  closeHistoryTaskModal(): void {
    this.showHistoryTaskModal = false;
    this.selectedHistoryTask = null;
  }

  revokeTaskFromHistoryModal(): void {
    if (!this.selectedHistoryTask) return;
    this.revokeTaskFromHistory(this.selectedHistoryTask);
    this.closeHistoryTaskModal();
  }

  deleteTaskFromHistoryModal(): void {
    if (!this.selectedHistoryTask) return;
    this.openDeleteConfirmModal(this.selectedHistoryTask, 'history');
  }

  openResetTimeModal(): void {
    this.showResetTimeModal = true;
  }

  closeResetTimeModal(): void {
    this.showResetTimeModal = false;
  }

  saveResetTime(): void {
    const value = this.normalizeResetTime(this.resetTime);
    this.resetTime = value;
    localStorage.setItem(this.resetTimeStorageKey, value);
    this.closeResetTimeModal();
    this.runRecurringResetIfNeeded();
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

  getLabelColorAlpha(labelId: string, alpha: number): string {
    const hexColor = this.getLabelColor(labelId).replace('#', '');
    if (hexColor.length !== 6) {
      return `rgba(136, 136, 136, ${alpha})`;
    }

    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
    this.renameText = task.text;
    this.labelDraft = task.label || this.defaultLabel;
    this.recurrenceDraftType = this.normalizeRecurrenceType(task.recurrenceType);
    this.recurrenceDraftDays = this.normalizeRecurrenceDays(task.recurrenceDays);
    if (this.recurrenceDraftType === 'weekly' && this.recurrenceDraftDays.length === 0) {
      this.recurrenceDraftDays = [new Date().getDay()];
    }
    this.recurrenceDraftStartDate =
      this.normalizeRecurrenceStartDate(task.recurrenceStartDate) || this.getTodayDateString();
    this.scheduledForDraftDate = this.normalizeScheduledForDate(task.scheduledForDate) || '';
    this.priorityDraft = !!task.isPriority;
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
    this.cancelRename();
    this.cancelLabelEdit();
    this.cancelRecurrenceEdit();
    this.labelDraft = '';
    this.scheduledForDraftDate = '';
    this.priorityDraft = false;
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

  startLabelEdit(): void {
    this.labelDraft = this.selectedTask?.label || this.defaultLabel;
    this.isEditingLabel = true;
  }

  cancelLabelEdit(): void {
    this.isEditingLabel = false;
    this.labelDraft = '';
  }

  saveLabelEdit(): void {
    if (!this.labelDraft) return;
    this.updateTaskLabel(this.labelDraft);
  }

  updateTaskLabel(labelId: string): void {
    if (!this.selectedTask) return;

    this.selectedTask.label = labelId;
    this.selectedTask.modifiedAt = new Date().toISOString();
    this.saveToLocalStorage();

    this.unifiedTasksService.updateTask(this.selectedTask, this.activeTab).subscribe({
      error: (error) => {
        console.warn('Could not sync:', error);
      }
    });

    this.isEditingLabel = false;
  }

  startRecurrenceEdit(): void {
    if (!this.selectedTask) return;
    this.recurrenceDraftType = this.normalizeRecurrenceType(this.selectedTask.recurrenceType);
    this.recurrenceDraftDays = this.normalizeRecurrenceDays(this.selectedTask.recurrenceDays);
    this.recurrenceDraftStartDate =
      this.normalizeRecurrenceStartDate(this.selectedTask.recurrenceStartDate) || this.getTodayDateString();
    this.isEditingRecurrence = true;
  }

  cancelRecurrenceEdit(): void {
    this.isEditingRecurrence = false;
    this.recurrenceDraftType = 'none';
    this.recurrenceDraftDays = [];
    this.recurrenceDraftStartDate = '';
  }

  onRecurrenceTypeChange(value: string): void {
    this.recurrenceDraftType = this.normalizeRecurrenceType(value);
    if (this.recurrenceDraftType !== 'weekly') {
      this.recurrenceDraftDays = [];
    } else if (this.recurrenceDraftDays.length === 0) {
      this.recurrenceDraftDays = [new Date().getDay()];
    }
    if (
      (this.recurrenceDraftType === 'monthly' ||
        this.recurrenceDraftType === 'quarterly' ||
        this.recurrenceDraftType === 'yearly') &&
      !this.recurrenceDraftStartDate
    ) {
      this.recurrenceDraftStartDate = this.getTodayDateString();
    }
    if (this.recurrenceDraftType !== 'none') {
      this.priorityDraft = false;
      this.scheduledForDraftDate = '';
    }
  }

  toggleRecurrenceDay(day: number): void {
    if (this.recurrenceDraftType !== 'weekly') return;
    if (this.recurrenceDraftDays.includes(day)) {
      this.recurrenceDraftDays = this.recurrenceDraftDays.filter((d) => d !== day);
      return;
    }
    this.recurrenceDraftDays = [...this.recurrenceDraftDays, day].sort((a, b) => a - b);
  }

  saveRecurrence(): void {
    if (!this.selectedTask) return;

    const recurrenceType = this.recurrenceDraftType;
    const recurrenceDays =
      recurrenceType === 'weekly' ? this.normalizeRecurrenceDays(this.recurrenceDraftDays) : [];
    if (recurrenceType === 'weekly' && recurrenceDays.length === 0) {
      this.error = 'Select at least one weekday for weekly recurrence';
      setTimeout(() => (this.error = ''), 3500);
      return;
    }
    const recurrenceStartDate =
      recurrenceType === 'monthly' ||
      recurrenceType === 'quarterly' ||
      recurrenceType === 'yearly'
        ? this.normalizeRecurrenceStartDate(this.recurrenceDraftStartDate) || this.getTodayDateString()
        : undefined;

    this.selectedTask.recurrenceType = recurrenceType;
    this.selectedTask.recurrenceDays = recurrenceDays;
    this.selectedTask.recurrenceStartDate = recurrenceStartDate;
    if (this.selectedTask.recurrenceType !== 'none') {
      this.selectedTask.isPriority = false;
    }
    this.selectedTask.modifiedAt = new Date().toISOString();
    this.saveToLocalStorage();

    this.unifiedTasksService.updateTask(this.selectedTask, this.activeTab).subscribe({
      error: (error) => {
        console.warn('Could not sync:', error);
      }
    });

    this.cancelRecurrenceEdit();
  }

  getRecurrenceLabel(task: Task): string {
    const recurrenceType = this.normalizeRecurrenceType(task.recurrenceType);
    if (recurrenceType === 'daily') return 'Daily';
    if (recurrenceType === 'weekly') {
      const days = this.normalizeRecurrenceDays(task.recurrenceDays);
      if (days.length === 0) return 'Weekly';
      const labels = this.weekdayOptions
        .filter((day) => days.includes(day.value))
        .map((day) => day.label);
      return `Weekly (${labels.join(', ')})`;
    }
    if (recurrenceType === 'monthly') return 'Monthly';
    if (recurrenceType === 'quarterly') return 'Quarterly';
    if (recurrenceType === 'yearly') return 'Yearly';
    return 'No repeat';
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
      event.preventDefault();
      this.saveTaskModalChanges();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeTaskModal();
    }
  }

  toggleTaskPriority(): void {
    if (this.selectedTask) {
      if (this.isTaskRecurring(this.selectedTask)) {
        this.error = 'Pinned is disabled for recurring tasks';
        setTimeout(() => this.error = '', 3500);
        return;
      }
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

  togglePriorityDraft(): void {
    if (this.recurrenceDraftType !== 'none') {
      this.priorityDraft = false;
      return;
    }
    this.priorityDraft = !this.priorityDraft;
  }

  saveTaskModalChanges(): void {
    if (!this.selectedTask) return;

    const trimmedText = this.renameText.trim();
    if (!trimmedText) {
      this.error = 'Task name cannot be empty';
      setTimeout(() => (this.error = ''), 3500);
      return;
    }

    const recurrenceType = this.recurrenceDraftType;
    const recurrenceDays =
      recurrenceType === 'weekly' ? this.normalizeRecurrenceDays(this.recurrenceDraftDays) : [];
    if (recurrenceType === 'weekly' && recurrenceDays.length === 0) {
      this.error = 'Select at least one weekday for weekly recurrence';
      setTimeout(() => (this.error = ''), 3500);
      return;
    }

    const recurrenceStartDate =
      recurrenceType === 'monthly' ||
      recurrenceType === 'quarterly' ||
      recurrenceType === 'yearly'
        ? this.normalizeRecurrenceStartDate(this.recurrenceDraftStartDate) || this.getTodayDateString()
        : undefined;
    const scheduledForDate =
      recurrenceType === 'none' ? this.normalizeScheduledForDate(this.scheduledForDraftDate) : undefined;
    if (scheduledForDate && scheduledForDate < this.getTodayDateString()) {
      this.error = 'Scheduled date cannot be in the past';
      setTimeout(() => (this.error = ''), 3500);
      return;
    }

    this.selectedTask.text = trimmedText;
    this.selectedTask.label = this.labelDraft || this.defaultLabel;
    this.selectedTask.recurrenceType = recurrenceType;
    this.selectedTask.recurrenceDays = recurrenceDays;
    this.selectedTask.recurrenceStartDate = recurrenceStartDate;
    this.selectedTask.scheduledForDate = scheduledForDate;
    this.selectedTask.isPriority = recurrenceType === 'none' ? this.priorityDraft : false;
    this.selectedTask.modifiedAt = new Date().toISOString();

    this.saveToLocalStorage();
    this.unifiedTasksService.updateTask(this.selectedTask, this.activeTab).subscribe({
      error: (error) => {
        console.warn('Could not sync:', error);
      }
    });

    this.closeTaskModal();
  }

  deleteTaskFromModal(): void {
    if (!this.selectedTask) return;
    this.openDeleteConfirmModal(this.selectedTask, 'task');
  }

  openDeleteConfirmModal(task: Task, source: 'task' | 'history'): void {
    this.deleteCandidateTask = task;
    this.deleteConfirmSource = source;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.deleteCandidateTask = null;
    this.deleteConfirmSource = null;
  }

  confirmDeleteTask(): void {
    if (!this.deleteCandidateTask || !this.deleteConfirmSource) return;

    this.deleteTask(this.deleteCandidateTask.id);
    if (this.deleteConfirmSource === 'task') {
      this.closeTaskModal();
    } else {
      this.closeHistoryTaskModal();
    }
    this.closeDeleteConfirmModal();
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    if (!this.showHistory) {
      this.closeHistoryTaskModal();
    }
    this.syncFragment();
  }

  showTasksView(): void {
    this.showHistory = false;
    this.closeHistoryTaskModal();
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
    const fromDate = this.historyDateFrom || this.historyStartDate;
    const toDate = this.historyDateTo || now.slice(0, 10);

    const completedTasks = this.tasks
      .filter((task) => {
        if (!task.completed) return false;
        if (this.filterLabel && task.label !== this.filterLabel) return false;
        const dateValue = task.completedAt || task.modifiedAt || task.createdAt || now;
        const dayKey = dateValue.slice(0, 10);
        if (dayKey < fromDate || dayKey > toDate) return false;
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

    // Fill in empty days between fromDate and toDate
    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      cursor.setDate(cursor.getDate() + 1);
    }

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

  exportHistory(): void {
    const groups = this.completedHistoryGroups;
    const lines: string[] = [];
    const fromDate = this.historyDateFrom || this.historyStartDate;
    const toDate = this.historyDateTo || new Date().toISOString().slice(0, 10);
    lines.push(`History export — ${this.activeTab} — ${fromDate} → ${toDate}`);
    lines.push('');

    for (const group of groups) {
      lines.push(`── ${group.dayLabel} ──`);
      if (group.tasks.length === 0) {
        lines.push('  (no tasks)');
      } else {
        for (const task of group.tasks) {
          const time = this.formatHistoryTime(task);
          const label = task.label ? ` [${this.getLabelName(task.label)}]` : '';
          lines.push(`  ${time}  ${task.text}${label}`);
        }
      }
      lines.push('');
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-${this.activeTab}-${fromDate}-to-${toDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearHistoryFilters(): void {
    this.historyDateFrom = '';
    this.historyDateTo = '';
  }

  getPieSegments(slices: LabelSlice[]): PieSegment[] {
    if (slices.length === 0) return [];
    if (slices.length === 1) {
      const onlySlice = slices[0];
      return [
        {
          d: 'M 53 53 m -52 0 a 52 52 0 1 0 104 0 a 52 52 0 1 0 -104 0',
          color: onlySlice.color,
          tooltip: `${onlySlice.name}: ${onlySlice.count} task${onlySlice.count > 1 ? 's' : ''}`
        }
      ];
    }

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

  private normalizeRecurrenceType(value: unknown): RecurrenceType {
    if (value === 'custom') return 'weekly';
    if (
      value === 'daily' ||
      value === 'weekly' ||
      value === 'monthly' ||
      value === 'quarterly' ||
      value === 'yearly'
    ) {
      return value;
    }
    return 'none';
  }

  private normalizeRecurrenceDays(value: unknown): number[] {
    if (!Array.isArray(value)) return [];
    const days = value
      .map((day) => Number(day))
      .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
    return Array.from(new Set(days)).sort((a, b) => a - b);
  }

  private normalizeRecurrenceStartDate(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return this.toDateOnlyString(parsed);
  }

  private normalizeScheduledForDate(value: unknown): string | undefined {
    return this.normalizeRecurrenceStartDate(value);
  }

  private isTaskRecurring(task: Task): boolean {
    const recurrenceType = this.normalizeRecurrenceType(task.recurrenceType);
    if (recurrenceType === 'none') return false;
    if (recurrenceType !== 'weekly') return true;
    return this.normalizeRecurrenceDays(task.recurrenceDays).length > 0;
  }

  private createNextRecurringTask(task: Task): void {
    const now = new Date().toISOString();
    const nextTask: Task = {
      id: this.nextId++,
      text: task.text,
      completed: false,
      isToday: false,
      label: task.label,
      isPriority: task.isPriority,
      recurrenceType: this.normalizeRecurrenceType(task.recurrenceType),
      recurrenceDays: this.normalizeRecurrenceDays(task.recurrenceDays),
      isRecurringInstance: true,
      recurrenceStartDate: this.normalizeRecurrenceStartDate(task.recurrenceStartDate),
      scheduledForDate: undefined,
      createdAt: now,
      modifiedAt: now,
      completedAt: undefined,
    };

    this.tasks.push(nextTask);
    this.saveToLocalStorage();

    this.unifiedTasksService.addTask(nextTask, this.activeTab).subscribe({
      next: (savedTask) => {
        const index = this.tasks.findIndex((existingTask) => existingTask.id === nextTask.id);
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...savedTask };
        }
        this.saveToLocalStorage();
      },
      error: (error) => {
        console.warn('Could not sync to API:', error);
      }
    });
  }

  private loadResetTimeFromStorage(): void {
    const saved = localStorage.getItem(this.resetTimeStorageKey);
    this.resetTime = this.normalizeResetTime(saved ?? '00:00');
  }

  private startResetScheduler(): void {
    this.runRecurringResetIfNeeded();
    this.resetCheckInterval = setInterval(() => {
      this.runRecurringResetIfNeeded();
    }, 30_000);
  }

  private normalizeResetTime(value: string): string {
    if (!/^\d{2}:\d{2}$/.test(value)) return '00:00';
    const [hourRaw, minuteRaw] = value.split(':');
    const hour = Number(hourRaw);
    const minute = Number(minuteRaw);
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return '00:00';
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return '00:00';
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  private getResetMarkerStorageKey(): string {
    return `kw-last-reset-marker-${this.activeTab}`;
  }

  private getDateMarker(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getCurrentResetReference(now: Date): { marker: string; resetDate: Date } {
    const [hourRaw, minuteRaw] = this.normalizeResetTime(this.resetTime).split(':');
    const hour = Number(hourRaw);
    const minute = Number(minuteRaw);

    const resetDate = new Date(now);
    resetDate.setHours(hour, minute, 0, 0);

    if (now < resetDate) {
      resetDate.setDate(resetDate.getDate() - 1);
    }

    return {
      marker: this.getDateMarker(resetDate),
      resetDate,
    };
  }

  private runRecurringResetIfNeeded(): void {
    const now = new Date();
    const { marker, resetDate } = this.getCurrentResetReference(now);
    const markerKey = this.getResetMarkerStorageKey();
    const lastMarker = localStorage.getItem(markerKey);

    if (lastMarker === marker) return;

    this.applyRecurringReset(resetDate);
    localStorage.setItem(markerKey, marker);
  }

  private applyRecurringReset(resetDate: Date): void {
    const nowIso = new Date().toISOString();
    const candidates = this.tasks.filter((task) => {
      if (task.completed || task.isToday) return false;
      return this.shouldTaskBeMovedToTodayAtReset(task, resetDate);
    });

    if (candidates.length === 0) return;

    candidates.forEach((task) => {
      task.isToday = true;
      if (!this.isTaskRecurring(task)) {
        task.scheduledForDate = undefined;
      }
      task.modifiedAt = nowIso;

      this.unifiedTasksService.updateTask(task, this.activeTab).subscribe({
        error: (error) => {
          console.warn('Could not sync to API:', error);
        }
      });
    });

    this.saveToLocalStorage();
  }

  private shouldTaskBeMovedToTodayAtReset(task: Task, resetDate: Date): boolean {
    const recurrenceType = this.normalizeRecurrenceType(task.recurrenceType);
    if (recurrenceType === 'none') {
      const scheduledForDate = this.normalizeScheduledForDate(task.scheduledForDate);
      if (!scheduledForDate) return false;
      return scheduledForDate <= this.getDateMarker(resetDate);
    }

    const resetWeekday = resetDate.getDay();
    const anchorDate = this.getRecurrenceAnchorDate(task);

    if (recurrenceType === 'daily') return true;

    if (recurrenceType === 'weekly') {
      const days = this.normalizeRecurrenceDays(task.recurrenceDays);
      return days.includes(resetWeekday);
    }

    if (recurrenceType === 'monthly') {
      if (!anchorDate) return false;
      return anchorDate.getDate() === resetDate.getDate();
    }

    if (recurrenceType === 'quarterly') {
      if (!anchorDate) return false;

      const monthsDiff =
        (resetDate.getFullYear() - anchorDate.getFullYear()) * 12 +
        (resetDate.getMonth() - anchorDate.getMonth());

      return monthsDiff >= 0 && monthsDiff % 3 === 0 && anchorDate.getDate() === resetDate.getDate();
    }

    if (recurrenceType === 'yearly') {
      if (!anchorDate) return false;
      return (
        anchorDate.getMonth() === resetDate.getMonth() &&
        anchorDate.getDate() === resetDate.getDate()
      );
    }

    return false;
  }

  private getRecurrenceAnchorDate(task: Task): Date | null {
    const startDate = this.normalizeRecurrenceStartDate(task.recurrenceStartDate);
    if (startDate) {
      const [year, month, day] = startDate.split('-').map((v) => Number(v));
      const parsed = new Date(year, month - 1, day, 0, 0, 0, 0);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }

    const createdDate = task.createdAt ? new Date(task.createdAt) : null;
    if (!createdDate || Number.isNaN(createdDate.getTime())) return null;
    return createdDate;
  }

  private toDateOnlyString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getTodayDateString(): string {
    return this.toDateOnlyString(new Date());
  }
}
