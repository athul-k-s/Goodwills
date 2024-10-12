import { Component, ElementRef, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { MasterService } from '../services/master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { CryptoService } from '../services/crypto.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delivery-form-view',
  templateUrl: './delivery-form-view.component.html',
  styleUrls: ['./delivery-form-view.component.css']
})
export class DeliveryFormViewComponent {
  @ViewChild('signatureCanvasUpdate') signatureCanvasUpdate!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  signaturePadU!: SignaturePad;
  updatedSign:string | null = "";
  deliveryUpdateNote:any;
  deliveryNoteUpdateForm!:FormGroup
  companyName!:any [];

  equipmentName!:any [];

  equipmentCapacity!:any [];

  driverName!:any [];

  showSubmitButton: boolean = true;

  deliveryId!:any;

  isSignatureSaved: boolean = false;

  userInfo: any;

  userId!:string;

  isSignatureCanvas:boolean=false;

  isCanvasDisabled: boolean = false;

  imageUrl!:string;

  showNonNumericError = false;

  showNonNumericError2 = false;

  showInvalidLengthError1=false;

  showInvalidLengthError2=false;

  submitted = false;

  IsignatureExist:boolean=false;

  signaturebase64!:string;

  deliveryFormView:boolean=true;

  deliveryView:any;

  isUpdated:boolean=true;
  constructor(private service:MasterService,
              private fb:FormBuilder,
              private route: ActivatedRoute,
              private router:Router,
              private messageService:MessageService,
              private cryptoService: CryptoService,
              private datePipe:DatePipe
            ){}
            
  ngOnInit(){
    this.load();
    this.route.paramMap.subscribe(async params => {

      const encodedId = params.get('id');

      if (encodedId) {
        var dId= await this.cryptoService.decryptData(encodedId);


       if(dId==null){
        this.deliveryFormView=false;
       }
       else{
        this.deliveryFormView=true;
        this.deliveryId=dId
        this.getDeliveryByid();
       }
        
        

      }
    });
    
    

  }

  load(){
    this.deliveryNoteUpdateForm = this.fb.group({
      delivery_id: ['', Validators.required],
      company_id: ['', Validators.required],
      type_id: ['', Validators.required],
      capacity_id: ['', Validators.required],
      driver_id: ['', Validators.required],
      company_name:['',Validators.required],
      driver_name:['',Validators.required],
      vehicle_no: [''],
      loading_site: [''],
      off_loading_site: [''],
      arrival_at_loading_site: [''],
      departure_at_loading_site: [''],
      arrival_at_offloading_site: [''],
      departure_at_offloading_site: [''],
      contact_no: [''],
      goods_details: [''],
      receiver_name: [''],
      receiver_no: [''],
      signature: [''],
      remarks: [''],
    });
  
    this.updatedSign='';
    
  }

   // ----------------------------------------------

   validateNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleanedValue = input.value.replace(/\D/g, '');
  
    if (input.value !== cleanedValue) {
      this.showNonNumericError = true;
      setTimeout(() => this.showNonNumericError = false, 2000);
    }
  
    const trimmedValue = cleanedValue.slice(0, 10);
  
    if (trimmedValue.length !== 10 && trimmedValue.length > 0) {
      this.showInvalidLengthError1 = true;
    } else {
      this.showInvalidLengthError1 = false;
    }
  
    input.value = trimmedValue;

    this.deliveryNoteUpdateForm.controls['contact_no'].setValue(trimmedValue);
  }

  validateNumber2(event: Event) {
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

    this.deliveryNoteUpdateForm.controls['receiver_no'].setValue(trimmedValue);
  }

//  -----------------------------------------------------------------

   getCompanyName(){
    this.service.getCompanyNameList().subscribe(res=>{
      this.companyName=res;
    })
  }

  getEquipmentType(){
    this.service.getType().subscribe(res=>{
      
      this.equipmentName=res;
    })
  }

  getEquipmentCapacity(event:any){
    const id=event.target.value;
    this.getCapacity(id);
  }


  getCapacity(id:string){
    
    this.service.getCapacityByTypeId(id).subscribe(res=>{
      this.equipmentCapacity=res;
    })
  }

  getDriverName(){
    this.service.getDriverList().subscribe(res=>{
      this.driverName=res;
    })
  }

// -------------------------------------------------------

  ngAfterViewInit(): void {
    this.signaturePadU = new SignaturePad(this.signatureCanvasUpdate.nativeElement, {
      penColor: 'blue' 
    });
  }

  clearSignature(): void {
    this.signaturePadU.clear();
    this.isSignatureSaved = false;
    this.isCanvasDisabled = false; 
    this.updatedSign='';
  }

  saveSignature(): void {
    if (!this.signaturePadU.isEmpty()) {
      const dataUrl = this.signaturePadU.toDataURL();     
      this.updatedSign = dataUrl;
      this.isSignatureSaved = true;
      this.isCanvasDisabled = true; 
    } else {
      this.isSignatureSaved = false;
    }
  }


// ------------------------------------------------------

