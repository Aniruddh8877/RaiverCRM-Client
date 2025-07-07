import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent {

  dataLoading: boolean = false
  isSubmitted = false
  StatusList = this.loadData.GetEnumList(Status);
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  StaffList: any[] = []; 

  NoticeList: any[] = []; // Assuming you have a NoticeList to display notices
  Notice: any = {}; // Assuming you have a Notice object to hold notice details


constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService:LocalService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.GetNoticList();
    this.getStaffList();
    this.Notice.Noticedate=new Date()
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
  @ViewChild('formNotice') formNotice: NgForm;
  resetForm() {
    this.Notice = {};
    if (this.formNotice) {
      this.formNotice.control.markAsPristine();
      this.formNotice.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.Notice.NoticeStatus = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

   GetNoticList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ })).toString()
    }
    this.dataLoading = true
    this.service.GetNoticList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.NoticeList = response.NoticeList;
        console.log("NoticeList", this.NoticeList);
        
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }


    SaveNotice() {
      this.isSubmitted = true;
      this.formNotice.control.markAllAsTouched();
     this.Notice.NoticeDate = this.loadData.loadDateYMD(this.Notice.Noticedate);
      this.Notice.CreatedBy = this.staffLogin.StaffLoginId;
      this.Notice.UpdatedBy = this.staffLogin.StaffLoginId;
      if (this.formNotice.invalid) {
        this.toastr.error("Fill all the required fields !!")
        return
      }
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(this.Notice)).toString()
      }
      this.service.SaveNotice(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          if (this.Notice.NoticeId > 0) {
            this.toastr.success("Notice detail updated successfully")
            $('#staticBackdrop').modal('hide')
          } else {
            this.toastr.success("Notice added successfully")
          }
          this.resetForm()
          this.GetNoticList()
        } else {
          this.toastr.error(response.Message)
        }
      }, (err => {
        this.toastr.error("Error occured while submitting data")
      }))
    }
  
    DeleteNotice(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.service.DeleteNotice(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.GetNoticList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false
      }))
    }
  }

    editNotice(obj: any) {
    this.resetForm()
    this.Notice = obj

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



}
