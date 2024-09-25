import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/userService/user.service';
import { LayoutComponent } from '../layout/layout.component';
import { IUser } from '../../Dtos/IUser';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  user!: IUser
  authService = inject(AuthService)

  userService = inject(UserService)
  ngOnInit(): void {
    this.authService.userInfo$.asObservable().subscribe({
      next: (result) => (this.user = result as IUser),
      error: (error) => {console.log(error)}
    })
  }
  getUser(user: IUser){
    this.user = user
  }

}
