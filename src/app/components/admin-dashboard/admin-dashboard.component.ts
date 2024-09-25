import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/userService/user.service';
import { IUser } from '../../Dtos/IUser';
import { LayoutComponent } from '../layout/layout.component';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../services/adminService/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [LayoutComponent, NgIf, PaginationComponent, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{

  userService =  inject(UserService)
  adminService =  inject(AdminService)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  users : Array<IUser> =[]
  filteredUsers: Array<IUser> =[]
  searchTerm: string ='';

  blockPopUpFlag: boolean = false
  unBlockPopUpFlag: boolean = false
  userToBlock!: IUser
  userToUnBlock!: IUser

  userType: any


  page: number = 1
  totalPages!: number
  pageSize: number = 9
  totalRecords!: number
  loading: boolean = false


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((response)=>{
      this.userType = response.get('name')
      this.getUsers()
    })
  }

  getUsers(){
    if(this.userType === 'users'){
      this.adminService.getUnBlockedUsers(this.page, this.pageSize).subscribe((response)=>{
        this.users = response.body.mappedUsers as Array<IUser>
        this.filteredUsers = this.users
        this.totalRecords = response.body.totalCount
        this.totalPages =response.body.totalPages
      })
    }else{
      this.adminService.getBlockedUsers(this.page, this.pageSize).subscribe((response)=>{
        this.users = response.body.mappedUsers as Array<IUser>
        this.filteredUsers = this.users
        this.totalRecords = response.body.totalCount
        this.totalPages =response.body.totalPages
      })
    }
  }

  onSearch(searchValue: string){
    this.searchTerm = searchValue
    if(this.searchTerm){
      if(this.userType === 'users'){
        this.adminService.SearchUnBlockedUsers(this.searchTerm, this.page, this.pageSize).subscribe({
          next: ((result) => this.filteredUsers = result.body.mappedUsers as Array<IUser>),
          error: (error)=> {
            this.filteredUsers = []
            console.log('error', error)
          }
        })
      }
      else{
        this.adminService.SearchBlockedUsers(this.searchTerm, this.page, this.pageSize).subscribe({
          next: (result) => (this.filteredUsers = result.body.mappedUsers as Array<IUser>),
          error: (error) =>{
            this.filteredUsers = []
            console.log('error', error)
          }
        })
      }
    }
    else{
      this.filteredUsers = this.users;
    }
  }

  showBlockPupUp(user:IUser){
    this.blockPopUpFlag = true
    this.userToBlock = user
  }

  blockUser(){
    this.adminService.blockUser(this.userToBlock.email).subscribe((response: any)=>{
      alert(response.message)
      this.users = this.users.filter((user)=> user.email !== this.userToBlock.email)
      this.filteredUsers = this.users
      this.closePop()
    },
  (error)=>{
    if(error instanceof HttpErrorResponse){
      alert(error.error.message)
    }else{
      console.error('Unexpected error:', error);
    }
  })
}

  showUnBlockPupUp(user: IUser){
    this.unBlockPopUpFlag = true
    this.userToUnBlock = user
  }
  unBlockUser(){
    this.adminService.unBlockUser(this.userToUnBlock.email).subscribe((response: any)=>{
      alert(response.message)
      this.users = this.users.filter((user)=> user.email !== this.userToUnBlock.email)
      this.filteredUsers = this.users
      this.closePop()
    },
  (error)=>{
    if(error instanceof HttpErrorResponse){
      alert(error.error.message)
    }else{
      console.error('Unexpected error:', error);
    }
  })
  }


  closePop(){
    this.blockPopUpFlag = false
    this.unBlockPopUpFlag = false
  }

  getUserDirectories(user:IUser){
    this.router.navigateByUrl(`user/${user.email}`);
  }

  goPrevious(){
    if(this.page>1){
      this.page--
      this.getUsers()
    }
  }
  goNext(){
    if(this.page < this.totalPages){
      this.page++
      this.getUsers()
    }
  }
  goToPage(n: number){
    this.page = n
    this.getUsers()
  }
}
