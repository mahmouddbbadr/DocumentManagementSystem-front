import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDirectory } from '../../Dtos/IDirectory';
import { environment } from '../../../enviroments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class DirectoryService {



  httpClient = inject(HttpClient);


  getDirectories(page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IDirectory>(`${environment.baseUrl}/api/Directory?page=${page}&pageSize=${pageSize}`)
  }
  addDirectory(name: string){
    return this.httpClient.post<IDirectory>(`${environment.baseUrl}/api/Directory/Name?name=${name}`, null)
  }

  deleteDirectory(name: string){
    return this.httpClient.delete(`${environment.baseUrl}/api/Directory/Name?name=${name}`)
  }

  editDirectory(name:string, body: any){
    return this.httpClient.put(`${environment.baseUrl}/api/Directory/Name?name=${name}`, body)
  }

  SearchDirectories(filter: string, page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IDirectory>(`${environment.baseUrl}/api/Directory/Search?filter=${filter}&page=${page}&pageSize=${pageSize}`)
  }

}
