import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import SignaturePad from 'signature_pad';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-equipmenttimecard',
  templateUrl: './equipmenttimecard.component.html',
  styleUrls: ['./equipmenttimecard.component.css']
})
export class EquipmenttimecardComponent {

  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;


  constructor(private router:Router,private authService:AuthService){}

  async ngOnInit(){
  var isLoggedIn=await this.authService.loginCheck();
    
    if(!isLoggedIn){
      this.router.navigate(['/login']);
    }
    else{
      
    }
}

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement);
  }
}
