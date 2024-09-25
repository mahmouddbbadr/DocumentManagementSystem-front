import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { confirmPasswordValidator } from './confirm-password.validator';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  authService  =  inject(AuthService);
  router  =  inject(Router);

  registerForm = new FormGroup({
    Email: new FormControl(''),
    Password: new FormControl(''),
    ConfirmPassword: new FormControl(''),
    NId: new FormControl(''),
    Address: new FormControl(''),
    PhoneNumber: new FormControl(''),
    WorkSpaceName: new FormControl(''),

  },{
    validators: confirmPasswordValidator
  });


  public onSubmit() {
    if (this.registerForm.valid) {
      this.authService.signup(this.registerForm.value)
        .subscribe((response) => {
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            alert(error.error.message);
          } else {
            console.error('Unexpected error:', error);
          }
        }
      );
    }
  }
}
