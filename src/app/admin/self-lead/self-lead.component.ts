import { Component, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';
import { Gender, PaymentMode, SelfLeadStatus, StaffType, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-self-lead',
  templateUrl: './self-lead.component.html',
  styleUrls: ['./self-lead.component.css']
})
export class SelfLeadComponent {
 dataLoading: boolean = false
  StaffList: any = []
  SelfLead: any = {}
  isSubmitted = false
  DepartmentList: any = []
  DesignationList: any = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  SelfLeadStatusList = this.loadDataService.GetEnumList(SelfLeadStatus);
  GenderList = this.loadDataService.GetEnumList(Gender);
  StaffTypeList = this.loadDataService.GetEnumList(StaffType);
  PaymentModeList = this.loadDataService.GetEnumList(PaymentMode)
  AllPaymentModeList = PaymentMode
  AllStatusList = SelfLeadStatus;
  AllGenderList = Gender;
  AllStaffTypeList = StaffType;
  SelfLeadList: any=[];
  LeadCategoryList: any;

    sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

    onTableDataChange(p: any) {
    this.p = p
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

    ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSelfLeadList();
    // this.canShowEditButton();
    this.getLeadCategory();
    this.getStaffList();

  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

    @ViewChild('formSelfLead') formSelfLead: NgForm;
  resetForm() {
    this.SelfLead = {};
    this.SelfLead.LeadDate = new Date();
    this.SelfLead.SelfLeadStatus = 1
    if (this.formSelfLead) {
      this.formSelfLead.control.markAsPristine();
      this.formSelfLead.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  getStaffList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.getStaffList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffList = response.StaffList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getLeadCategory() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.getLeadCategoryList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.LeadCategoryList = response.LeadCategoryList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getSelfLeadList() {
    var data={
      StaffId:this.staffLogin.StaffId,
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    this.dataLoading = true
    this.service.getSelfLeadList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SelfLeadList = response.SelfLeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveSelfLead() {
      this.isSubmitted = true;
      this.formSelfLead.control.markAllAsTouched();
      if (this.formSelfLead.invalid) {
        this.toastr.error("Fill all the required fields !!")
        return
      }
  
      this.SelfLead.LeadDate = this.loadDataService.loadDateTime(this.SelfLead.LeadDate);
      this.SelfLead.UpdatedBy = this.staffLogin.StaffLoginId;
      this.SelfLead.CreatedBy = this.staffLogin.StaffLoginId;
      this.SelfLead.StaffId = this.staffLogin.StaffId;
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(this.SelfLead)).toString()
      }
      this.dataLoading = true;
      this.service.saveSelfLead(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          if (this.SelfLead.SelfLeadId > 0) {
            this.toastr.success("Staff detail updated successfully")
  
          } else {
            this.toastr.success("Staff added successfully")
          }
         
          this.resetForm()
          this.getSelfLeadList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
        }
      }, (err => {
        this.toastr.error("Error occured while submitting data")
        this.dataLoading = false;
      }))
    }


    editSelfLead(obj: any) {
    this.resetForm()
    this.SelfLead = obj;
    this.SelfLead.LeadDate = new Date(obj.LeadDate);
    
  }

  onPaymentModeChange(mode: number): void {
  if (mode !== 2) this.SelfLead.TransactionNo = null;
  if (mode !== 3) this.SelfLead.AccountNo = null;
}

canShowEditButton(): boolean {
  return this.action.CanEdit && this.staffLogin.StaffId === 5;
}


}
