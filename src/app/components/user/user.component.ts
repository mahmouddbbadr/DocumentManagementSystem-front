import { AdminService } from './../../services/adminService/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { IDirectory } from '../../Dtos/IDirectory';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LayoutComponent, PaginationComponent, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  activatedRoute = inject(ActivatedRoute)
  adminService = inject(AdminService)
  router = inject(Router)

  directories: Array<IDirectory> = [];
  filterdDirectories: Array<IDirectory> =[]
  searchTerm: string ='';
  email!: string

  page: number = 1
  totalPages!: number
  pageSize: number = 9
  totalRecords!: number
  loading: boolean = false

  ngOnInit(): void {
    this.email =  this.activatedRoute.snapshot.paramMap.get('email') as string
    this.getUserDirectories()
  }

  getUserDirectories(){
    this.adminService.getUserDirectories(this.email, this.page, this.pageSize).subscribe((response)=>{
      this.directories = response.body.directories as Array<IDirectory>
      this.filterdDirectories = this.directories
      this.totalRecords = response.body.totalCount
      this.totalPages =response.body.totalPages
    })
  }
  onSearch(searchValue: string){
    this.searchTerm = searchValue
    if(this.searchTerm){
      this.filterdDirectories= this.directories.filter(d=> d.name.toLowerCase().startsWith(this.searchTerm.toLocaleLowerCase()))
    }else{
      this.filterdDirectories = this.directories;
    }

  }

  openDirectory(directory: IDirectory){
    this.router.navigateByUrl(`user/${this.email}/directory/${directory.name}`)
  }

  goPrevious(){
    if(this.page>1){
      this.page--
      this.getUserDirectories()
    }
  }
  goNext(){
    if(this.page < this.totalPages){
      this.page++
      this.getUserDirectories()
    }
  }
  goToPage(n: number){
    this.page = n
    this.getUserDirectories()
  }

}
