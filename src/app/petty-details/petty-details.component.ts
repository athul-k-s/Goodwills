import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-petty-details',
  templateUrl: './petty-details.component.html',
  styleUrls: ['./petty-details.component.css']
})
export class PettyDetailsComponent {

  constructor(private router:Router,private authService:AuthService){}

  async ngOnInit(){
    var isLoggedIn=await this.authService.loginCheck();
    if(!isLoggedIn){
      this.router.navigate(['/login']);
    }
    else{

    }
  }
}
