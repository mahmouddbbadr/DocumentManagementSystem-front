import { AuthService } from './services/auth/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  isloggedIn: boolean=false;

  ngOnInit(): void {
    this.authService.loggedInSubject$.asObservable().subscribe({
      next: (result) => (this.isloggedIn = result),
      error: (error) => {console.log(error)}
    });
  }
}
