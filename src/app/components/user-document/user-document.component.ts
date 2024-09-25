import { AdminService } from './../../services/adminService/admin.service';
import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { IDocument } from '../../Dtos/IDocument';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviroments/environment.development';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-document',
  standalone: true,
  imports: [LayoutComponent, CommonModule, PaginationComponent, FormsModule],
  templateUrl: './user-document.component.html',
  styleUrl: './user-document.component.css'
})
export class UserDocumentComponent implements OnInit{

  documents: Array<IDocument> = []
  filterdDocuments: Array<IDocument> =[]
  searchTerm: string ='';

  activatedRoute = inject(ActivatedRoute)
  adminService = inject(AdminService)
  email: any
  directoryName: any
  url: any

  page: number = 1
  totalPages!: number
  pageSize: number = 9
  totalRecords!: number
  loading: boolean = false

  ngOnInit(): void {
    this.email = this.activatedRoute.snapshot.paramMap.get('email')
    this.directoryName = this.activatedRoute.snapshot.paramMap.get('name')
    this.getUserDocuments()
  }

  getUserDocuments(){
    this.adminService.getDocumentsOfDirectory(this.directoryName, this.email, this.page, this.pageSize).subscribe((response)=>{
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    })
  }
  onSearch(searchValue: string){
    this.searchTerm = searchValue
    if(this.searchTerm){

      this.adminService.searchDocumentsOfDirectory(this.searchTerm, this.directoryName, this.email, this.page, this.pageSize).subscribe({
        next: (result) => (this.filterdDocuments = result.body.documents as Array<IDocument>),
        error: (error)=> {
          this.filterdDocuments = []
          console.log('error', error)
        }
      })
    }else{
      this.filterdDocuments = this.documents;
    }
  }


  open(document: IDocument){
    this.url = `${environment.baseUrl}/SavedDocuments/${document.wwwRootName}`
    window.open(this.url, '_blank')
  }

  goPrevious(){
    if(this.page>1){
      this.page--
      this.getUserDocuments()
    }
  }
  goNext(){
    if(this.page < this.totalPages){
      this.page++
      this.getUserDocuments()
    }
  }
  goToPage(n: number){
    this.page = n
    this.getUserDocuments()
  }
}
