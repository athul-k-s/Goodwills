import { Component, HostListener } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { AuthService } from './services/auth.service';
import { Logger } from 'html2canvas/dist/types/core/logger';
import { Observable, startWith, Subject, switchMap, tap, timer } from 'rxjs';
import { MasterService } from './services/master.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Goodwills';

  access_token!:any;

  isLoggedIn:boolean=false;

  userInfo:any;

  constructor(private authService:AuthService,private service:MasterService){}

  private timeoutMinutes = 60*4;
  private idleTimer$: Observable<number> | undefined;
  private userActions$ = new Subject<void>();
  logoutTimer: any;

  
  @HostListener('document:mousemove')
  @HostListener('document:click')
  @HostListener('document:keypress')
  resetTimer() {
    this.userAction();
  }

  ngOnInit() {
    this.access_token = localStorage.getItem('token');
    if (this.access_token != null) {
      this.isLoggedIn = true;
      this.startLogoutTimer();
      this.initializeIdleTimer();  // Initialize the idle timer on login
    } else {
      this.isLoggedIn = false;
    }
  }

  // Initialize idle detector
  initializeIdleTimer() {
    this.idleTimer$ = this.userActions$.pipe(
      startWith(0),
      switchMap(() => timer(this.timeoutMinutes * 60 * 1000)), // 30 minutes idle time
      tap(() => {
        this.service.signOut();
      })
    );
    this.idleTimer$.subscribe();
  }

  userAction() {
    this.userActions$.next();  // Reset the idle timer on user action
  }

  private startLogoutTimer() {
    const timeoutDuration = this.timeoutMinutes * 60 * 1000;  // 30 minutes in milliseconds
    this.logoutTimer = setTimeout(() => {
      this.service.signOut();
    }, timeoutDuration);
  }

}
