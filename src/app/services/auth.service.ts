import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MasterService } from './master.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private service:MasterService) { }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
      
    } catch (Error) {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token'); 
  }

  getUserInfoFromToken() {
    const token = this.getToken();
    if (token) {
      return this.getDecodedAccessToken(token);
    }
    return null;
  }


  loginCheck():boolean{
    var access_token=localStorage.getItem('token');
    if(access_token!=null){
      var userInfo = this.getUserInfoFromToken();
      const now = new Date();
      const [month, day, year, hour, minute, second] = userInfo.iat
        .split(/[/\s:]/)
        .map(Number);
      const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

      const timeDiff = now.getTime() - date.getTime();

      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;


      if(timeDiff < sevenDaysInMillis){
          return true
        }
        else{
          this.service.signOut();
          return false;
        }
    }

    else{
      return false;
    }
    
  }


  

}


