import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MasterService } from '../services/master.service';
import { EquipmentModel } from '../model/EquipmentModel';
import { AuthService } from '../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
declare var bootstrap: any;
@Component({
  selector: 'app-equipmentlist',
  templateUrl: './equipmentlist.component.html',
  styleUrls: ['./equipmentlist.component.css']
})
export class EquipmentlistComponent {

  filteredItems: EquipmentModel[] = [];

  equipment:EquipmentModel []=[];

  equipmentAddForm!:FormGroup;

  userInfo: any;

  userId!:string;

  newCapacity: string = '';

  equipmentname!:string;

  capacities: any[] = [];

  updateModalVisible:boolean=false;

  searchTerm: string = '';
 

  constructor(private service:MasterService,
              private fb:FormBuilder,
              private authService: AuthService,
              private messageService: MessageService,
              private confirmationService:ConfirmationService,
              private router:Router
            ) {}

  async ngOnInit() {
    var isLoggedIn=await this.authService.loginCheck();
    if(!isLoggedIn){
      this.router.navigate(['/login']);
    }
    else{
      this.userInfo = this.authService.getUserInfoFromToken();
      this.userId=this.userInfo.user_id
      this.forms();
      this.getEquipmentList();
      this.newCapacity;
    }
    
  }

  forms(){
    this.equipmentAddForm=this.fb.group({
      type: ['', Validators.required],
      capacities: [[], Validators.required]
    })  
  }

  getEquipmentList(){
    this.service.getEquipmentList().subscribe({
      next:(res)=>{
        this.equipment=res;
        this.filteredItems = this.equipment;
      },
      error:(error)=>{
      }
    })
  }

  onSearch(): void {
  
    if (this.searchTerm) {
      this.filteredItems =  this.equipment.filter(item =>
        item.type.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
      this.filteredItems=[...this.filteredItems]
    
    } else {
      this.filteredItems = this.equipment; // If no search term, show all items
    }
  
  }
  

  addCapacity() {
    if (this.newCapacity.trim()) {
      this.capacities.push(this.newCapacity.trim());
      this.newCapacity='';
    }
  }

  deleteCapacity(index: number) {
    this.capacities.splice(index, 1);
  }

  addEquipmentButton(){
    this.equipmentname='';
    this.newCapacity='';
    this.capacities=[];
  }

onEquipmentAdd(){
   this.equipmentAddForm.patchValue({
      type:this.equipmentname,
      capacities:this.capacities
   })
    const formData = this.equipmentAddForm.value;
    this.service.equipmentInsert(formData).subscribe({
      next:(res)=>{
        if(res.data==200){
          this.getEquipmentList();
          this.closeModal();
          this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully added!' });
          this.equipmentname='';
          this.newCapacity='';
          this.capacities=[];
        }
      },
      error:(error)=>{
        if(error.error.data=null && error.error.message!=null){
          this.messageService.add({ severity: 'info', summary: 'Oops!', detail: error.error.message[0] });
        }
        this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
      }
    })
}

closeModal() {
  const modalElement = document.getElementById('AddEquipmentModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
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


statusUpdate(event:any,id:string,status:number){
  const cid = id;
  const newStatus = status === 1 ? 0 : 1;
  const confirmationMessage = status === 1 
    ? 'Are you sure that you want to deactivate?' 
    : 'Are you sure that you want to activate?';

  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: confirmationMessage,
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.service.updateEquipmentStatus(cid, newStatus).subscribe({
        next: (res) => {
          if (res === 1) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Successfully Updated' });
            this.getEquipmentList();
            this.searchTerm = '';
          } else {
            this.messageService.add({ severity: 'info', summary: 'Oops!', detail: 'Not updated' });
          }
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
        }
      });
    },
    reject: () => {
      // handle rejection if needed
    }
  });
}


updatePopup(id:string){
  this.updateModalVisible=true;
  this.service.getEquipmentById(id).subscribe({
    next:(res)=>{
        this.equipment=res;
        
    },
    error:(error)=>{
    }
  })
}

deleteEquipment(id:string){
  
  this.service.deleteEquipmentById(id).subscribe({
    next:(res)=>{
      if(res==1){
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Equipment deleted succesfully' });
        this.getEquipmentList();
      }
    },
    error:(error)=>{

      this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
    }
  })
}
}
