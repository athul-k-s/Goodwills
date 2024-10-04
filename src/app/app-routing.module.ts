import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanylistComponent } from './companylist/companylist.component';
import { DeliverynoteComponent } from './deliverynote/deliverynote.component';
import { EmployeelistComponent } from './employeelist/employeelist.component';
import { EquipmentlistComponent } from './equipmentlist/equipmentlist.component';
import { LoginComponent } from './login/login.component';
import { EquipmenttimecardComponent } from './equipmenttimecard/equipmenttimecard.component';
import { PettycashComponent } from './pettycash/pettycash.component';
import { DeliveryFormViewComponent } from './delivery-form-view/delivery-form-view.component';

const routes: Routes = [
  {path:'',component:DeliverynoteComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'companylist',component:CompanylistComponent},
  {path:'deliverynote',component:DeliverynoteComponent},
  {path:'employeelist',component:EmployeelistComponent},
  {path:'equipmentlist',component:EquipmentlistComponent},
  {path:'equipmenttimecard',component:EquipmenttimecardComponent},
  {path:'pettycash',component:PettycashComponent},
  {path:'delivery-form-view/:id',component:DeliveryFormViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
