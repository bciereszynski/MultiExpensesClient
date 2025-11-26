import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
    signupForm: FormGroup;
    errorMessage: string | null = null;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router ) {
        this.signupForm = fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        },{
            validators: this.passwordMatchValidator
        });
    }
    
    hasError(controlName: string, errorName: string): boolean {
        const control = this.signupForm.get(controlName);
        return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
    }

    passwordMatchValidator(formGroup: FormGroup) {
        const password = formGroup.get('password')?.value;
        const confirmPassword = formGroup.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    onSubmit(): void{
        this.errorMessage = null;
        if (this.signupForm.valid) {
            const signup = this.signupForm.value;
            this.authService.register(signup).subscribe({
                next: () => {
                  this.router.navigate(['/transactions']);
                },
                error: (err) => {
                  this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
                } 
            });
        } else {
            
        }
    }
}