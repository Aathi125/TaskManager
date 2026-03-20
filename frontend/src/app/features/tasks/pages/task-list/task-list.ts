import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../../../../core/services/task';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

declare var bootstrap: any; // for Bootstrap modal JS

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  activeFilter: string = 'ALL';
  taskToDelete: Task | null = null;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: data => {
        this.tasks = data;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error fetching tasks', err)
    });
  }

  filteredTasks(): Task[] {
    if (this.activeFilter === 'ALL') return this.tasks;
    return this.tasks.filter(t => t.status === this.activeFilter);
  }

  setFilter(status: string) {
    this.activeFilter = status;
  }

  countByStatus(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'TO_DO':       'badge-todo',
      'IN_PROGRESS': 'badge-progress',
      'DONE':        'badge-done'
    };
    return map[status] ?? 'badge-todo';
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      'TO_DO':       'bi-hourglass-split',
      'IN_PROGRESS': 'bi-arrow-repeat',
      'DONE':        'bi-check-circle-fill'
    };
    return map[status] ?? 'bi-hourglass-split';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'TO_DO':       'To Do',
      'IN_PROGRESS': 'In Progress',
      'DONE':        'Done'
    };
    return map[status] ?? status;
  }

  confirmDelete(task: Task) {
    this.taskToDelete = task;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  deleteConfirmed() {
    if (!this.taskToDelete?.id) return;

    this.taskService.deleteTask(this.taskToDelete.id).subscribe(() => {
      // close modal
      const modalEl = document.getElementById('deleteModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
      this.taskToDelete = null;
      this.getTasks();
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
