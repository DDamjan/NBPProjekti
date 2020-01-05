import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Driver } from 'src/app/models/Driver';
import { Store } from '@ngrx/store';
import { getSelectedDriver } from 'src/app/store/reducers/driver.reducer';
import { Ride } from 'src/app/models/Ride';
import { RideService } from 'src/app/service/ride.service';
import { MapComponent } from '../map/map.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as driverActions from '../../store/actions';
import { MatSnackBar } from '@angular/material';
import { DataTableComponent } from '../data-table/data-table.component';

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
    const ID = +this.route.snapshot.paramMap.get('id');
    this.store.select(getSelectedDriver, { id: ID }).subscribe(driver => {
      this.driver = driver;
    });

    this.rideService.getRide(this.driver.ID).subscribe(rides => {
      this.rides = rides;
      this.rides.forEach(ride => {
        if (ride.isCanceled !== true) {
          this.fareSum += ride.fare;
        }
        if (ride.endTime === null && ride.isCanceled === false) {
          this.currentRide = ride;
        }
      });
      if (this.currentRide !== undefined) {
        if (this.driver.pickupLat === null && this.driver.pickupLng === null) {
          this.buttonArriveDisabled = true;
          this.buttonEndDisabled = false;
          this.buttonCancelDisabled = true;
        } else {
          this.buttonArriveDisabled = false;
          this.buttonEndDisabled = true;
          this.buttonCancelDisabled = false;
        }
      }
    });
  }



  showOnMap() {
    this.mapView.showDetails(this.driver, this.currentRide);
  }

  arrive() {
    this.driver.currentLat = this.driver.pickupLat;
    this.driver.currentLng = this.driver.pickupLng;
    this.driver.currentLocation = this.driver.pickupLocation;

    this.driver.pickupLat = null;
    this.driver.pickupLng = null;
    this.driver.pickupLocation = null;

    this.store.dispatch(new driverActions.UpdateDriver(this.driver));
    this.mapView.showDetails(this.driver, this.currentRide);
    this.buttonEndDisabled = false;
    this.buttonCancelDisabled = true;
    this.buttonArriveDisabled = true;
    this.snackBar.open(`Driver has arrived`, 'Close', {
      duration: 3000
    });
  }

  endRide() {
    const dateTime = new Date();
    this.currentRide.endTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDay()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
    this.rideService.updateRide(this.currentRide).subscribe();
    this.driver.isActive = false;
    this.driver.currentLat = this.currentRide.destinationLat;
    this.driver.currentLng = this.currentRide.destinationLng;
    this.driver.currentLocation = this.currentRide.destinationLocation;
    this.store.dispatch(new driverActions.UpdateDriver(this.driver));
    this.dataTable.onChange(this.currentRide);
    this.currentRide = null;
    this.mapView.showDetails(this.driver, this.currentRide);

    this.buttonEndDisabled = true;

    this.snackBar.open(`Current ride has ended`, 'Close', {
      duration: 3000
    });
  }

  cancelRide() {
    const dateTime = new Date();
    this.currentRide.endTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDay()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
    this.currentRide.isCanceled = true;
    this.rideService.updateRide(this.currentRide).subscribe();
    this.driver.isActive = false;
    this.store.dispatch(new driverActions.UpdateDriver(this.driver));
    this.dataTable.onChange(this.currentRide);
    this.currentRide = null;
    this.mapView.showDetails(this.driver, this.currentRide);

    this.buttonCancelDisabled = true;
    this.buttonArriveDisabled = true;

    this.snackBar.open(`Current ride has been canceled`, 'Close', {
      duration: 3000
    });
  }

  deleteDriver() {
    this.store.dispatch(new driverActions.DeleteDriver(this.driver));
    this.router.navigateByUrl(`/`);
  }

}
