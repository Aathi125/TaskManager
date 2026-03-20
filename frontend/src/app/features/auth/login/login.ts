import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Helper for clean template validation checks
  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // show all validation errors on submit
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', this.loginForm.value)
      .subscribe({
        next: res => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        },
        error: err => {
          this.loading = false;
          this.errorMessage = err.status === 401
            ? 'Invalid username or password.'
            : 'Something went wrong. Please try again.';
        }
      });
  }
}
