import { DocumentService } from './../../services/documentService/document.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IDocument } from '../../Dtos/IDocument';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';
import { environment } from '../../../enviroments/environment.development';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, LayoutComponent, CommonModule, PaginationComponent, FormsModule],
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.css',
})
export class DirectoryComponent implements OnInit {
  directoryName!: string
  workSpaceName!: string

  documents: Array<IDocument> = [];
  filterdDocuments: Array<IDocument> =[]
  searchTerm: string ='';



  addPopUpFlag:boolean = false
  editPopUpFlag:boolean = false
  downloadPopUpFlag:boolean = false
  deletePopUpFlag:boolean = false
  documentToEdit!: IDocument
  documentToDownload!: IDocument
  documentToDetele!: IDocument

  url!: any


  page: number = 1
  totalPages!: number
  pageSize: number = 8
  totalRecords!: number
  loading: boolean = false

  activatedRoute = inject(ActivatedRoute);
  documentService = inject(DocumentService);

  ngOnInit(): void {
    this.directoryName = this.activatedRoute.snapshot.paramMap.get('name') as string;
    this.workSpaceName = this.activatedRoute.snapshot.paramMap.get('workSpaceName') as string
    this.getDocumentsByDirName()

  }

  getDocumentsByDirName(){
    this.documentService.getDocumentsByDirectoryName(this.directoryName, this.page, this.pageSize).subscribe((response) => {
      this.documents = response.body.documents as Array<IDocument>;
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
    }
  )
  }

  onSearch(searchValue: string){
    this.searchTerm = searchValue
    if(this.searchTerm){
      this.documentService.searchDocuments(this.searchTerm, this.page , this.pageSize).subscribe({
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


  addForm = new FormGroup({
    Tags: new FormControl(''),
  })

  editForm = new FormGroup({
    Name: new FormControl(''),
  })


  getWorkSpaceName(workSpaceName: string){
    this.workSpaceName = workSpaceName
  }

  selectedFile!: File
  onFileSelected(event:any) {
    const file:File = event.target.files[0];
    if (file) {this.selectedFile = file }
  }

  showAddPupUp(){
    this.addPopUpFlag = true
  }
  addDocument(event: any) {
    event.preventDefault();
    if (this.selectedFile) {
    this.directoryName =this.activatedRoute.snapshot.paramMap.get('name') as string
    }
    this.documentService.uploadDocument(this.selectedFile, this.directoryName, this.addForm.controls.Tags.value as string)
    .subscribe((resonse: any) => {
      alert(resonse.message)
      this.documentService.getDocumentsByDirectoryName(this.directoryName, this.page, this.pageSize).subscribe((resonse: any) => {
        this.documents = resonse.body.documents as Array<IDocument>;
        this.filterdDocuments = this.documents
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          console.log(error.error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    );
      this.closePop()
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    });
  }




  showEditFlag(document: IDocument) {
    this.editPopUpFlag = true
    this.documentToEdit = document
  }
  editDocument(){
    this.documentService.editDocument(this.documentToEdit.name, this.editForm.controls.Name.value as string).subscribe((resonse : any)=>{
      alert(resonse.message)
      this.documentService.getDocumentsByDirectoryName(this.directoryName, this.page, this.pageSize).subscribe((response: any) => {
        this.documents = response.body.documents as Array<IDocument>;
        this.filterdDocuments = this.documents
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          console.log(error.error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    );
      this.closePop()
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })
  }


  showDownloadPopUp(document:IDocument){
    this.downloadPopUpFlag = true
    this.documentToDownload = document
  }
  downloadDocument(){
    this.documentService.downloadDocument(this.documentToDownload.name, this.documentToDownload.wwwRootName).subscribe((resonse)=>{
      let blob:Blob = resonse.body as Blob;
      let a = document.createElement('a')
      a.download = this.documentToDownload.name
      a.href = window.URL.createObjectURL(blob)
      a.click()
      this.closePop()
    },
    (error) => {
      if(error instanceof HttpErrorResponse){
        alert(error.error.message)
      } else {
        console.error('Unexpected error:', error);
      }
    }
  )
  }

  showDeleteFlag(document: IDocument){
    this.deletePopUpFlag = true;
    this.documentToDetele = document

  }
  deleteDocument() {
      this.documentService.deleteDocument(this.documentToDetele.name).subscribe((resonse: any)=>{
        this.documents = this.documents.filter((d) => d.name !== this.documentToDetele.name);
        this.filterdDocuments = this.documents
      },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            alert(error.error.message);
          } else {
            console.error('Unexpected error:', error)
          }
        })

    this.closePop()
  }



  closePop(){
    this.addPopUpFlag = false
    this.editPopUpFlag = false
    this.downloadPopUpFlag = false
    this.deletePopUpFlag = false
  }
  open(document:IDocument){
    this.url = `${environment.baseUrl}/SavedDocuments/${document.wwwRootName}`
    window.open(this.url, '_blank')
  }

  goPrevious(){
    if(this.page>1){
      this.page--
      this.getDocumentsByDirName()
    }
  }
  goNext(){
    if(this.page < this.totalPages){
      this.page++
      this.getDocumentsByDirName()
    }
  }
  goToPage(n: number){
    this.page = n
    this.getDocumentsByDirName()
  }

  sortNameAscending(){
    this.documentService.getDocumentsSortedByNameAscending(this.directoryName, this.page, this.pageSize).subscribe((response)=>{
      this.documents = response.body.documents as Array<IDocument>;
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
    this.documentService.getDocumentsSortedByDateAscending(this.directoryName, this.page, this.pageSize).subscribe((response)=>{
      this.documents = response.body.documents as Array<IDocument>;
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
    this.documentService.getDocumentsSortedBySizeAscending(this.directoryName, this.page, this.pageSize).subscribe((response)=>{
      this.documents = response.body.documents as Array<IDocument>;
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
    this.documentService.getDocumentsSortedByNameDescending(this.directoryName, this.page, this.pageSize).subscribe((response)=>{
      this.documents = response.body.documents as Array<IDocument>;
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
    this.documentService.getDocumentsSortedByDateDescending(this.directoryName, this.page, this.pageSize).subscribe((response)=>{
      this.documents = response.body.documents as Array<IDocument>;
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
    this.documentService.getDocumentsSortedBySizeDescending(this.directoryName, this.page, this.pageSize).subscribe((response)=>{
      this.documents = response.body.documents as Array<IDocument>;
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

}
