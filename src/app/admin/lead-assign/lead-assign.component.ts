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
  selector: 'app-lead-assign',
  templateUrl: './lead-assign.component.html',
  styleUrls: ['./lead-assign.component.css']
})
export class LeadAssignComponent {
  dataLoading: boolean = false
  LeadAssignList: any = [];
  LeadAssign: any = {};
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
  LeadCategoryList: any = [];
  Filter: any = {};
  leadList: any[] = [];
  LeadDetails: any = {
    LeadName: '',
    LeadMobileNo: '',
    LeadComment: ''
  };


  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.LeadAssign.StaffId = this.staffLogin.StaffId;
    // this.Filter.RoleId = this.staffLogin.RoleId;
    this.validiateMenu();
    this.getStaffList();
    this.getLeadCategoryList();
    this.getLeadAssignList();
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

  @ViewChild('formLeadAssign') formLeadAssign: NgForm;
  resetForm() {
    this.LeadAssign = {};
    this.leadList = [];
    if (this.formLeadAssign) {
      this.formLeadAssign.control.markAsPristine();
      this.formLeadAssign.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.LeadAssign.Status = 1
    this.LeadAssign.LeadDate = new Date();
  }



  newLeadAssign() {
    this.resetForm();
    $('#modal_popup').modal('show')
  }

 viewLead(data: any) {
  console.log("Navigating to LeadDetail with LeadId:", data.LeadId);
  this.router.navigate(['/admin/lead-detail'], {
    queryParams: { id: data.LeadId, redUrl: '/admin/lead-assign' }
  });
}


  getLeadAssignList() {
    var data = {
      StaffId: this.staffLogin.StaffId,

    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    this.dataLoading = true
    this.service.getLeadAssignList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.LeadAssignList = response.LeadAssignList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  SaveLeadAssign() {

    this.formLeadAssign.control.markAllAsTouched();
    this.isSubmitted = true
    if (this.formLeadAssign.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.LeadAssign.CreatedBy = this.staffLogin.StaffLoginId;
    // this.LeadAssign.CreatedOn = Date.now();
    this.LeadAssign.LeadDate = this.loadData.loadDateYMD(this.LeadAssign.LeadDate);
    // this.LeadAssign.CreatedOn = this.loadData.loadDateYMD(this.LeadAssign.CreatedOn);
    console.log(this.LeadAssign);
   var  payload ={
      GetLeadAssign:this.LeadAssign,
      GetLeadDetails: this.leadList,
      
    }

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(payload)).toString()
    }
    this.dataLoading = true;
    this.service.SaveLeadAssign(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.LeadAssign.LeadId > 0) {
          this.toastr.success("Lead Assign Updated successfully")
          $('#modal_popup').modal('hide')
        } else {
          this.toastr.success("Lead Assign added successfully")
        }
        this.resetForm()
        this.getLeadAssignList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  DeleteLeadAssign(obj: any) {
    if (confirm("Are you sure you want to delete this record?")) {
      const request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      };

      this.dataLoading = true;

      this.service.DeleteLeadAssign(request).subscribe(
        (r1: any) => {
          const response = r1;
          if (response.Message === ConstantData.SuccessMessage) {
            this.toastr.success("Record deleted successfully");
            this.getLeadAssignList();
          } else {
            this.toastr.error(response.Message);
          }
          this.dataLoading = false;
        },
        (err) => {
          this.toastr.error("Error occurred while deleting the record");
          this.dataLoading = false;
        }
      );
    }
  }



  editLeadAssign(obj: any) {
    this.resetForm();
    this.LeadAssign = { ...obj };
    if (this.LeadAssign.LeadDate) {
      this.LeadAssign.LeadDate = new Date(this.LeadAssign.LeadDate);
    }
    $('#modal_popup').modal('show');
  }



  getLeadCategoryList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
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

  StaffList: any[] = [];

  getStaffList() {
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    };
    this.dataLoading = true;
    this.service.getStaffList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message === ConstantData.SuccessMessage) {
        this.StaffList = response.StaffList;
      } else {
        this.toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, err => {
      this.toastr.error("Error while fetching staff list");
      this.dataLoading = false;
    });
  }


  imageUrl = ConstantData.getBaseUrl();
  AttachmentsPhoto: any;
  setAttachments(event: any) {
  var file: File = event.target.files[0];
  if (!ConstantData.allowedFileTypes.includes(file.type)) {
    this.toastr.error("Invalid file format !!");
    this.LeadAssign.Attachments = '';
    this.LeadAssign.AttachmentsName = '';
    return;
  }

  if (file.size < 512000) {
    this.LeadAssign.AttachmentsName = file.name;
    this.LeadAssign.FileFormat = ConstantData.getFileExtension(file.name);
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', (e1: any) => {
      var dataUrl = e1.target.result;
      var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
      this.LeadAssign.Attachments = base64Data;

      if (file.type.startsWith('image/')) {
        this.AttachmentsPhoto = `data:${file.type};base64,${base64Data}`;
      } else if (file.type == 'application/pdf') {
        this.AttachmentsPhoto = 'assets/pdf-icon.png';  // ✅ Use some PDF icon for display
      } else {
        this.AttachmentsPhoto = 'assets/file-icon.png';  // ✅ Generic icon for DOC/DOCX
      }
    });

  } else {
    this.LeadAssign.Attachments = '';
    this.LeadAssign.AttachmentsName = '';
    this.toastr.error("File size should be less than 500 KB.");
  }
}

  addLeadItem() {
    if (this.LeadAssign.LeadName && this.LeadAssign.LeadMobileNo && this.LeadAssign.LeadComment) {
      this.leadList.push({
        LeadName: this.LeadAssign.LeadName,
        LeadMobileNo: this.LeadAssign.LeadMobileNo,
        LeadComment: this.LeadAssign.LeadComment
      });

      // Clear input fields after adding
      this.LeadAssign.LeadName = '';
      this.LeadAssign.LeadMobileNo = '';
      this.LeadAssign.LeadComment = '';
    }
  }

  removeLeadItem(index: number) {
    this.leadList.splice(index, 1);
  }

}