import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    Email: new FormControl(''),
    Password: new FormControl(''),

  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)?.subscribe((response) =>{
            if (this.authService.isLoggedIn()) {
              this.router.navigateByUrl('dashboard');
            }
          },
          (error: any) => {
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
