import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarNavigationComponent } from './sidebar-navigation/sidebar-navigation.component';
import { DeliverynoteComponent } from './deliverynote/deliverynote.component';
import { EmployeelistComponent } from './employeelist/employeelist.component';
import { EquipmentlistComponent } from './equipmentlist/equipmentlist.component';
import { CompanylistComponent } from './companylist/companylist.component';
import { LoginComponent } from './login/login.component';
import { EquipmenttimecardComponent } from './equipmenttimecard/equipmenttimecard.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { PettycashComponent } from './pettycash/pettycash.component';


// prime NG

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { DeliveryFormViewComponent } from './delivery-form-view/delivery-form-view.component';
import { PettyDetailsComponent } from './petty-details/petty-details.component';




@NgModule({
  declarations: [
    DashboardComponent,
    AppComponent,
    SidebarNavigationComponent,
    DeliverynoteComponent,
    EmployeelistComponent,
    EquipmentlistComponent,
    CompanylistComponent,
    LoginComponent,
    EquipmenttimecardComponent,
    PettycashComponent,
    DeliveryFormViewComponent,
    PettyDetailsComponent,

    
  
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,   
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  

    // PrimeNG
    TableModule,
    TagModule,
    PaginatorModule,
    DialogModule,
    ConfirmPopupModule,
    ToastModule

  ],
  providers: [
    ConfirmationService, 
    MessageService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
