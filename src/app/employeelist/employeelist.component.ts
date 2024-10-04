import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MasterService } from '../services/master.service';
import { EmployeeModel } from '../model/EmployeeModel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EmployeeInserModel } from '../model/EmployeeInsertModel';
import { AuthService } from '../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css']
})
export class EmployeelistComponent {

  updateModalVisible:boolean=false

  employee: EmployeeModel[]=[];

  employees:EmployeeModel=new EmployeeModel();

  employeeInsert:EmployeeInserModel=new EmployeeInserModel();

  employeeRegForm!:FormGroup;

  employeeUpdateForm!:FormGroup;

  role!:any[];

  submitted = false;

  errorMessage!:string;

  userId!:string;

  errorMessageView:boolean=false;

  showNonNumericError1 = false;

  showNonNumericError2 = false;

  showInvalidLengthError1=false;

  showInvalidLengthError2=false;
  

  constructor(private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private service:MasterService,
              private fb:FormBuilder,
              private router:Router,
              private authService:AuthService
  ) {}

  async ngOnInit() {
    var isLoggedIn=await this.authService.loginCheck();
    if(!isLoggedIn){
      this.router.navigate(['/login']);
    }
    else{
      this.forms();
      this. getEmployeedetails();
      this.getDesignationCompany();
    }
      
  }

  forms(){
    this.employeeRegForm=this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      phone_without_whatsapp: ['',Validators.pattern(/^\d{10}$/)],
      phone_with_whatsapp : ['', Validators.pattern(/^\d{10}$/)],
      email : ['',[Validators.required, Validators.email],Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      role_id: ['', Validators.required],
      password: ['', Validators.required],
    });

