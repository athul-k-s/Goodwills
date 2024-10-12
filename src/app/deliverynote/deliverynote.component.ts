import { Component, ElementRef, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Table } from 'primeng/table';
import { DeliveryNoteModel } from '../model/DeliveryNoteModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MasterService } from '../services/master.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthService } from '../services/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { DeliveryNoteInsertModel } from '../model/DeliveryNoteInsertModel';
import { Router } from '@angular/router';
import { CryptoService } from '../services/crypto.service';
import { DatePipe } from '@angular/common';

declare var bootstrap: any;



@Component({
  selector: 'app-deliverynote',
  templateUrl: './deliverynote.component.html',
  styleUrls: ['./deliverynote.component.css']
})
export class DeliverynoteComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @ViewChild('signatureImage', { static: false }) signatureImage!: ElementRef;
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signatureCanvasUpdate') signatureCanvasUpdate!: ElementRef<HTMLCanvasElement>;
  @ViewChild('videoElement') videoElement:any= ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement:any= ElementRef<HTMLCanvasElement>;
  goodsImageUrls: any[]=[];

  stream: MediaStream | null = null;

  currentIndex!: number ;

  signaturePad!: SignaturePad;

  signaturePadU!: SignaturePad;

  deliverynote!:DeliveryNoteModel[];

  deliveryInsertModel:DeliveryNoteInsertModel=new DeliveryNoteInsertModel();
  

  deliveryUpdateNote:any;

  deliveryView:any;

  deliveryNoteForm !: FormGroup;

  deliveryNoteUpdateForm!: FormGroup;

  companyName!:any [];

  equipmentName!:any [];

  equipmentCapacity!:any [];

  driverName!:any [];

  updateModalVisible:boolean=false;

  viewModalVisible:boolean=false;

  CameraModalVisible:boolean=false;

  imageUrl:string| ArrayBuffer | null = null;

  linkid!:string;

  ButtonView:boolean=true;

  userInfo: any;

  userId!:string;

  updatedSign:any;

  isSignatureSaved: boolean = false;

  showNonNumericError = false;

  showNonNumericError2 = false;

  showInvalidLengthError1=false;

  showInvalidLengthError2=false;

  submitted = false;

  isCanvasDisabled: boolean = false;


  constructor(private fb: FormBuilder,
              private service:MasterService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private authService: AuthService,
              private clipboard: Clipboard,
              private router:Router,
              private cryptoService: CryptoService,
              private datePipe: DatePipe
             ) {
              this.form();
             }

  async ngOnInit() {
    var isLoggedIn=await this.authService.loginCheck();
    if(!isLoggedIn){
      this.router.navigate(['/login']);
    }
    else{
      this.getDeliveryDetails();
      this.getCompanyName();
      this.getEquipmentType();
      this. getDriverName();
      this.userInfo = this.authService.getUserInfoFromToken();
      this.userId=this.userInfo.user_id;
      
      this.deliveryNoteForm.reset;
    }
      
    
   
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      penColor: 'blue' 
    });
  }

 

  clearSignature(): void {
    this.signaturePad.clear();
    this.isSignatureSaved = false;
    this.isCanvasDisabled = false; 
  }

  saveSignature(): void {
    if (!this.signaturePad.isEmpty()) {
      var dataUrl = this.signaturePad.toDataURL(); // Default is PNG format
      this.deliveryInsertModel.signature=dataUrl;
      this.isCanvasDisabled = true; 
      this.isSignatureSaved = true; 
    } else {
      this.isSignatureSaved = false; // Optionally handle empty signature pad case
    }
  }
  


  // saveSignatureUpdate(): void {
  //   if (!this.signaturePadU.isEmpty()) {
  //     const dataUrl = this.signaturePadU.toDataURL(); // Default is PNG format
  //     this.updatedSign=dataUrl;
  //   } else {
  //   }
  // }

  openCamera(): void {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      this.CameraModalVisible=true;
    }).catch(error => {
    });
  }

  
  captureImage(): void {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      this.goodsImageUrls.push(dataUrl);
      this.stopCamera();
      this.CameraModalVisible = false;
    } else {
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  // ------------
  clear(table: Table) {
    table.clear();
}

filteredItems: DeliveryNoteModel[] = [];
searchTerm: string = '';

onSearch(): void {
  
  if (this.searchTerm) {
    this.filteredItems =  this.deliverynote.filter(item =>
      item.company_name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
    this.filteredItems=[...this.filteredItems]
  } else {
    this.filteredItems = this.deliverynote; // If no search term, show all items
  }

}

  
  // -----------

  getCompanyName() : Promise<void>{
    return new Promise((resolve, reject) => {
    this.service.getCompanyList().subscribe(res=>{

      
      this.companyName=res;
    });
  });
    
  }

  getEquipmentType(): Promise<void>{
    return new Promise((resolve, reject) => {
    this.service.getEquipmentType().subscribe(res=>{
      this.equipmentName=res;
    });
  });
  }

  getEquipmentCapacityByClick(event:any){
    const id=event.target.value;
    this.getEquipmentCapacity(id);
  }

  getEquipmentCapacity(id:string){
   
    this.service.getEquipmentCapacityByTypeId(id).subscribe(res=>{
      this.equipmentCapacity=res;

    })
  }

  getDriverName(): Promise<void>{
    return new Promise((resolve, reject) => {
    this.service.getDriverList().subscribe(res=>{
      this.driverName=res;
    });
  });
  }

// ---------------------------


  form(){
    this.deliveryNoteForm = this.fb.group({
      company_id: ['', Validators.required],
      type_id: ['', Validators.required],
      capacity_id: ['', Validators.required],
      driver_id: ['', Validators.required],
      vehicle_no: [''],
      loading_site: [''],
      off_loading_site: [''],
      arrival_at_loading_site: [''],
      departure_at_loading_site: [''],
      arrival_at_offloading_site: [''],
      departure_at_offloading_site: [''],
      contact_no: ['', Validators.maxLength(10)], 
      goods_details: [''],
      receiver_name: [''],
      receiver_no: ['', [Validators.maxLength(10)]],
      signature: [''],
      remarks: ['']
    });

    this.deliveryNoteUpdateForm = this.fb.group({
      delivery_id: [0, Validators.required],
      company_id: [0, Validators.required],
      type_id: [0, Validators.required],
      capacity_id: [0, Validators.required],
      driver_id: [0, Validators.required],
      vehicle_no: ['', Validators.required],
      loading_site: ['', Validators.required],
      off_loading_site: ['', Validators.required],
      arrival_at_loading_site: ['', Validators.required],
      departure_at_loading_site: ['', Validators.required],
      arrival_at_offloading_site: ['', Validators.required],
      departure_at_offloading_site: ['', Validators.required],
      contact_no: ['', Validators.required],
      goods_details: ['', Validators.required],
      inserted_date:['',],
      receiver_name: ['', Validators.required],
      receiver_no: ['', Validators.required],
      signature: ['', Validators.required],
      remarks: ['', Validators.required]
    });

  }


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
    this.deliveryInsertModel.contact_no = trimmedValue;
    this.deliveryNoteForm.controls['contact_no'].setValue(trimmedValue);
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
    this.deliveryInsertModel.receiver_no = trimmedValue;
    this.deliveryNoteForm.controls['receiver_no'].setValue(trimmedValue);
  }
  

  closeModal() {
    const modalElement = document.getElementById('AddDeliveryNoteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      
    }
  }

  getDeliveryDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
    this.service.getDeliveryNoteDetails().subscribe({
      next:(res)=>{
        this.deliverynote=res;
        console.log(this.deliverynote);
        
        this.filteredItems = this.deliverynote;
      },
      error:(error)=>{
        this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong. Try again!' });
      }
     });
  });
  }

  resetForm(){
    this.deliveryInsertModel=new DeliveryNoteInsertModel();
    this.submitted=false;
  }

 async onAddButton(){
  
     this.deliveryInsertModel=await new DeliveryNoteInsertModel();
    
    this.equipmentCapacity=[];
    this.submitted=false;
    this.goodsImageUrls=[];
    this.ButtonView=true;
    this.clearSignature();
  }

  

  onAddDeliveryNote(){
    if (this.deliveryInsertModel.signature === "") {
      this.deliveryInsertModel.signature = null;
    }
     this.submitted=true;
      this.linkid='';
      if(this.deliveryInsertModel.company_id && this.deliveryInsertModel.type_id 
        && this.deliveryInsertModel.capacity_id && this.deliveryInsertModel.driver_id 
        && !this.showNonNumericError && !this.showInvalidLengthError1 
        && !this.showNonNumericError2 && !this.showInvalidLengthError2){
              this.service.insertDeliveryNote(this.deliveryInsertModel).subscribe({
                next:(res)=>{
                  this.linkid=res;
                  // this.ButtonView=false;
                  this.viewModalVisible=false;
                  this.closeModal();
                  this.getDeliveryDetails();
                  this.submitted=false;
                  this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully added' });
                },
                error:(error)=>{
                  this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong. Try again!' });
                }
              }) 
        }
  }

  sendLink(){
    const url='https://ggt.abrahamantonya.com/'
    const link=url+'delivery-form-view';
    const id=this.linkid;
    const fullLink = `${link}/${id}`;
    const driverId=this.deliveryNoteForm.value.driver_id
    this.service.sendMeassageViaWhatsapp(driverId,fullLink).subscribe({
      next:(res)=>{
        if(res==1){
          this.closeModal();
        }
      },
      error:(error)=>{
        this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong. Try again!' });
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

  statusUpdate(event: any, status: number, id: string) {
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
        this.service.updateDeliveryStatus(cid, newStatus).subscribe({
          next: (res) => {
            if (res === 1) {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Successfully Updated' });
              this.getDeliveryDetails();
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

  updatePopup(data: any, type_id: string) {
    this.getEquipmentCapacity(type_id);
    console.log(data);
    
    setTimeout(() => {
        this.updateModalVisible = true;

        this.imageUrl = data.signature;
        const formattedDate = data.inserted_date.split('T')[0]; // Extract only the date part "YYYY-MM-DD"

        // Patch the form values after a slight delay
        this.deliveryNoteUpdateForm.patchValue({
            delivery_id: data.delivery_id,
            company_id: data.company_id,
            type_id: data.type_id,
            capacity_id: data.capacity_id,
            driver_id: data.driver_id,
            vehicle_no: data.vehicle_no,
            loading_site: data.loading_site,
            off_loading_site: data.off_loading_site,
            arrival_at_loading_site: data.arrival_at_loading_site,
            departure_at_loading_site: data.departure_at_loading_site,
            arrival_at_offloading_site: data.arrival_at_offloading_site,
            departure_at_offloading_site: data.departure_at_offloading_site,
            contact_no: data.contact_no,
            goods_details: data.goods_details,
            inserted_date:formattedDate,
            receiver_name: data.receiver_name,
            receiver_no: data.receiver_no,
            signature: data.signature,
            remarks: data.remarks
        });

       console.log(this.deliveryNoteUpdateForm.value);
       
        
    }, 500); // Adjust the delay as needed
}
  onUpdateDeliveryNote(){

    const deliveryNoteUpdate=this.deliveryNoteUpdateForm.value;

      let updateData:any={
        delivery_id:deliveryNoteUpdate.delivery_id,
        company_id:deliveryNoteUpdate.company_id,
        type_id:deliveryNoteUpdate.type_id,
        capacity_id:deliveryNoteUpdate.capacity_id,
        driver_id:deliveryNoteUpdate.driver_id,
        vehicle_no: deliveryNoteUpdate.vehicle_no,
        loading_site: deliveryNoteUpdate.loading_site,
        off_loading_site: deliveryNoteUpdate.off_loading_site,
        arrival_at_loading_site: deliveryNoteUpdate.arrival_at_loading_site,
        departure_at_loading_site: deliveryNoteUpdate.departure_at_loading_site,
        arrival_at_offloading_site: deliveryNoteUpdate.arrival_at_offloading_site,
        departure_at_offloading_site: deliveryNoteUpdate.departure_at_offloading_site,
        contact_no: deliveryNoteUpdate.contact_no,
        goods_details:deliveryNoteUpdate.goods_details,
        inserted_date:deliveryNoteUpdate.inserted_date,
        receiver_name:deliveryNoteUpdate.receiver_name,
        receiver_no:deliveryNoteUpdate.receiver_no,
        signature: deliveryNoteUpdate.signature,
        remarks: deliveryNoteUpdate.remarks,
      }
      console.log(updateData);
      

      if(!this.showNonNumericError && !this.showInvalidLengthError1 
        && !this.showNonNumericError2 && !this.showInvalidLengthError2){
          this.service.updateDeliveryNote(updateData).subscribe({
            next:(res)=>{
                this.updateModalVisible=false;
                this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully Updated' });
                this.getDeliveryDetails();
                this.searchTerm='';
                this.imageUrl='';
            },
            error:(error)=>{
              this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' }); 
            }
          })
        }
  }

  copiedLink!:string
  signatureBase64!:string;
  

  async onViewDetails(data:any){  
    console.log(data.delivery_id);
    
    this.service.getSignature(data.delivery_id).subscribe({
      next:(res)=>{
        console.log(res);
        
        this.signatureBase64=res.signature;
      },
      error:(error)=>{
        this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Error in getting signature' });
      }
    });
    
    this.copiedLink="";
    this.imageUrl = data.signature || '';
    const url = 'https://ggt.abrahamantonya.com/';
    this.viewModalVisible = true;
    const link = url + 'delivery-form-view';
    const deliveryId = data.delivery_id;

    let encryptedString = await this.cryptoService.encryptData(deliveryId);

    this.copiedLink = `${link}/${encryptedString}`;
    this.deliveryView = data;
    this.deliveryView.arrival_at_loading_site=this.datePipe.transform(this.deliveryView.arrival_at_loading_site, 'dd-MM-yyyy HH:mm:ss') || '';
    this.deliveryView.departure_at_loading_site=this.datePipe.transform(this.deliveryView.departure_at_loading_site, 'dd-MM-yyyy HH:mm:ss') || '';
    this.deliveryView.arrival_at_offloading_site=this.datePipe.transform(this.deliveryView.arrival_at_offloading_site, 'dd-MM-yyyy HH:mm:ss') || '';
    this.deliveryView.departure_at_offloading_site=this.datePipe.transform(this.deliveryView.departure_at_offloading_site, 'dd-MM-yyyy HH:mm:ss') || '';

    
    
    this.getEquipmentCapacity(data.type_id);
  }

  copyLink() {
    this.clipboard.copy(this.copiedLink);
    this.messageService.add({ severity: 'success', summary: '', detail: 'Link copied to clipboard!' });
  }

  deleteDeliveryDetail(event:any,id:string){
    const cid=id;
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.service.deleteDeliveryNote(cid).subscribe({
            next:(res)=>{
              if(res==1){
                this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Successfully deleted' });
                this.getDeliveryDetails();
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
