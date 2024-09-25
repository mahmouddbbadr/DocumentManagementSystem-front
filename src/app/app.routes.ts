import { NotFoundComponent } from './components/not-found/not-found.component';
import { ActivatedRoute, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './services/auth/auth.guard';
import { DirectoryComponent } from './components/directory/directory.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SharedDocumentsComponent } from './components/shared-documents/shared-documents.component';
import { UserComponent } from './components/user/user.component';
import { UserDocumentComponent } from './components/user-document/user-document.component';


export const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path:'login', component: LoginComponent
  },
  {
    path:'register', component: RegisterComponent
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]
  },
  {
    path: 'adminDashboard/:name', component: AdminDashboardComponent, canActivate: [authGuard]
  },
  {
    path: 'workSpace/:workSpaceName/:name', component: DirectoryComponent, canActivate: [authGuard]
  },
  {
    path: 'sharedDocuments', component: SharedDocumentsComponent, canActivate: [authGuard]
  },
  {
    path:'profile', component: ProfileComponent, canActivate: [authGuard]
  },
  {
    path: 'user/:email', component: UserComponent, canActivate: [authGuard]
  },
  {
    path: 'user/:email/directory/:name', component: UserDocumentComponent, canActivate: [authGuard]
  },
  {
    path: '**', component: NotFoundComponent, canActivate: [authGuard]
  },

];
