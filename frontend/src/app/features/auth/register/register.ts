import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirm  = form.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  loading        = false;
  showPassword   = false;
  showConfirm    = false;
  errorMessage   = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username:        ['', [Validators.required, Validators.minLength(3)]],
        password:        ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator }
    );
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';

    // ✅ Only send username + password — matches your backend User model
    const { username, password } = this.registerForm.value;

    this.http.post('http://localhost:8080/api/auth/register', { username, password })
      .subscribe({
        next: () => {
          this.loading        = false;
          this.successMessage = 'Account created! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: err => {
          this.loading      = false;
          // Your backend throws RuntimeException — Spring returns 500 for duplicates
          this.errorMessage = 'Registration failed. Username may already exist.';
        }
      });
  }
}
