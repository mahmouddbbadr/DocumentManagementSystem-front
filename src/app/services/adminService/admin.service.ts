import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.development';
import { IUser } from '../../Dtos/IUser';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  httpClient = inject(HttpClient)


  getUnBlockedUsers(page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/User?page=${page}&pageSize=${pageSize}`)

  }

  getBlockedUsers(page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/User/BlockedUsers?page=${page}&pageSize=${pageSize}`)
  }

  blockUser(email: string){
    return this.httpClient.put(`${environment.baseUrl}/api/User/Block?email=${email}`, null)
  }

  unBlockUser(email: string){
    return this.httpClient.put(`${environment.baseUrl}/api/User/UnBlock?email=${email}`, null)
  }

  getUserDirectories(email: string, page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/Directory/Email?email=${email}&page=${page}&pageSize=${pageSize}`)
  }
  getDocumentsOfDirectory(directoryName: string, email: string,  page: number, pageSize: number ): Observable<any>{
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/Document/DirectoryName/Email?name=${directoryName}&email=${email}&page=${page}&pageSize=${pageSize}`)
  }

  SearchUnBlockedUsers(filter: string, page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/User/SearchUnBlocked?filter=${filter}&page=${page}&pageSize=${pageSize}`)
  }

  SearchBlockedUsers(filter: string, page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/User/SearchBlocked?filter=${filter}&page=${page}&pageSize=${pageSize}`)
  }

  searchDocumentsOfDirectory(filter: string, directoryName: string, email: string,  page: number, pageSize: number ): Observable<any>{
    return this.httpClient.get<IUser>(`${environment.baseUrl}/api/Document/AdminSearchDocuments?filter=${filter}&name=${directoryName}%20&email=${email}&page=${page}&pageSize=${pageSize}`)
  }

}
