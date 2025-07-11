import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantData } from './constant-data';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly apiUrl: string = ConstantData.getApiUrl();
  private readonly baseUrl: string = ConstantData.getBaseUrl();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getAdminKey() });

  constructor(private http: HttpClient) {
  }

  getLeadCategoryList(obj: any) {
    return this.http.post(this.apiUrl + "LeadCategroy/LeadCategoryList", obj, { headers: this.headers })
  }
  SaveLeadCategory(obj: any) {
    return this.http.post(this.apiUrl + "LeadCategroy/SaveLeadCategory", obj, { headers: this.headers })
  }
  DeleteLeadCategory(obj: any) {
    return this.http.post(this.apiUrl + "LeadCategroy/DeleteLeadCategory", obj, { headers: this.headers })
  }
  ///////////////////////////////////////////////

  getLeadAssignList(obj: any) {
    return this.http.post(this.apiUrl + "LeadAssign/LeadAssignList", obj, { headers: this.headers })
  }
  SaveLeadAssign(obj: any) {
    return this.http.post(this.apiUrl + "LeadAssign/SaveLeadAssign", obj, { headers: this.headers })
  }
  DeleteLeadAssign(obj: any) {
    return this.http.post(this.apiUrl + "LeadAssign/DeleteLeadAssign", obj, { headers: this.headers })
  }
  getLeadAssignListByStaff(obj: any) {
    return this.http.post(this.apiUrl + "LeadAssign/LeadAssignListByStaff", obj, { headers: this.headers })
  }

  /////////////////////////////////////////////////////

  getLeadDetailsList(obj: any) {
    return this.http.post(this.apiUrl + "LeadDetial/LeadDetailList", obj, { headers: this.headers })
  }
  SaveLeadDetail(obj: any) {
    return this.http.post(this.apiUrl + "LeadDetial/SaveLeadDetail", obj, { headers: this.headers })
  }

  /////////////////////////////////////////////////////

  SaveLeaveRequest(obj: any) {
    return this.http.post(this.apiUrl + "LeaveRequest/SaveLeaveRequest", obj, { headers: this.headers })
  }

  getLeaveRequestList(obj: any) {
    return this.http.post(this.apiUrl + "LeaveRequest/LeaveRequestList", obj, { headers: this.headers });
  }


  /////////////////////////////////////////////////////
  getLeaveDetailList(obj: any) {
    return this.http.post(this.apiUrl + "LeaveDetail/LeaveDetailList", obj, { headers: this.headers });
  }

  UpdateLeaveDetail(obj: any) {
    return this.http.post(this.apiUrl + "LeaveDetail/UpdateLeaveDetail", obj, { headers: this.headers });
  }

  /////////////////////////////////////////////////////
  
  getResignationList(obj: any) {
    return this.http.post(this.apiUrl + "ResignationRequest/ResignationList", obj, { headers: this.headers });
  }

  SaveResignation(obj: any) {
    return this.http.post(this.apiUrl + "ResignationRequest/SaveResignation", obj, { headers: this.headers });
  }
  
  /////////////////////////////////////////////////////

  GetResignationDetailList(obj: any) {
    return this.http.post(this.apiUrl + "ResignationDetail/ResignationDetailList", obj, { headers: this.headers });
  } 

  SaveResignationDetail(obj: any) {
    return this.http.post(this.apiUrl + "ResignationDetail/SaveResignationDetail", obj, { headers: this.headers });
  }

  /////////////////////////////////////////////////

  GetSalaryManagementList(obj: any) {
    return this.http.post(this.apiUrl + "SalaryManagement/SalaryManagementList", obj, { headers: this.headers });
  }
  SaveSalaryManagement(obj: any) {
    return this.http.post(this.apiUrl + "SalaryManagement/SaveSalaryManagement", obj, { headers: this.headers });
  }
  /////////////////////////////////////////////////
  
  GetNoticList(obj: any) {
    return this.http.post(this.apiUrl + "Notice/NoticeList", obj, { headers: this.headers });
  }
  SaveNotice(obj: any) {
    return this.http.post(this.apiUrl + "Notice/SaveNotice", obj, { headers: this.headers });
  }
  DeleteNotice(obj: any) {
    return this.http.post(this.apiUrl + "Notice/DeleteNotice", obj, { headers: this.headers });
  }
  
  /////////////////////////////////////////////////
  getImageUrl(): string {
    return ConstantData.getBaseUrl();
  }

  // District
  getDistrictList(obj: any) {
    return this.http.post(this.apiUrl + "District/DistrictList", obj, { headers: this.headers })
  }

  saveDistrict(obj: any) {
    return this.http.post(this.apiUrl + "District/saveDistrict", obj, { headers: this.headers })
  }

  deleteDistrict(obj: any) {
    return this.http.post(this.apiUrl + "District/deleteDistrict", obj, { headers: this.headers })
  }

  // Company
  getCompanyList(obj: any) {
    return this.http.post(this.apiUrl + "Company/CompanyList", obj, { headers: this.headers })
  }

  saveCompany(obj: any) {
    return this.http.post(this.apiUrl + "Company/saveCompany", obj, { headers: this.headers })
  }

  deleteCompany(obj: any) {
    return this.http.post(this.apiUrl + "Company/deleteCompany", obj, { headers: this.headers })
  }

  // Designation 
  getDesignationList(obj: any) {
    return this.http.post(this.apiUrl + "Designation/DesignationList", obj, { headers: this.headers })
  }

  saveDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/saveDesignation", obj, { headers: this.headers })
  }

  deleteDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/deleteDesignation", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Department
  getDepartmentList(obj: any) {
    return this.http.post(this.apiUrl + "Department/DepartmentList", obj, { headers: this.headers })
  }

  saveDepartment(obj: any) {
    return this.http.post(this.apiUrl + "Department/saveDepartment", obj, { headers: this.headers })
  }

  deleteDepartment(obj: any) {
    return this.http.post(this.apiUrl + "Department/deleteDepartment", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // Staff
  getStaffList(obj: any) {
    return this.http.post(this.apiUrl + "Staff/StaffList", obj, { headers: this.headers })
  }

  saveStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/saveStaff", obj, { headers: this.headers })
  }

  deleteStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/deleteStaff", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // Staff Login
  StaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLogin", obj, { headers: this.headers })
  }

  getStaffLoginList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLoginList", obj, { headers: this.headers })
  }

  saveStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/saveStaffLogin", obj, { headers: this.headers })
  }

  deleteStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/deleteStaffLogin", obj, { headers: this.headers })
  }

  changePassword(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/changePassword", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //PageGroup
  getPageGroupList(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/PageGroupList", obj, { headers: this.headers })
  }

  savePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/savePageGroup", obj, { headers: this.headers })
  }

  deletePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/deletePageGroup", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Page
  getPageList(obj: any) {
    return this.http.post(this.apiUrl + "Page/PageList", obj, { headers: this.headers })
  }

  savePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/savePage", obj, { headers: this.headers })
  }

  deletePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/deletePage", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Menu
  getUserMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/UserMenuList", obj, { headers: this.headers })
  }

  validiateMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/ValidiateMenu", obj, { headers: this.headers })
  }

  getMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuList", obj, { headers: this.headers })
  }

  saveMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/saveMenu", obj, { headers: this.headers })
  }

  deleteMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/deleteMenu", obj, { headers: this.headers })
  }

  menuUp(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuUp", obj, { headers: this.headers })
  }

  menuDown(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuDown", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Role
  getRoleList(obj: any) {
    return this.http.post(this.apiUrl + "Role/RoleList", obj, { headers: this.headers })
  }

  saveRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/saveRole", obj, { headers: this.headers })
  }

  deleteRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/deleteRole", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //RoleMenu
  getRoleMenuList(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/AllRoleMenuList", obj, { headers: this.headers })
  }

  saveRoleMenu(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/saveRoleMenu", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //StaffLoginRole
  getStaffLoginRoleList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/StaffLoginRoleList", obj, { headers: this.headers })
  }

  saveStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/saveStaffLoginRole", obj, { headers: this.headers })
  }

  deleteStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/deleteStaffLoginRole", obj, { headers: this.headers })
  }

  //State
  getStateList(obj: any) {
    return this.http.post(this.apiUrl + "State/StateList", obj, { headers: this.headers })
  }

  saveState(obj: any) {
    return this.http.post(this.apiUrl + "State/saveState", obj, { headers: this.headers })
  }

  deleteState(obj: any) {
    return this.http.post(this.apiUrl + "State/deleteState", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //City
  getCityList(obj: any) {
    return this.http.post(this.apiUrl + "City/CityList", obj, { headers: this.headers })
  }

  saveCity(obj: any) {
    return this.http.post(this.apiUrl + "City/saveCity", obj, { headers: this.headers })
  }

  deleteCity(obj: any) {
    return this.http.post(this.apiUrl + "City/deleteCity", obj, { headers: this.headers })
  }
}
