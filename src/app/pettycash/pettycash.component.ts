import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pettycash',
  templateUrl: './pettycash.component.html',
  styleUrls: ['./pettycash.component.css']
})
export class PettycashComponent {

  paymentModalVisible:boolean=false;

  constructor(private router:Router,private authService:AuthService){}

  async ngOnInit(){
    var isLoggedIn=await this.authService.loginCheck();
    if(!isLoggedIn){
      this.router.navigate(['/login']);
    }
    else{

    }
  }

  onPaymentClick(){
    this.paymentModalVisible=true;
  }
}
