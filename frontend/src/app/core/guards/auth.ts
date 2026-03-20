import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// ✅ Functional guard — matches Angular 17 standalone style
export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
