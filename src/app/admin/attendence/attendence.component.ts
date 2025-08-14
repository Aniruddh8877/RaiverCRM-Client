import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { Status } from '../../utils/enum';
import { ActionModel, RequestModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent {
 dataLoading: boolean = false
  AttendanceList: any = []
  Designation: any = {}
  isSubmitted = false
  StatusList = this.loadData.GetEnumList(Status);
  AllStatusList = Status;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  userDetail: any = {};
  action: ActionModel = {} as ActionModel;
  Attendence: { StaffId?: number } = {};

   constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

date: Date = new Date();
 ngOnInit(): void {
    this.userDetail = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getAttendenceList();
      setInterval(() => {
    this.date = new Date();
  }, 1000);
  }

validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.userDetail.StaffLoginId })).toString()
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
@ViewChild('formAttendence') formAttendence: NgForm;
  resetForm() {
    this.Attendence = {};
    if (this.formAttendence) {
      this.formAttendence.control.markAsPristine();
      this.formAttendence.control.markAsUntouched();
    }
    this.isSubmitted = false
    // this.Attendence.Status = 1
  }

 getAttendenceList() {
  var data = {
    StaffId: this.Attendence.StaffId
  };

  var obj: RequestModel = {
    request: this.localService.encrypt(JSON.stringify(data)).toString()
  };

  this.dataLoading = true;
  this.service.getAttendanceList(obj).subscribe(r1 => {
    let response = r1 as any;
    if (response.Message == ConstantData.SuccessMessage) {
      this.AttendanceList = response.AttendenceList;

      // Show current date
      console.log(this.AttendanceList, "this is attendance list");
    } else {
      this.toastr.error(response.Message);
    }
    this.dataLoading = false;
  }, (err => {
    this.toastr.error("Error while fetching records");
  }));
}








































}
