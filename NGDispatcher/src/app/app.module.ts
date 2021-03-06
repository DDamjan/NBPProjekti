import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatGridListModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatExpansionModule
} from '@angular/material';
import { MapComponent } from './components/map/map.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { DriverCardComponent } from './components/driver-card/driver-card.component';
import { RouterModule } from '@angular/router';
import { ActiveDriversComponent } from './components/active-drivers/active-drivers.component';
import { DriverRegisterComponent } from './components/driver-register/driver-register.component';
import { RequestRideComponent } from './components/request-ride/request-ride.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { DriverEffects } from './store/effects/driver.effects';
import { DriverService } from './service/driver.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { DriverDetailsComponent } from './components/driver-details/driver-details.component';
import { RideService } from './service/ride.service';
import { DataTableComponent } from './components/data-table/data-table.component';
import { LoginComponent } from './components/login/login.component';
import { reducers } from './store/reducers';
import { UserEffects } from './store/effects/user.effects';
import { UserService } from './service/user.service';
import { DriverHubComponent } from './components/driver-hub/driver-hub.component';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { DetailExpansionComponent } from './components/detail-expansion/detail-expansion.component';
import { ApproveRideComponent } from './components/approve-ride/approve-ride.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    MapComponent,
    DriverCardComponent,
    MapViewComponent,
    ActiveDriversComponent,
    DriverRegisterComponent,
    RequestRideComponent,
    DriverDetailsComponent,
    DataTableComponent,
    LoginComponent,
    ClientRegisterComponent,
    DriverHubComponent,
    DetailExpansionComponent,
    ApproveRideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    StoreDevtoolsModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({}),
    RouterModule,
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([DriverEffects, UserEffects]),
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule
  ],
  providers: [DriverService, RideService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
