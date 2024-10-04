import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


  constructor(private router:Router,private authService:AuthService){}

  async ngOnInit(){
    var isLoggedIn=await this.authService.loginCheck();
    
    if(!isLoggedIn){
      this.router.navigate(['/login']);
      
      
    }
  }

}
