import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { IUser } from '../../Dtos/IUser';
import { UserService } from '../../services/userService/user.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthService } from '../../services/auth/auth.service';
import { NgIf } from '@angular/common';
import { AdminService } from '../../services/adminService/admin.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    RouterModule,
    DashboardComponent,
    NgIf,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  userService = inject(UserService);
  adminService = inject(AdminService);
  authService = inject(AuthService);
  router = inject(Router);

  changeDetection = inject(ChangeDetectorRef);

  user!: IUser;
  ngOnInit(): void {
    this.authService.userInfo$.asObservable().subscribe({
      next: (result) => {
        this.user = result as IUser;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  goHome() {
    this.router.navigateByUrl(`dashboard`);
  }

  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    }
  }
}
