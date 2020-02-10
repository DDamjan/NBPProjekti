import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Driver } from 'src/app/models/Driver';
import { Store } from '@ngrx/store';
import { getSelectedDriver } from 'src/app/store/reducers/driver.reducer';
import { Ride } from 'src/app/models/Ride';
import { RideService } from 'src/app/service/ride.service';
import { MapComponent } from '../map/map.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as actions from '../../store/actions';
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
          this.fareSum += ride.fare.low;
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

  deleteDriver() {
    this.store.dispatch(new actions.DeleteDriver(this.driver));
    this.router.navigateByUrl(`/`);
  }

}
