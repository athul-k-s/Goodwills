import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MasterService } from '../services/master.service';
import { CompanyModel } from '../model/CompanyModel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyUpdateModel } from '../model/CompanyUpdateModel';


declare var bootstrap: any;

@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})
export class CompanylistComponent {

  filterValue = '';
  companyRegForm!:FormGroup;

  companyUpdateForm!:FormGroup;

  company: CompanyModel[] = [];

  companyInsert:CompanyModel=new CompanyModel();

  companyUpdateModel:CompanyUpdateModel=new CompanyUpdateModel();

  updateModalVisible:boolean=false;

  userInfo: any;

  userId!:string;

  submitted = false;

  errorMessage!:string;

  errorMessageView:boolean=false


  constructor(private service:MasterService,
              private fb:FormBuilder,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private authService: AuthService,
              private router:Router
              ) 
              {
               
              }

  async ngOnInit() {
    var isLoggedIn=await this.authService.loginCheck();
    
    if(!isLoggedIn){
      this.router.navigate(['/login']);
    }
    else{
      this.forms();
      this.getCompanyDetails();
      this.userInfo = this.authService.getUserInfoFromToken();
      
      this.userId=this.userInfo.user_id;
      if(this.filteredItems=[]){
        this.getCompanyDetails();
      }
  
    }

      
  }
  
  forms(){
    this.companyRegForm=this.fb.group({
      company_name: ['', Validators.required],
      email: ['',[Validators.required, Validators.email],Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],

    })
    
    this.companyUpdateForm=this.fb.group({
      company_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', [Validators.required]],
    })

  }

  get f() {
    return this.companyRegForm.controls;
  }

  validateNumber(event: KeyboardEvent): void {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  resetForm(){
    this.companyInsert=new CompanyModel()
    this.submitted=false;
    this.errorMessageView=false;
  }


  onCompanyRegister(form:NgForm){

    this.submitted = true;
      
    if (this.companyInsert.company_name && 
      (this.companyInsert.email === '' || form.controls['email'].valid) && 
      (this.companyInsert.phone === '' || form.controls['phone'].valid)) {

      this.service.companyRegistration(this.companyInsert).subscribe({
        next:(res)=>{
          if(res.data==1){
            this.companyRegForm.reset(); 
            this.closeModal();
            this.getCompanyDetails();
            this.messageService.add({ severity: 'success', summary: 'Successfull', detail: res.message });
            this.resetForm();
          }
          else{
            this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });

          }
          
        },
        error:(error)=>{
          this.errorMessage = error.error.message;
          this.errorMessageView = true;
          
        }
    })
    }

    else{
      // console.log("Enter valid email or phone");
    }
      
  }

  getCompanyDetails(){
    this.service.getCompanyList().subscribe({
      next:(res)=>{
          this.company=res;
          this.filteredItems = this.company;
      },
      error:(error)=>{
      }
    })
  }

  getStatusValue(status:number){
    if(status==1){
      return "Active"
    }
    else{
      return "Inactive"
    }
  }

  getSeverity(status:number){
    if(status==1){
      return "success"
    }
    else{
      return "danger"
    }
  }

  filteredItems: CompanyModel[] = [];
  searchTerm: string = '';

  onSearch(): void {
    
    if (this.searchTerm) {
      this.filteredItems = this.company.filter(item =>
        item.company_name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
      this.filteredItems=[...this.filteredItems]
    
    } else {
      this.filteredItems = this.company; // If no search term, show all items
    }
  }


  statusUpdate(event:any,status:number,id:string){
    const cid=id;
    if(status==1){
      status=0;
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to deactivate?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.service.updateCompanyStatus(cid,status).subscribe({
              next:(res)=>{               
                if(res==1){
                  this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully Updated' });
                  this.getCompanyDetails();
                  this.searchTerm='';
                }
                else{
                  this.messageService.add({ severity: 'info', summary: 'Oops!', detail: 'Not updated' });
                }
              },
              error:(error)=>{
                this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
              }
            })
        },
        reject: () => {
           
        }
    });
    }
    else{
      status=1;
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to activate?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.service.updateCompanyStatus(cid,status).subscribe({
              next:(res)=>{
                if(res==1){
                  this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully Updated' });
                  this.getCompanyDetails();
                  this.searchTerm='';
                }
                else{
                  this.messageService.add({ severity: 'info', summary: 'Oops!', detail: 'Not updated' });
                  
                }
              },
              error:(error)=>{
                this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
              }
            })
        },
        reject: () => {
            
        }
    });
    }
  }

  closeModal() {
    const modalElement = document.getElementById('AddCompanyModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  updatePopup(id: string) {
    this.errorMessageView = false;
    this.submitted = false;
    this.service.getCompanyById(id).subscribe({
      next: (res) => {
        this.updateModalVisible = true;
        this.companyUpdateModel = res;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
      }
    });
  }
  
  get emailInvalid() {
    const email = this.companyUpdateModel.email;
    return email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  get phoneInvalid() {
    const phone = this.companyUpdateModel.phone;
    return phone && !/^\d{10}$/.test(phone);
  }
  
  onUpdateCompany() {
    this.submitted = true;
  
    if (!this.companyUpdateModel.company_name || this.emailInvalid || this.phoneInvalid) {
      return;
    }
  
    this.service.updateCompany(this.companyUpdateModel).subscribe({
      next: (res) => {
        if (res.data == 1) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated!' });
          this.updateModalVisible = false;
          this.getCompanyDetails();
          this.searchTerm = '';
          this.submitted = false;
          this.errorMessageView = false;
        } else {
          this.errorMessage = res.message;
          this.errorMessageView = true;
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        this.errorMessageView = true;
      }
    });
  }
  

  deleteCompany(event:any,id:string){
    const cid=id;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.service.deleteCompany(cid).subscribe({
            next:(res)=>{
              
              if(res==1){
                this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully deleted' });
                this.getCompanyDetails();
                this.searchTerm='';
              }
              else{
                this.messageService.add({ severity: 'info', summary: 'Oops!', detail: 'Not deleted' });
              }
            },
            error:(error)=>{
              this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
            }
          })
      },
      reject: () => {
         
      }
  });
  }

}