getSignature(){
  this.service.getSignature(this.deliveryId).subscribe({
    next:(res)=>{
      this.signaturebase64=res.signature;
    },
    error:(error)=>{
      this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Error in getting signature' });
    }
  });
}

formatedDate(date:Date):string{
  return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss') || '';
}

getDeliveryByid(){
  console.log(this.deliveryId);
  
  this.service.getDeliveryDataById(this.deliveryId).subscribe({
    next:(res)=>{
        
        this.deliveryView=res;
        console.log(res);
        
        if(res.date_of_signature!=null){
          this.IsignatureExist=true;
          this.imageUrl=res.signature;
          this.showSubmitButton=false;
          this.isUpdated=true;
        }
        else{
          this.IsignatureExist=false;
          this.showSubmitButton=true;
          this.isUpdated=false;
          
        }
        
        this.deliveryNoteUpdateForm.patchValue({
          delivery_id:res.delivery_id,
          type_id: res.type_id,
          capacity_id:res.capacity_id,
          vehicle_no: res.vehicle_no,
          driver_name:res.driver_name,
          company_name:res.company_name,
          loading_site: res.loading_site,
          off_loading_site: res.off_loading_site,
          arrival_at_loading_site: res.arrival_at_loading_site,
          departure_at_loading_site: res.departure_at_loading_site,
          arrival_at_offloading_site: res.arrival_at_offloading_site,
          departure_at_offloading_site: res.departure_at_offloading_site,
          contact_no: res.contact_no,
          goods_details:res.goods_details,
          receiver_name:res.receiver_name,
          receiver_no: res.receiver_no,
          signature: this.updatedSign,
          remarks: res.remarks,
        });
        
     
          this.getSignature();
          this.getEquipmentType();
          this.getCapacity(res.type_id)
        
       
    },
    error:(error)=>{
    }
  })
 }
  

  onUpdateDeliveryNote(){
    if (this.updatedSign === "") {
      this.updatedSign = null;
  }
    
    const deliveryNoteUpdate=this.deliveryNoteUpdateForm.value;
      let updateData:any={
        delivery_id:deliveryNoteUpdate.delivery_id,
        type_id:deliveryNoteUpdate.type_id,
        capacity_id:deliveryNoteUpdate.capacity_id,
        vehicle_no: deliveryNoteUpdate.vehicle_no,
        loading_site: deliveryNoteUpdate.loading_site,
        off_loading_site: deliveryNoteUpdate.off_loading_site,
        arrival_at_loading_site: deliveryNoteUpdate.arrival_at_loading_site,
        departure_at_loading_site: deliveryNoteUpdate.departure_at_loading_site,
        arrival_at_offloading_site: deliveryNoteUpdate.arrival_at_offloading_site,
        departure_at_offloading_site: deliveryNoteUpdate.departure_at_offloading_site,
        contact_no: deliveryNoteUpdate.contact_no,
        goods_details:deliveryNoteUpdate.goods_details,
        receiver_name:deliveryNoteUpdate.receiver_name,
        receiver_no:deliveryNoteUpdate.receiver_no,
        signature: this.updatedSign,
        remarks: deliveryNoteUpdate.remarks
      }

      if(!this.showNonNumericError && !this.showInvalidLengthError1 
        && !this.showNonNumericError2 && !this.showInvalidLengthError2){
        
          this.service.updateDeliveryNoteByLink(updateData).subscribe({
            next:(res)=>{
              if(res.data==1){
                if(this.updatedSign!=null){
                  this.IsignatureExist = true;
                  this.isUpdated=true;
                  this.signaturebase64=this.updatedSign;
                }
                else{
                  this.IsignatureExist = false;
                  this.isUpdated=false;
                }
                this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully Updated' });
              }

              else{
                this.messageService.add({ severity: 'error', summary: 'Oops!', detail: res.message }); 
              }
             
            },
            error:(error)=>{
              this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' }); 
            }
          })
        }
  }

  async generatePDF() {
    const pdfContent = this.pdfContent.nativeElement;
    if (pdfContent) {
      pdfContent.style.display = 'block';
  
      const images = pdfContent.getElementsByTagName('img');
      const promises: Promise<void>[] = [];
  
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.complete) {
          promises.push(new Promise<void>((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => {
              console.error('Error loading image:', img.src);
              reject();
            };
          }));
        }
      }
  
      let canvas!: HTMLCanvasElement;
      try {
        await Promise.all(promises);
  
        // Use a lower scale (1.5) to reduce size, with CORS enabled
        canvas = await html2canvas(pdfContent, {
          scale: 1.5,
          useCORS: true,
          allowTaint: false
        });
  
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/jpeg', 0.75); // Use JPEG with 75% quality
  
        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;
  
        if (contentDataURL) {
          pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
          pdf.save('delivery-note.pdf');
        } else {
          console.error('Generated contentDataURL is not valid');
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        if (canvas) {
          document.body.removeChild(canvas);
        }
        pdfContent.style.display = 'none';
      }
    } else {
      console.error('The element to generate PDF is not found.');
    }
  }

}
