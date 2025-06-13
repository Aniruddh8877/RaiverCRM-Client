import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-lead-category',
  templateUrl: './lead-category.component.html',
  styleUrls: ['./lead-category.component.css']
})
export class LeadCategoryComponent {
 dataLoading: boolean = false
  LeadCategoryList: any = []
  LeadCategory: any = {}
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
    this.getLeadCategoryList();
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



  @ViewChild('formLeadCategory') formLeadCategory: NgForm;
  resetForm() {
    this.LeadCategory = {};
    if (this.formLeadCategory) {
      this.formLeadCategory.control.markAsPristine();
      this.formLeadCategory.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.LeadCategory.Status = 1
  }

newLeadCategory() {
    this.resetForm();
    $('#modal_popup').modal('show')
  }


 getLeadCategoryList() {
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
    }))
  }

SaveLeadCategory() {

    this.formLeadCategory.control.markAllAsTouched();
    this.isSubmitted = true
    if (this.formLeadCategory.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
     this.LeadCategory.CreatedBy = this.staffLogin.StaffLoginId;
    this.LeadCategory.UpdatedBy = this.staffLogin.StaffLoginId;
    console.log(this.LeadCategory);
    
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.LeadCategory)).toString()
    }
    this.dataLoading = true;
    this.service.SaveLeadCategory(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.LeadCategory.LeadCategoryId > 0) {
          this.toastr.success("Lead Category Updated successfully")
          $('#modal_popup').modal('hide')
        } else {
          this.toastr.success("Lead Category added successfully")
        }
        this.resetForm()
        this.getLeadCategoryList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }



DeleteLeadCategory(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.DeleteLeadCategory(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getLeadCategoryList()
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false;
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }



  editLeadCategory(obj: any) {
    this.resetForm()
    this.LeadCategory = obj;
    $('#modal_popup').modal('show');
  }


}
