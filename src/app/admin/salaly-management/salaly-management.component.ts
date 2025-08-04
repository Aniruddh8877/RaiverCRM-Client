import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { Months, PaymentMode, ResignationStatus, Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-salaly-management',
  templateUrl: './salaly-management.component.html',
  styleUrls: ['./salaly-management.component.css']
})
export class SalalyManagementComponent {
  dataLoading: boolean = false
  SalaryList: any = []
  // Salary: any = {}
  isSubmitted = false
  MonthList = this.loadData.GetEnumList(Months);
  PaymentModeList= this.loadData.GetEnumList(PaymentMode);
  AllStatusList = Months;
  AllPaymentMode=PaymentMode;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  userDetail: any = {};
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  // StaffList: any=[];

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
    this.GetSalaryManagementList();
    this.getStaffList();
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formSalary') formSalary: NgForm;
  resetForm() {
    this.Salary = {};
    if (this.formSalary) {
      this.formSalary.control.markAsPristine();
      this.formSalary.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.Salary.Status = 1
  }


  newSalaryManagement() {
    this.resetForm();
    $('#modal_popup').modal('show')
  }


  GetSalaryManagementList() {
    var data = {
      StaffId: this.staffLogin.StaffId,
      RoleId: this.staffLogin.RoleId,


    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    this.dataLoading = true
    this.service.GetSalaryManagementList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SalaryList = response.SalaryList;
        console.log(this.SalaryList);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }


  SaveSalaryManagement() {
    

    this.formSalary.control.markAllAsTouched();
    this.isSubmitted = true
    if (this.formSalary.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    // this.Salary.UpdatedBy = this.staffLogin.StaffId;
    // this.Salary.staffId = this.staffLogin.StaffId;
    // console.log(this.Salary);
    // this.Salary.CreatedBy = this.staffLogin.StaffLoginId;
    // this.Salary.Paymentdate = this.loadData.loadDateYMD(this.Salary.Paymentdate);
    

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Salary)).toString()
    }
    this.dataLoading = true;
    this.service.SaveSalaryManagement(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Salary.SalaryId > 0) {
          this.toastr.success("Lead Category Updated successfully")
          $('#modal_popup').modal('hide')
        } else {
          this.toastr.success("Lead Category added successfully")
        }
        this.resetForm()
        this.GetSalaryManagementList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  editSalary(obj: any) {
    this.resetForm()
    this.Salary = obj;
    $('#modal_popup').modal('show');
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



StaffList: any[] = []; // Populate this via API
Salary: any = {
  StaffId: null,
  BasicSalary: null,
  // other fields
};

onStaffChange(staffId: number) {
  const selectedStaff = this.StaffList.find(s => s.StaffId === staffId);
  if (selectedStaff) {
    this.Salary.BasicSalary = selectedStaff.BasicSalary;
    console.log(`Selected Staff: ${selectedStaff.StaffName}, Basic Salary: ${this.Salary.BasicSalary}`);
    
  }
}
calculateAmount(): void {
  const basic = Number(this.Salary.BasicSalary) || 0;
  const working = Number(this.Salary.WorkingDay) || 0;
  this.Salary.Amount = basic * working;
}


}
