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
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent  {
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
  Notice: any = {}; 
  baseUrl = ConstantData.baseUrl;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.GetNoticList();
  }

 

      GetNoticList() {
    const data = {
      StaffId: this.staffLogin.StaffId, // ✅ Sending StaffId to API
    };

    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    };

    this.dataLoading = true;

    this.service.GetNoticList(obj).subscribe({
      next: (r1: any) => {
        if (r1.Message === ConstantData.SuccessMessage) {
          this.NoticeList = r1.NoticeList;
          console.log("✅ NoticeList fetched: of Admin dashboard compnenet", this.NoticeList);
        } else {
          this.toastr.error(r1.Message || 'Unknown error occurred');
        }
        this.dataLoading = false;
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.toastr.error("Error while fetching records");
        this.dataLoading = false;
      }
    });
  }

}
