import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../../Dtos/IUser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpClient = inject(HttpClient);

  getUserInformation() {
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/Authentication/UserInformation`)
  }



}
