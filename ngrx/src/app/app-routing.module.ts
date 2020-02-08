import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './components/map-view/map-view.component';
import { ActiveDriversComponent } from './components/active-drivers/active-drivers.component';
import { DriverRegisterComponent } from './components/driver-register/driver-register.component';
import { RequestRideComponent } from './components/request-ride/request-ride.component';
import { DriverDetailsComponent } from './components/driver-details/driver-details.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './service/guard/auth.guard';
import { RouteGuard } from './service/guard/route.guard';
import { LoginGuard } from './service/guard/login.guard';
import { DriverHubComponent } from './components/driver-hub/driver-hub.component';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { ApproveRideComponent } from './components/approve-ride/approve-ride.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'operator/home', component: ActiveDriversComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: 'operator/view-map', component: MapViewComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: 'operator/register', component: DriverRegisterComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: 'operator/find', component: RequestRideComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: 'operator/details/:id', component: DriverDetailsComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: 'operator/assign', component: ApproveRideComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: 'client/home', component: RequestRideComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: 'client/register', component: ClientRegisterComponent, canActivate: [LoginGuard] },
  { path: 'driver/home', component: DriverHubComponent, canActivate: [AuthGuard, RouteGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
