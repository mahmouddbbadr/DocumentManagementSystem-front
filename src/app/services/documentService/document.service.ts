import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDocument } from '../../Dtos/IDocument';
import { environment } from '../../../enviroments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  httpClient = inject(HttpClient);

  getDocuments(page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document?page=${page}&pageSize=${pageSize}`)
  }

  getDocumentsByDirectoryName(name: string, page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/DirectoryName?name=${name}&page=${page}&pageSize=${pageSize}`)
  }
  editDocument(oldName: string, newName:string){
    return this.httpClient.put(`${environment.baseUrl}/api/Document?OldName=${oldName}&NewName=${newName}`, null)
  }
  uploadDocument(file: File, directoryName: string, tags: string){
    const formData = new FormData()
    formData.append('file', file)
    formData.append('directoryName', directoryName)
    formData.append('tags', tags)
    return this.httpClient.post(`${environment.baseUrl}/api/Document`, formData);
  }
  downloadDocument(name: string, wwwRootName: string){
    return this.httpClient.get(`${environment.baseUrl}/api/Document/Download?name=${name}&wwwRootName=${wwwRootName}`, {observe:'response', responseType:'blob'})
  }
  deleteDocument(name: string){
    return this.httpClient.delete(`${environment.baseUrl}/api/Document/name?name=${name}`)
  }

  getSharedPublicDocuments(page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/Shared?page=${page}&pageSize=${pageSize}`)
  }

  getDocumentsSortedByNameAscending(directoryName: string, page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SortByNameAscending?directoryName=${directoryName}&page=${page}&pageSize=${pageSize}`)
  }
  getDocumentsSortedByDateAscending(directoryName: string, page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SortByDateAscending?directoryName=${directoryName}&page=${page}&pageSize=${pageSize}`)
  }
  getDocumentsSortedBySizeAscending(directoryName: string, page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SortBySizeAscending?directoryName=${directoryName}&page=${page}&pageSize=${pageSize}`)
  }

  getDocumentsSortedByNameDescending(directoryName: string, page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SortByNameDescending?directoryName=${directoryName}&page=${page}&pageSize=${pageSize}`)
  }
  getDocumentsSortedByDateDescending(directoryName: string, page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SortByDateDescending?directoryName=${directoryName}&page=${page}&pageSize=${pageSize}`)
  }
  getDocumentsSortedBySizeDescending(directoryName: string, page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SortBySizeDescending?directoryName=${directoryName}&page=${page}&pageSize=${pageSize}`)
  }


  getSharedDocumentsSortedByNameAscending(page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SharedSortedByNameAscending?page=${page}&pageSize=${pageSize}`)
  }
  getSharedDocumentsSortedByDateAscending(page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SharedSortedByDateAscending?page=${page}&pageSize=${pageSize}`)
  }
  getSharedDocumentsSortedBySizeAscending(page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SharedSortedBySizeAscending?page=${page}&pageSize=${pageSize}`)
  }

  getSharedDocumentsSortedByNameDescending(page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SharedSortedByNameDescending?page=${page}&pageSize=${pageSize}`)
  }
  getSharedDocumentsSortedByDateDescending(page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SharedSortedByDateDescending?page=${page}&pageSize=${pageSize}`)
  }
  getSharedDocumentsSortedBySizeDescending(page: number, pageSize: number):Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SharedSortedBySizeDescending?page=${page}&pageSize=${pageSize}`)
  }
  searchDocuments(filter: string, page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/Search?filter=${filter}&page=${page}&pageSize=${pageSize}`)
  }

  searchSharedDocuments(filter: string, page: number, pageSize: number): Observable<any>{
    return this.httpClient.get<IDocument>(`${environment.baseUrl}/api/Document/SearchShared?filter=${filter}&page=${page}&pageSize=${pageSize}`)
  }

}
