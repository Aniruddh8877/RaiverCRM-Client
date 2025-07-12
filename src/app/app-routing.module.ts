import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { DesignationComponent } from './admin/designation/designation.component';
import { DepartmentComponent } from './admin/department/department.component';
import { StaffComponent } from './admin/staff/staff.component';
import { StaffLoginComponent } from './admin/staff-login/staff-login.component';
import { PageGroupComponent } from './admin/page-group/page-group.component';
import { PageComponent } from './admin/page/page.component';
import { MenuComponent } from './admin/menu/menu.component';
import { RoleComponent } from './admin/role/role.component';
import { RoleMenuComponent } from './admin/role-menu/role-menu.component';
import { StateComponent } from './admin/state/state.component';
import { CityComponent } from './admin/city/city.component';
import { ChangePasswordComponent } from './admin/change-password/change-password.component';
import { CompanyComponent } from './admin/company/company.component';
import { LeadCategoryComponent } from './admin/lead-category/lead-category.component';
import { LeadAssignComponent } from './admin/lead-assign/lead-assign.component';
import { LeadDetailComponent } from './admin/lead-detail/lead-detail.component';
import { LeaveRequestComponent } from './admin/leave-request/leave-request.component';
import { LeaveDetailComponent } from './admin/leave-detail/leave-detail.component';
import { ResignationRequestComponent } from './admin/resignation-request/resignation-request.component';
import { ResignationDetailComponent } from './admin/resignation-detail/resignation-detail.component';
import { SalalyManagementComponent } from './admin/salaly-management/salaly-management.component';
import { NoticeComponent } from './admin/notice/notice.component';

const routes: Routes = [
  { path: '', redirectTo: "/admin-login", pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin', component: AdminMasterComponent, children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'designation', component: DesignationComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'staffLogin', component: StaffLoginComponent },
      { path: 'page-group', component: PageGroupComponent },
      { path: 'page', component: PageComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'role', component: RoleComponent },
      { path: 'role-menu', component: RoleMenuComponent },
      { path: 'role-menu/:id', component: RoleMenuComponent },
      { path: 'state', component: StateComponent },
      { path: 'city', component: CityComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'company', component: CompanyComponent },
      {path:'LeadCategory',component:LeadCategoryComponent},
      {path:'LeadAssign',component:LeadAssignComponent},
      {path:'LeadDetail',component:LeadDetailComponent},
      {path:'LeadDetail/:id',component:LeadDetailComponent},
      {path:'LeaveRequest',component:LeaveRequestComponent},
      {path:'LeaveDetail',component:LeaveDetailComponent},
      {path:'ResignationRequest',component:ResignationRequestComponent},
      {path:'ResignationDetail',component:ResignationDetailComponent},
      {path:'Notice',component:NoticeComponent},
      {path:'SalalyManagement',component:SalalyManagementComponent},
      
    ]
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
