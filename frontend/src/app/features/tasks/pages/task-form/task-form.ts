import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],  // ✅ added RouterModule
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css']
})
export class TaskFormComponent implements OnInit {

  taskForm!: FormGroup;
  taskId!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title:       ['', Validators.required],
      description: [''],
      status:      ['TO_DO']
    });

    this.taskId = this.route.snapshot.params['id'];

    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe(task => {
        this.taskForm.patchValue(task);
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.taskForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'TO_DO':       'To Do',
      'IN_PROGRESS': 'In Progress',
      'DONE':        'Done'
    };
    return map[status] ?? status;
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.taskId) {
      this.taskService.updateTask(this.taskId, this.taskForm.value)
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: () => { this.loading = false; }
        });
    } else {
      this.taskService.createTask(this.taskForm.value)
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: () => { this.loading = false; }
        });
    }
  }
}
