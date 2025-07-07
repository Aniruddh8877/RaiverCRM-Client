import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { Leavestatus, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.css']
})
export class LeaveDetailComponent {
  dataLoading: boolean = false;
  LeaveDetailList: any = [];
  LeaveDetail: any = {};
  isSubmitted = false;
  StatusList = this.loadData.GetEnumList(Leavestatus);
  AllStatusList = Leavestatus;
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
    this.getLeaveDetailList();
    this.resetForm();
  }

  validiateMenu() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        Url: this.router.url,
        StaffLoginId: this.staffLogin.StaffLoginId
      })).toString()
    };
    this.dataLoading = true;
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router);
      this.dataLoading = false;
    }, () => {
      this.toastr.error("Error while fetching records");
      this.dataLoading = false;
    });
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  @ViewChild('formLeaveDetail') formLeaveDetail: NgForm;
  resetForm() {
    this.LeaveDetail = {
      LeaveStatus: 1,
      Opinion: '',
      StatusUpdatedDate: new Date(),
    };
    if (this.formLeaveDetail) {
      this.formLeaveDetail.control.markAsPristine();
      this.formLeaveDetail.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }

  newLeaveDetail() {
    this.resetForm();
    $('#modal_popup').modal('show');
  }



  getLeaveDetailList() {
    const data = {
      CreatedBy: this.staffLogin.StaffLoginId,
      RoleId: this.staffLogin.RoleId
    };

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    };

    this.service.getLeaveDetailList(obj).subscribe((response: any) => {
      if (response.Message === ConstantData.SuccessMessage) {
        this.LeaveDetailList = response.LeaveDetailList;
        console.log('LeaveDetailList:', this.LeaveDetailList);

      } else {
        this.toastr.error(response.Message);
      }
    });
  }

  saveLeaveDetail() {
    this.isSubmitted = true;
    if (!this.formLeaveDetail.valid) return;
this.LeaveDetail.LeaveDateFrom = this.loadData.loadDateYMD(this.LeaveDetail.LeaveDateFrom);
    this.LeaveDetail.LeaveDateTo = this.loadData.loadDateYMD(this.LeaveDetail.LeaveDateTo);
    this.LeaveDetail.StatusUpdatedDate = this.loadData.loadDateYMD(this.LeaveDetail.StatusUpdatedDate);
    const data = {
      ...this.LeaveDetail,
      UpdatedBy: this.staffLogin.StaffLoginId
    };

    if (!this.LeaveDetail.LeaveDetailsId) {
      data.CreatedBy = this.staffLogin.StaffLoginId;
      data.CreatedOn = new Date();
    }

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    };

    this.service.UpdateLeaveDetail(obj).subscribe((res: any) => {
      if (res.Message === ConstantData.SuccessMessage) {
        this.toastr.success('Leave detail saved.');
        this.getLeaveDetailList();
        $('#modal_popup').modal('hide');
      } else {
        this.toastr.error(res.Message);
      }
    });
  }


  editLeaveDetail(obj: any) {
    this.resetForm();
    this.LeaveDetail = { ...obj };

    // If dates are in string format, convert to Date object for Angular Material DatePicker
    if (this.LeaveDetail.LeaveDateFrom) {
      this.LeaveDetail.LeaveDateFrom = new Date(this.LeaveDetail.LeaveDateFrom);
    }
    if (this.LeaveDetail.LeaveDateTo) {
      this.LeaveDetail.LeaveDateTo = new Date(this.LeaveDetail.LeaveDateTo);
    }

    $('#modal_popup').modal('show');
  }

}
