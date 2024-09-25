import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../enviroments/environment.development';
import { IUser } from '../../Dtos/IUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    const jwtHelper = new JwtHelperService();

    this.loggedInSubject$.next(
      localStorage.getItem('userToken') !== null &&
        !jwtHelper.isTokenExpired(localStorage.getItem('userToken'))
    );
    let userInfo = localStorage.getItem('user');
    if (this.loggedInSubject$.value && userInfo)
      this.userInfo$.next(JSON.parse(userInfo));
  }

  public loggedInSubject$ = new BehaviorSubject<boolean>(false);
  public isAdmin$ = new BehaviorSubject<boolean>(false);
  public userInfo$ = new BehaviorSubject<IUser>({
    userId: '',
    userName: '',
    email: '',
    nId: '',
    address: '',
    phoneNumber: '',
    workSpaceName: '',
    role: '',
    isLocked: '',
  });

  httpClient = inject(HttpClient);

  signup(data: any) {
    return this.httpClient.post(
      `${environment.baseUrl}/api/Authentication/register`,
      data
    );
  }

  login(data: any) {
    return this.httpClient
      .post(`${environment.baseUrl}/api/Authentication/login`, data)
      .pipe(
        tap((result: any) => {
          localStorage.setItem('userToken', result.body.token);
          localStorage.setItem('user', JSON.stringify(result.body.user));
          this.loggedInSubject$.next(true);
          this.userInfo$.next(result.body.user);
        })
      );
  }

  isLoggedIn() {
    const jwtHelper = new JwtHelperService();
    return (
      localStorage.getItem('userToken') !== null &&
      !jwtHelper.isTokenExpired(localStorage.getItem('userToken'))
    );
  }
}
