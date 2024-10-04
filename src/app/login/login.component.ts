import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../services/master.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';  
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

loginForm!:FormGroup;

errorMessageView:boolean=false;

errorMessage!:string;

imageSrc!: string;

constructor(private fb: FormBuilder,
            private service:MasterService,
            private router:Router,
            private messageService: MessageService,
            private authService:AuthService
          ){}

  async ngOnInit(){
  const imageUrl = 'https://api.abrahamantonya.com/wwwroot/images/ec2f0bf0-b45b-408d-b63f-711e3488c5c5.png';
  this.imageSrc = imageUrl;
  var isLoggedIn=await this.authService.loginCheck();
  if(isLoggedIn){
    this.router.navigate(['']);
    
  }
  else{
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  
}

onLogin(){
  const loginData=this.loginForm.value;
  this.service.login(loginData).subscribe({
    next:(res)=>{
      if(res.data!=""){
        localStorage.setItem('token',res.data);
        location.reload();
      }
      else{
        this.errorMessage=res.message;
        this.errorMessageView=true;
      }

    },
    error:(error)=>{
      this.messageService.add({ severity: 'error', summary: 'Oops!', detail: 'Something went wrong.' });
    }
  })
}
}