    // this.employeeUpdateForm=this.fb.group({
    //   user_id: ['', Validators.required],
    //   first_name: ['', Validators.required],
    //   last_name: ['', Validators.required],
    //   phone_without_whatsapp:  [],
    //   phone_with_whatsapp :  [],
    //   email : ['',[Validators.required, Validators.email],Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
    //   role_id: [null, Validators.required]
    // });
  }

  get f() {
    return this.employeeRegForm.controls;
  }

  resetForm(){
    this.employeeInsert=new EmployeeInserModel();
    this.submitted=false;
    this.errorMessageView=false;
  }

  validateNumber(event: KeyboardEvent): void {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }


  validatePhnNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleanedValue = input.value.replace(/\D/g, '');
  
    if (input.value !== cleanedValue) {
      this.showNonNumericError1 = true;
      setTimeout(() => this.showNonNumericError1 = false, 2000);
    }
  
    const trimmedValue = cleanedValue.slice(0, 10);
  
    if (trimmedValue.length !== 10 && trimmedValue.length > 0) {
      this.showInvalidLengthError1 = true;
    } else {
      this.showInvalidLengthError1 = false;
    }
  
    input.value = trimmedValue;
    this.employees.phone_without_whatsapp = trimmedValue;
  }

  validateWhtsappNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleanedValue = input.value.replace(/\D/g, '');
  
    if (input.value !== cleanedValue) {
      this.showNonNumericError2 = true;
      setTimeout(() => this.showNonNumericError2 = false, 2000);
    }
  
    const trimmedValue = cleanedValue.slice(0, 10);
  
    if (trimmedValue.length !== 10 && trimmedValue.length > 0) {
      this.showInvalidLengthError2 = true;
    } else {
      this.showInvalidLengthError2 = false;
    }
  
    input.value = trimmedValue;
    this.employees.phone_with_whatsapp = trimmedValue;
  }

  getEmployeedetails(){
    this.service.getEmployeeList().subscribe({
      next:(res)=>{
        this.employee=res;
        this.filteredItems = this.employee;
      },
      error:(error)=>{
      }
    })
  }

  getDesignationCompany(){
    this.employeeInsert=new EmployeeInserModel();
    this.submitted=false;
    this.service.getDesignation().subscribe({
      next:(res)=>{
        if(res.is_active="1"){
          this.role=res;  
        }
      },
      error:(error)=>{
      }
    })
  }



  get emailInvalid() {
    const email = this.employeeInsert.email;
    return email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  get phoneWithoutWhatsappInvalid() {
    const phone = this.employeeInsert.phone_without_whatsapp;
    return phone && !/^\d{10}$/.test(phone);
  }
  
  get phoneWithWhatsappInvalid() {
    const phone = this.employeeInsert.phone_with_whatsapp;
    return phone && !/^\d{10}$/.test(phone);
  }
  
  onemployeeRegister() {
    this.submitted = true;
  
    const hasValidPhone = this.employeeInsert.phone_without_whatsapp || this.employeeInsert.phone_with_whatsapp;
    
    if (!this.employeeInsert.first_name || !this.employeeInsert.role_id || !this.employeeInsert.password || !hasValidPhone) {
      if (!hasValidPhone) {
        this.errorMessageView = true;
        this.errorMessage = "Any one phone number required";
      }
      return;
    }

    this.service.employeeRegistration(this.employeeInsert).subscribe({
      next: (res) => {
        if (res.message === "Success") {
          this.getEmployeedetails();
          this.closeModal();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Successfully Registered!' });
          this.resetForm();
        } else {
          this.errorMessageView = true;
          this.errorMessage = res.message;
        }
      },
      error: (error) => {
        this.errorMessageView = true;
        this.errorMessage = error.error.message;
      }
    });
  }

  // isDriver() {
  //   const selectedRole = this.role.find(role => role.role_id === this.employeeInsert.role_id);
  //   return selectedRole && selectedRole.role === 'driver';
  // }
  

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

  statusUpdate(event:any,id:string,status:number){
    const cid=id;
    if(status==1){
      status=0;
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to deactivate?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.service.updateEmployeeStatus(cid,status).subscribe({
              next:(res)=>{
                if(res==1){
                  this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully Updated' });
                  this.getEmployeedetails();
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
            this.service.updateEmployeeStatus(cid,status).subscribe({
              next:(res)=>{

                if(res==1){
                  this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully Updated' });
                  this.getEmployeedetails();
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
    const modalElement = document.getElementById('AddEmployeeModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

   updatePopup(id:string){
    this.updateModalVisible=true;

   this.getDesignationCompany();
    this.service.getEmployeeById(id).subscribe({
      next:(res)=>{
        this.userId=res.user_id;
        this.employees=res;   
      },
      error:(error)=>{
        this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
      }
    })
  }

  

  onEmployeeUpdate(event: Event){
    event.preventDefault();
    this.submitted = true;
    this.errorMessageView = false;
    this.errorMessage='';
    
    const hasValidPhone = this.employees.phone_without_whatsapp || this.employees.phone_with_whatsapp;


    if (this.employees.first_name && this.employees.role_id && hasValidPhone && 
      !this.showNonNumericError1 && !this.showInvalidLengthError1 && !this.showNonNumericError2 && !this.showInvalidLengthError2) {

        let email = (this.employees.email === "") ? null : this.employees.email;
        let phone_with_whatsapp= (this.employees.phone_with_whatsapp === "") ? null : this.employees.phone_with_whatsapp;
        let phone_without_whatsapp= (this.employees.phone_without_whatsapp === "") ? null : this.employees.phone_without_whatsapp;
      let updateData={
        user_id:this.userId,
        first_name:this.employees.first_name,
        last_name:this.employees.last_name,
        email:email,
        role_id:this.employees.role_id,
        phone_with_whatsapp:phone_with_whatsapp,
        phone_without_whatsapp:phone_without_whatsapp
      }
      
      this.service.updateEmployee(updateData).subscribe({
        next:(res)=>{
          if (res.message === "Success") {
            this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully Updated!' });
            this.updateModalVisible=false;
            this.getEmployeedetails();
            this.searchTerm='';
            this.errorMessageView = false;
            this.errorMessage='';
          }
          else{
            this.errorMessageView = true;
            this.errorMessage = res.message;
          }

        },
        error:(error)=>{
          this.errorMessageView = true;
          this.errorMessage = error.error.message;
         
          this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
        }
      })
    }  
    else{
      if(!hasValidPhone){
        this.errorMessageView=true;
        this.errorMessage="Any one phone number required";
      }
      return;
    }  
  }


  
  // isDrivers() {
  //   const selectedRole = this.role.find(role => role.role_id === this.employees.role_id);
  //   return selectedRole && selectedRole.role === 'driver';
  // }


  deleteEmployee(event:any,id:string){
    const cid=id;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.service.deleteEmployee(cid).subscribe({
            next:(res)=>{
              
              if(res==1){
                this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully deleted' });
                this.getEmployeedetails();
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
  
  filteredItems: EmployeeModel[] = [];
  searchTerm: string = '';
  onSearch(): void {
    
    if (this.searchTerm) {
      this.filteredItems = this.employee.filter(item =>
        item.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
      this.filteredItems=[...this.filteredItems]
    
    } else {
      this.filteredItems = this.employee; // If no search term, show all items
    }

  }
}

