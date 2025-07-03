import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { Leavestatus, LeaveType, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent {
  dataLoading: boolean = false;
  LeaveRequestList: any = [];
  LeaveRequest: any = {};
  isSubmitted = false;
  StatusList = this.loadData.GetEnumList(Status);
  LeaveTypeList = this.loadData.GetEnumList(LeaveType);
  LeavestatusList = this.loadData.GetEnumList(Leavestatus);
  AllStatusList = Status;
  AllLeaveType = LeaveType;
  AllLeavestatus = Leavestatus;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  userDetail: any = {};
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  @ViewChild('formLeaveRequest') formLeaveRequest: NgForm;
  LeaveList: any=[]

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.LeaveRequest.StaffId = this.staffLogin.StaffId;
    this.validateMenu();
    this.getLeaveRequestList();
    this.resetForm();
  }

  validateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        Url: this.router.url,
        StaffLoginId: this.staffLogin.StaffLoginId
      })).toString()
    }
    this.dataLoading = true;
    this.service.validiateMenu(obj).subscribe(response => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router);
      this.dataLoading = false;
    }, err => {
      this.toastr.error("Error while fetching menu validation");
      this.dataLoading = false;
    });
  }

  sort(key: string) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  resetForm() {
    this.LeaveRequest = {};
    if (this.formLeaveRequest) {
      this.formLeaveRequest.control.markAsPristine();
      this.formLeaveRequest.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }

  newLeaveRequest() {
    this.resetForm();
    $('#modal_popup').modal('show');
  }



  SaveLeaveRequest() {
    this.formLeaveRequest.control.markAllAsTouched();
    this.isSubmitted = true;

    if (this.formLeaveRequest.invalid) {
      this.toastr.error("Please fill all required fields!");
      return;
    }

    this.LeaveRequest.CreatedBy = this.staffLogin.StaffLoginId;
    this.LeaveRequest.StaffId = this.staffLogin.StaffId;
    this.LeaveRequest.LeaveDateFrom = this.loadData.loadDateYMD(this.LeaveRequest.LeaveDateFrom);
    this.LeaveRequest.LeaveDateTo = this.loadData.loadDateYMD(this.LeaveRequest.LeaveDateTo);

    var payload = {
      GetLeaveRequest: this.LeaveRequest,
      // GetLeaveDetails: this.LeaveList
    };

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    };

    this.dataLoading = true;
    this.service.SaveLeaveRequest(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.LeaveRequest.LeaveId > 0) {
          this.toastr.success("Leave request updated successfully");
        } else {
          this.toastr.success("Leave request submitted successfully");
        }
        $('#modal_popup').modal('hide');
        this.resetForm();
        this.getLeaveRequestList();
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, err => {
      this.toastr.error("Error while submitting data");
      this.dataLoading = false;
    });
  }

  editLeaveRequest(obj: any) {
    this.resetForm();
    this.LeaveRequest = { ...obj };

    // Convert date strings to Date objects (for Angular Material Datepicker compatibility)
    if (this.LeaveRequest.LeaveDateFrom) {
      this.LeaveRequest.LeaveDateFrom = new Date(this.LeaveRequest.LeaveDateFrom);
    }
    if (this.LeaveRequest.LeaveDateTo) {
      this.LeaveRequest.LeaveDateTo = new Date(this.LeaveRequest.LeaveDateTo);
    }

    // Calculate No of Days on edit
    this.onDateChange();

    // Open modal
    $('#modal_popup').modal('show');
  }

  onDateChange() {
    if (this.LeaveRequest.LeaveDateFrom && this.LeaveRequest.LeaveDateTo) {
      const fromDate = new Date(this.LeaveRequest.LeaveDateFrom);
      const toDate = new Date(this.LeaveRequest.LeaveDateTo);

      const timeDiff = toDate.getTime() - fromDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both dates

      this.LeaveRequest.NoOfDays = daysDiff > 0 ? daysDiff : 0;
    }
  }





  getLeaveRequestList() {
  var data = {
      StaffId: this.staffLogin.StaffId,

    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }

  this.dataLoading = true;
  this.service.getLeaveRequestList(obj).subscribe(response => {
    let res = response as any;
    if (res.Message == ConstantData.SuccessMessage) {
      this.LeaveRequestList = res.LeaveRequestList;
      console.log("LeaveRequestList", this.LeaveRequestList);
      
    } else {
      this.toastr.error(res.Message);
    }
    this.dataLoading = false;
  }, err => {
    this.toastr.error("Error while fetching records");
    this.dataLoading = false;
  });
}


}
