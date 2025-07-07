import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { ResignationStatus, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-resignation-request',
  templateUrl: './resignation-request.component.html',
  styleUrls: ['./resignation-request.component.css']
})
export class ResignationRequestComponent {
 dataLoading: boolean = false
  ResignationList: any = []
  Resignation: any = {}
  isSubmitted = false
  StatusList = this.loadData.GetEnumList(ResignationStatus);
  AllStatusList = ResignationStatus;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  userDetail: any = {};
  action: ActionModel = {} as ActionModel;
 staffLogin: StaffLoginModel = {} as StaffLoginModel;

 constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

   ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getResignationList();
    this.resetForm();
  }

validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }


  @ViewChild('formResignation') formResignation: NgForm;
  resetForm() {
    this.Resignation = {};
    if (this.formResignation) {
      this.formResignation.control.markAsPristine();
      this.formResignation.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.Resignation.Status = 1
  }

newResignation() {
    this.resetForm();
    $('#modal_popup').modal('show')
  }



 getResignationList() {
   var data = {
      StaffId: this.staffLogin.StaffId,
      RoleId : this.staffLogin.RoleId,


    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    this.dataLoading = true
    this.service.getResignationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ResignationList = response.ResignationList;
        console.log(this.ResignationList);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  
  SaveResignation() {
    
    this.formResignation.control.markAllAsTouched();
    this.isSubmitted = true
    if (this.formResignation.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.Resignation.JoinDate = this.loadData.loadDateYMD(this.Resignation.JoinDate);
    this.Resignation.DepatureDate = this.loadData.loadDateYMD(this.Resignation.DepatureDate);
    this.Resignation.UpdatedBy = this.staffLogin.StaffId;
    this.Resignation.staffId = this.staffLogin.StaffId;
    console.log(this.Resignation);
     this.Resignation.CreatedBy = this.staffLogin.StaffLoginId;
    var payload={
      GetResignation: this.Resignation,
    }
    
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    }
    this.dataLoading = true;
    this.service.SaveResignation(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Resignation.ResignationId > 0) {
          this.toastr.success("Lead Category Updated successfully")
          $('#modal_popup').modal('hide')
        } else {
          this.toastr.success("Lead Category added successfully")
        }
        this.resetForm()
        this.getResignationList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }


 editResignation(obj: any) {
    this.resetForm()
    this.Resignation = obj;
    $('#modal_popup').modal('show');
  }

















}
