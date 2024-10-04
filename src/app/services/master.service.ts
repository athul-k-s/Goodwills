import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http:HttpClient,private router:Router) { }

  accessToken = localStorage.getItem('token'); 
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.accessToken}`
  });

 //base_url='https://api.abrahamantonya.com/api/';
 base_url='https://localhost:7139/api/';

  //---------------------- Authentication------------------

  login(data:any){
    return this.http.post<any>(this.base_url +`authentication/login`,data)
  }
  logout(){
    return this.http.post<any>(this.base_url+"authentication/logout",{},{headers:this.headers})
  }

  signOut(){
    this.logout().subscribe({
      next:(res)=>{
        localStorage.clear();
        this.router.navigate(['/login']);
        location.reload();
      },
      error:(error)=>{
        
      }
      
    })
  }


  //------------------------ Employee ---------------------

  employeeRegistration(data:any){
    return this.http.post<any>(this.base_url +`user/register-user`,data,{headers:this.headers});
  }

  getEmployeeList(){
      return this.http.get<any>(this.base_url+"user/get-users",{headers:this.headers});
    }

  getDesignation(){
    return this.http.get<any>(this.base_url+"user/get-role",{headers:this.headers});
  }

  getEmployeeById(id:string){
    return this.http.get<any>(this.base_url +`user/get-users-by-id?userId=${id}`,{headers:this.headers});
  }

  updateEmployee(data:any){
    
    var result= this.http.put<any>(this.base_url +`user/update-user`,data,{headers:this.headers});
    return result;
  }

  updateEmployeeStatus(id:string,status:number){
    return this.http.put<any>(this.base_url +`user/update-user-status?userId=${id}&status=${status}`,{},{headers:this.headers})
  }

  getDriverList(){
    return this.http.get<any>(this.base_url+"user/get-driver-list");
  }


  sendMeassageViaWhatsapp(id:string,link:string){
    return this.http.post<any>(this.base_url +`delivery/send-delivery-data-to-whatsapp?driverId=${id}&url=${link}`,{})
  }


  deleteEmployee(id:string){
   
    return this.http.put<any>(this.base_url +`user/delete-user?userId=${id}`,{},{headers:this.headers});
  }

    // ------------------ Company -----------------------


    companyRegistration(data:any){
      return this.http.post<any>(this.base_url +`company/insert-company`,data,{headers:this.headers})
    }

    getCompanyList(){
      return this.http.get<any>(this.base_url+"company/get-company",{headers:this.headers});
    }
    getCompanyNameList(){
      return this.http.get<any>(this.base_url+"company/get-company-name");
    }
    getCompanyById(id:string){
      return this.http.get<any>(this.base_url +`company/get-company-by-id?companyId=${id}`,{headers:this.headers});
    }

    updateCompany(data:any){
      return this.http.put<any>(this.base_url +`company/update-company`,data,{headers:this.headers})
    }

    updateCompanyStatus(id:string,status:number,){
      return this.http.put<any>(this.base_url +`company/update-company-status?companyId=${id}&status=${status}`,{},{headers:this.headers});
    }

    deleteCompany(id:string){
      return this.http.put<any>(this.base_url +`company/delete-company?companyId=${id}&`,{},{headers:this.headers});
    }


    //------------------------ Delivery Note ---------------------------------

    insertDeliveryNote(data:any){
      return this.http.post<any>(this.base_url +`delivery/insert-delivery-note`,data,{headers:this.headers});
    }

    getDeliveryNoteDetails(){
      return this.http.get<any>(this.base_url+"delivery/get-delivery-data",{headers:this.headers});
    }

    getDeliveryDataById(id:string){
      return this.http.get<any>(this.base_url +`delivery/get-delivery-data-by-id?deliveryId=${id}`)
    }

    updateDeliveryStatus(id:string,status:number){
      return this.http.put<any>(this.base_url +`delivery/update-delivery-status?deliveryId=${id}&status=${status}`,{},{headers:this.headers});
    }

    updateDeliveryNote(data:any){
      return this.http.put<any>(this.base_url +`delivery/update-delivery-note`,data,{headers:this.headers});
    }

    updateDeliveryNoteByLink(data:any){
      return this.http.put<any>(this.base_url +`delivery/update-delivery-note-by-link`,data);
    }



    deleteDeliveryNote(id:string){
      return this.http.put<any>(this.base_url +`delivery/delete-delivery-note?deliveryId=${id}`,{},{headers:this.headers});
    }

    // downloadDeliveryNotePdf(id: string) {
    //   return this.http.get(this.base_url +`delivery/download-delivery-note?deliveryId=${id}`, {
    //     responseType: 'blob',
    //     headers: this.headers
    //   });
    // }

    getSignature(id:string){
      return this.http.get<any>(this.base_url +`delivery/get-signature-by-delivery-id?deliveryId=${id}`,{headers:this.headers})
    }

    // ---------------------- Equipment --------------------------------------

    getEquipmentType(){
      return this.http.get<any>(this.base_url+"equipment/get-equipments-type",{headers:this.headers});
    }

    getType(){
      return this.http.get<any>(this.base_url+"equipment/get-type",);
    }


    getEquipmentCapacityByTypeId(id:string){
      return this.http.get<any>(this.base_url +`equipment/get-equipments-capacity-by-typeid?typeId=${id}`,{headers:this.headers})
    }

    getCapacityByTypeId(id:string){
      return this.http.get<any>(this.base_url +`equipment/get-capacity-by-typeid?typeId=${id}`)
    }
    getEquipmentById(id:string){
      return this.http.get<any>(this.base_url +`equipment/get-equipments-by-id?typeId=${id}`,{headers:this.headers})
    }

    getEquipmentList(){
      return this.http.get<any>(this.base_url+"equipment/get-equipments",{headers:this.headers});
    }

    equipmentInsert(data:any){    
      return this.http.post<any>(this.base_url +`equipment/insert-equipments`,data,{headers:this.headers});
    }

    deleteEquipmentById(id:string){
      return this.http.put<any>(this.base_url +`equipment/delete-type?equipmentId=${id}`,{},{headers:this.headers})
    }

    updateEquipmentStatus(id:string,status:number){
      return this.http.put<any>(this.base_url+`equipment/update-type-status?typeId=${id}&status=${status}`,{},{headers:this.headers});
    }

}
