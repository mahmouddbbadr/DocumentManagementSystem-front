import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { IDocument } from '../../Dtos/IDocument';
import { DocumentService } from '../../services/documentService/document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../enviroments/environment.development';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-documents',
  standalone: true,
  imports: [LayoutComponent, CommonModule, PaginationComponent, FormsModule],
  templateUrl: './shared-documents.component.html',
  styleUrl: './shared-documents.component.css'
})
export class SharedDocumentsComponent implements OnInit{

  documents: Array<IDocument> = [];
  filterdDocuments: Array<IDocument> =[]
  searchTerm: string ='';


  documentService = inject(DocumentService);
  url!: string

  page: number = 1
  totalPages!: number
  pageSize: number = 9
  totalRecords!: number
  loading: boolean = false

  ngOnInit(): void {
    this.getShared()
  }
  getShared(){
    this.documentService.getSharedPublicDocuments(this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })
  }

  onSearch(searchValue: string){
    this.searchTerm = searchValue
    if(this.searchTerm){

      this.documentService.searchSharedDocuments(this.searchTerm, this.page, this.pageSize).subscribe({
        next: (result) => (this.filterdDocuments = result.body.documents as Array<IDocument>),
        error: (error)=> {
          this.filterdDocuments =[]
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
      this.getShared()
    }
  }
  goNext(){
    if(this.page < this.totalPages){
      this.page++
      this.getShared()
    }
  }
  goToPage(n: number){
    this.page = n
    this.getShared()
  }

  sortNameAscending(){
    this.documentService.getSharedDocumentsSortedByNameAscending(this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })
  }

  sortNameDescending(){
    this.documentService.getSharedDocumentsSortedByNameDescending(this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })
  }

  sortDateAscending(){
    this.documentService.getSharedDocumentsSortedByDateAscending(this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })

  }

  sortDateDescending(){
    this.documentService.getSharedDocumentsSortedByDateDescending(this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })

  }
  sortSizeAscending(){
    this.documentService.getSharedDocumentsSortedBySizeAscending(this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })
  }

  sortSizeDescending(){
    this.documentService.getSharedDocumentsSortedBySizeDescending(this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>
      this.filterdDocuments = this.documents
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        this.filterdDocuments = []
        console.log(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })

  }


}
