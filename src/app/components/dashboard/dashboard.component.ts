import {
  Component,
  inject,
  NgModule,
  OnInit,
} from '@angular/core';
import { DirectoryService } from '../../services/directoryService/directory.service';

import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/userService/user.service';
import { DocumentService } from '../../services/documentService/document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IDirectory } from '../../Dtos/IDirectory';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LayoutComponent } from '../layout/layout.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { IUser } from '../../Dtos/IUser';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, NgIf, ReactiveFormsModule,
    MatCheckboxModule, LayoutComponent, PaginationComponent,
    FormsModule, NgFor
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {


  directories: Array<IDirectory> = [];
  filterdDirectories: Array<IDirectory> =[]
  searchTerm: string ='';


  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute)
  directoryService = inject(DirectoryService);
  documentService = inject(DocumentService);


  workSpaceName: string='';

  page: number = 1
  totalPages!: number
  pageSize: number = 8
  totalRecords!: number
  loading: boolean = false
  user!: IUser

  ngOnInit(): void {
    this.authService.userInfo$.asObservable().subscribe({
      next:(result)=> (this.user = result as IUser),
      error:(error)=> {console.log(error)}
    })
    if(this.user){
      this.workSpaceName = this.user.workSpaceName
    }
    this.getDirectories()


  }
  getDirectories(){
    this.directoryService.getDirectories(this.page, this.pageSize).subscribe((response) => {
      this.directories =  response.body.directories as Array<IDirectory>;
      this.filterdDirectories = this.directories
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    },
    (error: any) => {
      if (error instanceof HttpErrorResponse) {
        console.error(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })
  }
  onSearch(searchValue: string){
    this.searchTerm = searchValue
    if(this.searchTerm){

      this.directoryService.SearchDirectories(this.searchTerm, this.page, this.pageSize).pipe().subscribe({
        next: (result) => (this.filterdDirectories = result.body.directories as Array<IDirectory>),
        error: (error)=> {
          this.filterdDirectories = []
          console.log('error', error)}
      })
    }
    else{
      this.filterdDirectories = this.directories;
    }
  }


  addPopUpFlag: boolean= false
  deletePopUpFlag: boolean= false
  editPopUpFlag: boolean= false
  directoryToEdit!: IDirectory
  directoryToDelete!: IDirectory

  addForm = new FormGroup({
    name: new FormControl(''),
  })

  editForm = new FormGroup({
    Name: new FormControl(''),
    IsPrivate: new FormControl(true),
  })

  getWorkSpaceName(workSpaceName:string){
    this.workSpaceName = workSpaceName
  }

  closePop(){
    this.addPopUpFlag = false
    this.deletePopUpFlag = false
    this.editPopUpFlag = false
  }

  openDirectory(directory: IDirectory) {
    this.router.navigateByUrl(`workSpace/${this.workSpaceName}/${directory.name}`);
  }


  showAddPopUP() {
    this.addPopUpFlag = true
  }
  addDirectory(){
    this.directoryService.addDirectory(this.addForm.controls.name.value as string).subscribe((resonse : any)=>{
      alert(resonse.message)
      this.directoryService.getDirectories(this.page, this.pageSize).subscribe((resonse)=>{
        this.directories = resonse.body.directories as Array<IDirectory>
        this.filterdDirectories = this.directories
      })
      this.closePop()
    },
    (error) => {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    })

  }


  showEditPopUP(directory: IDirectory) {
    this.editPopUpFlag = true
    this.directoryToEdit = directory
  }
  editDirectory(){
    this.directoryService.editDirectory(this.directoryToEdit.name, this.editForm.value).subscribe((resonse : any)=>{
      alert(resonse.message)
      this.directoryService.getDirectories(this.page, this.pageSize).subscribe((resonse:any)=>{
        this.directories = resonse.body.directories as Array<IDirectory>
        this.filterdDirectories = this.directories

      })
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


  showDeletePopUp(directory: IDirectory) {
    this.deletePopUpFlag = true
    this.directoryToDelete = directory
  }
  deleteDirectory(){
    this.directoryService.deleteDirectory(this.directoryToDelete.name).subscribe((resonse:any)=>{
        this.directories = this.directories.filter((d) => d.name !== this.directoryToDelete.name);
        this.filterdDirectories = this.directories
      },
      (error: any) => {
        console.log('error', error);
        if (error instanceof HttpErrorResponse) {
          alert(error.error.message);
        } else {
          console.error('Unexpected error:', error)
        }
      }
    );
    this.closePop()
  }

  goPrevious(){
    if(this.page>1){
      this.page--
      this.getDirectories()
    }
  }
  goNext(){
    if(this.page < this.totalPages){
      this.page++
      this.getDirectories()
    }
  }
  goToPage(n: number){
    this.page = n
    this.getDirectories()
  }

}
