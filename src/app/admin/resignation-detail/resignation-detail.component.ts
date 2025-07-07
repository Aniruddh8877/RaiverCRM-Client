import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { Leavestatus, ResignationStatus, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-resignation-detail',
  templateUrl: './resignation-detail.component.html',
  styleUrls: ['./resignation-detail.component.css']
})
export class ResignationDetailComponent {
 dataLoading: boolean = false;
  ResignationDetailList: any = [];
  ResignationDetail: any = {};
  isSubmitted = false;
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
    ) {}


      ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.GetResignationDetailList();
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
  @ViewChild('formResignationDetail') formResignationDetail: NgForm;
  resetForm() {
    this.ResignationDetail = {
      ResignationStatus: 1,
      Instruction: '',
      StatusUpdatedDate: new Date(),
    };
    if (this.formResignationDetail) {
      this.formResignationDetail.control.markAsPristine();
      this.formResignationDetail.control.markAsUntouched();
    }
    this.isSubmitted = false;
  }

   newLeaveDetail() {
    this.resetForm();
    $('#modal_popup').modal('show');
  }


  
  GetResignationDetailList() {
    const data = {
      CreatedBy: this.staffLogin.StaffLoginId,
      RoleId: this.staffLogin.RoleId
    };

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    };

    this.service.GetResignationDetailList(obj).subscribe((response: any) => {
      if (response.Message === ConstantData.SuccessMessage) {
        this.ResignationDetailList = response.ResignationDetailList;
        console.log('ResignationDetailList:', this.ResignationDetailList);
        
      } else {
        this.toastr.error(response.Message);
      }
    });
  }


    saveResignation() {
      this.isSubmitted = true;
      if (!this.formResignationDetail.valid) return;
  
      const data = {
        ...this.ResignationDetail,
        UpdatedBy: this.staffLogin.StaffLoginId
      };
  
      if (!this.ResignationDetail.ResignationDetailsId) {
        data.CreatedBy = this.staffLogin.StaffLoginId;
        data.CreatedOn = new Date();
      }
  
      const obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(data)).toString()
      };
      this.ResignationDetail.StatusUpdatedDate = this.loadData.loadDateYMD(this.ResignationDetail.StatusUpdatedDate);
      // this.ResignationDetail.ResignationDate = this.loadData.loadDateYMD(this.ResignationDetail.ResignationDate);
      this.ResignationDetail.JoiningDate = this.loadData.loadDateYMD(this.ResignationDetail.JoiningDate);
      this.ResignationDetail.DepatureDate = this.loadData.loadDateYMD(this.ResignationDetail.DepatureDate);
  
      this.service.SaveResignationDetail(obj).subscribe((res: any) => {
        if (res.Message === ConstantData.SuccessMessage) {
          this.toastr.success('Leave detail saved.');
          this.GetResignationDetailList();
          $('#modal_popup').modal('hide');
        } else {
          this.toastr.error(res.Message);
        }
      });
    }
  

     editResignationDetail(obj: any) {
    this.resetForm();
    this.ResignationDetail = { ...obj };

    // If dates are in string format, convert to Date object for Angular Material DatePicker
    if (this.ResignationDetail.LeaveDateFrom) {
      this.ResignationDetail.LeaveDateFrom = new Date(this.ResignationDetail.LeaveDateFrom);
    }
    if (this.ResignationDetail.LeaveDateTo) {
      this.ResignationDetail.LeaveDateTo = new Date(this.ResignationDetail.LeaveDateTo);
    }

    $('#modal_popup').modal('show');
  }
}
