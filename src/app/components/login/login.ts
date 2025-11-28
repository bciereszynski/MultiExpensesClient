import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    loginForm: FormGroup;
    errorMessage: string | null = null;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router ) {
        this.loginForm = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }
    
    hasError(controlName: string, errorName: string): boolean {
        const control = this.loginForm.get(controlName);
        return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
    }

    onSubmit(): void{
        this.errorMessage = null;
        if (this.loginForm.valid) {
            const login = this.loginForm.value;
            this.authService.login(login).subscribe({
                next: () => {
                  this.router.navigate(['/groups']);
                },
                error: (err) => {
                  this.errorMessage = err.error?.message || 'Login failed. Please try again.';
                } 
            });
        } else {
            
        }
    }
}
