import { Component } from '@angular/core';
import { MasterService } from '../services/master.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-navigation',
  templateUrl: './sidebar-navigation.component.html',
  styleUrls: ['./sidebar-navigation.component.css']
})
export class SidebarNavigationComponent {

  userInfo:any;

  userRole!:string;

  adminNav:boolean=false;

  operatorNav:boolean=false;

  constructor(private service:MasterService,private authService:AuthService,private router:Router){}

  async ngOnInit(){


    var isLoggedIn=await this.authService.loginCheck();
    if(!isLoggedIn){
      this.router.navigate(['/login']);
      localStorage.clear();
      location.reload();
    }
    else{
      this.userInfo = this.authService.getUserInfoFromToken();
    this.userRole=this.userInfo.role;
    if(this.userRole=="admin"){
      this.adminNav=true;
      this.operatorNav=false;
    }
    else if(this.userRole=="operation"){
      this.adminNav=false;
      this.operatorNav=true;
    }
    }

    
  }

  logout(){
    this.service.logout().subscribe({
      next:(res)=>{
        localStorage.clear();
        this.router.navigate(['/login']);
        location.reload();
      },
      error:(error)=>{
        
      }
      
    })

 

  }
}
