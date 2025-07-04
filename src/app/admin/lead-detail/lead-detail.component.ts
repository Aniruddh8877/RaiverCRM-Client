import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { LeadStatus, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export class LeadDetailComponent {
  dataLoading: boolean = false
  LeadAssignList: any = [];
  LeadAssign: any = {};
  isSubmitted = false
  StatusList = this.loadData.GetEnumList(LeadStatus);
  AllStatusList = LeadStatus;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  userDetail: any = {};
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  LeadCategoryList: any = [];
  Filter: any = {};
  leadList: any[] = [];
  LeadDetails: any = {
    LeadName: '',
    LeadMobileNo: '',
    LeadComment: ''
  };
  LeadDetailList: any[] = [];
  LeadDetail: any = {}
  LeadList: any = {};
  redUrl: string = '';

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.LeadAssign.StaffId = this.staffLogin.StaffId;
    this.validiateMenu();
    this.route.paramMap.subscribe((params: any) => {
      var id = params.get('id');

      if (id) {
        this.getLeadDetailsList(id);
      }
      else {
        this.getLeadDetailsList(0);

      }
    });
    this.resetForm();
  }

  validiateMenu() {

    var urls = this.router.url.split("/");
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: `/${urls[1]}` + `/${urls[2]}`, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formLeadDetail') formLeadDetail: NgForm;
  resetForm() {
    this.LeadDetail = {
      LeadName: '',
      LeadMobileNo: '',
      LeadComment: '',
      Comment: '',
      LeadStatus: 1,
      FollowUpDate: new Date(),
    };
    if (this.formLeadDetail) {
      this.formLeadDetail.resetForm();
    }
  }

  newLeadAssign(item: any) {
    this.LeadDetail = { ...item };
    $('#modal_popup').modal('show');
  }


  editLeadAssign(obj: any) {
    console.log("Editing Lead Assign with object:", obj);
    this.resetForm();
    this.LeadDetail = { ...obj };
    if (this.LeadDetail.LeadDate) {
      this.LeadDetail.LeadDate = new Date(this.LeadDetail.LeadDate);
    }
    $('#modal_popup').modal('show');
  }



  getLeadDetailsList(leadId: any) {
    //  console.log("Calling getLeadDetailsList with LeadId:", leadId);  
    if (!leadId) {
      this.toastr.error("Lead Id not found!");
      return;
    }

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ LeadId: leadId })).toString()
    };

    this.dataLoading = true;

    this.service.getLeadDetailsList(obj).subscribe(
      (r1: any) => {
        let response = r1;
        if (response.Message === ConstantData.SuccessMessage) {
          this.LeadDetailList = response.LeadDeatilList;
          console.log("Fetched Lead Detail List:", this.LeadDetailList);
        } else {
          this.toastr.error(response.Message);
        }
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error("Error while fetching records");
        this.dataLoading = false;
      }
    );
  }

  SaveLeadDetail() {
    this.formLeadDetail.control.markAllAsTouched();

    if (!this.LeadDetail.LeadName) {
      this.toastr.error('Please fill NAME required fields!');
      return;
    }
    if (!this.LeadDetail.LeadMobileNo) {
      this.toastr.error('Please fill NAME required fields!');
      return;
    }
    if (!this.LeadDetail.LeadComment) {
      this.toastr.error('Please fill NAME required fields!');
      return;
    }
    if (!this.LeadDetail.LeadStatus) {
      this.toastr.error('Please fill NAME required fields!');
      return;
    }
    if (!this.LeadDetail.Comment) {
      this.toastr.error('Please fill NAME required fields!');
      return;
    }
    console.log("Saving Lead Detail with details:", this.LeadDetail);
    this.LeadDetail.FollowUpDate = this.loadData.loadDateYMD(this.LeadDetail.FollowUpDate);

    let payload = {
      request: this.localService.encrypt(JSON.stringify(this.LeadDetail)).toString()
    };

    this.dataLoading = true;
    this.service.SaveLeadDetail(payload).subscribe((response: any) => {
      if (response.Message === ConstantData.SuccessMessage) {
        this.toastr.success(this.LeadDetail.LeadDetailId > 0 ? 'Lead Detail Updated' : 'Lead Detail Added');
        $('#modal_popup').modal('hide');
        this.getLeadDetailsList(this.LeadDetail.LeadId); // Refresh table
        this.resetForm();
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err) => {
      this.toastr.error('Error while saving Lead Detail');
      this.dataLoading = false;
    });
  }

}
