import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Driver } from 'src/app/models/Driver';
import { Store } from '@ngrx/store';
import { getSelectedDriver, selectAllDrivers } from 'src/app/store/reducers/driver.reducer';
import { Ride } from 'src/app/models/Ride';
import { RideService } from 'src/app/service/ride.service';
import { MapComponent } from '../map/map.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as actions from '../../store/actions';
import { MatSnackBar } from '@angular/material';
import { DataTableComponent } from '../data-table/data-table.component';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.css']
})
export class DriverDetailsComponent implements OnInit {


  private driver: Driver;
  private rides: Ride[] = [];
  private fareSum = 0;
  private currentRide: Ride;
  private buttonEndDisabled = true;
  private buttonCancelDisabled = true;
  private buttonArriveDisabled = true;
  @ViewChild('mapView', null) mapView: MapComponent;
  @ViewChild('dataTable', null) dataTable: DataTableComponent;

  constructor(
    private store: Store<any>,
    private rideService: RideService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(localStorage.getItem('currentUser'));
    const type = localStorage.getItem('currentUserType');
    this.store.select(selectAllUsers).subscribe(users => {
      if (users.length === 0) {
        this.store.dispatch(new actions.GetUser({ id, auth: false }));
      }
    });

    this.store.select(selectAllDrivers).subscribe(drivers => {
      if (drivers.length === 0){
        this.store.dispatch(new actions.GetDrivers());
      }
    });

    this.gatherDriverInfo();
  }

  update() {
    this.gatherDriverInfo();
  }


  gatherDriverInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    this.store.select(getSelectedDriver, { id }).subscribe(driver => {
      if (driver.length === 0) {
        this.store.dispatch(new actions.GetDrivers());
      }
      this.driver = driver;
    });

    this.rideService.getRide(this.driver.id).subscribe(rides => {
      this.rides = rides;
      this.rides.forEach(ride => {
        if (ride.isCanceled !== true) {
          this.fareSum += ride.fare;
        }
        if (ride.endTime === null && ride.isCanceled === false) {
          this.currentRide = ride;
        }
      });
    });
  }

  showOnMap() {
    this.mapView.showDetails(this.driver, this.currentRide);
  }

  deleteDriver() {
    this.store.dispatch(new actions.DeleteDriver(this.driver));
    this.router.navigateByUrl(`/`);
  }

}
