import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { APPID, APPCODE } from 'src/constants/map-credentials';
import { RideService } from 'src/app/service/ride.service';
import { WebSocketService } from '../../service/web-socket.service';
import { MatSnackBar } from '@angular/material';
import { calculateFare } from 'src/app/func/functions';
import { Driver } from 'src/app/models/Driver';
import { Store, select } from '@ngrx/store';
import * as actions from '../../store/actions';
import { Ride } from 'src/app/models/Ride';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-driver-hub',
  templateUrl: './driver-hub.component.html',
  styleUrls: ['./driver-hub.component.css']
})
export class DriverHubComponent implements OnInit {
  @ViewChild('mapView', null) mapView: MapComponent;
  private pickupAddressName: string;
  private destinationAddressName: string;
  private distancePickup: number;
  private ETAPickup: string;
  private distanceDestination: number;
  private ETADestination: string;
  private fare: number;
  private options: string[] = [];
  public isDriving: boolean;
  private driver: User;
  private ride: Ride;
  private buttonEndDisabled: boolean;
  private buttonCancelDisabled: boolean;
  private buttonArriveDisabled: boolean;
  private isActive: boolean;
  private request: boolean;
  private requestedRide: any;
  private distanceNum: number;
  private id: number;
  private rideHistory: Ride[];


  constructor(private rideService: RideService, private webSocketService: WebSocketService,
    private snackBar: MatSnackBar, private store: Store<any>) {
    this.isActive = false;
    this.request = false;
  }
  ngOnInit() {
    this.id = Number(localStorage.getItem('currentUser'));
    const type = localStorage.getItem('currentUserType');
    this.webSocketService.onConnect(this.id, type);
    this.store.select(selectAllUsers).subscribe(user => {
      if (user.length === 0) {
        this.store.dispatch(new actions.GetUser({ id: this.id, auth: true }));
      } else {
        this.driver = user[0];
      }
    });

    this.populateRideHistory();

    this.webSocketService.listen('Driver:' + this.id).subscribe((data: any) => {
      console.log(data);
      if (data.client !== undefined) {
        if (data.client.isRequest === true) {
          this.onRequest(data.client);
        }
      } else {
        if(data.isCanceled === true){
          this.mapView.clearMap();
          this.isActive = false;
          this.driver.isActive = false;
          this.isDriving = false;
          this.request = false;
          this.store.dispatch(new actions.UpdateUserSuccess(this.driver));
        }else{
          const ride = {
            pickupLat: data.pickupLat,
            pickupLng: data.pickupLng,
            destinationLat: data.destinationLat,
            destinationLng: data.destinationLng,
            destinationLocation: data.destinationLocation,
            pickupLocation: data.pickupLocation
          };
          this.mapView.showDetails(this.driver, ride);
          this.isDriving = true;
          this.isActive = true;
        }
      }
    });
  }

  showOnMap() {
    if (this.driver === undefined) {
      this.store.select(selectAllUsers).subscribe(driver => {
        this.driver = driver[0];
        this.mapView.addDriverToMap(this.driver);
      });
    } else {
      this.mapView.addDriverToMap(this.driver);
    }

  }

  receiveRouteParams($event) {
    if ($event.mode === 'pickup') {
      this.distancePickup = $event.distance;
      this.ETAPickup = $event.ETA;
      this.distanceNum = $event.distanceNum;
    } else if ($event.mode === 'destination') {
      this.distanceDestination = $event.distance;
      this.ETADestination = $event.ETA;
      this.fare = calculateFare($event.fare);
    }
  }

  arrive() {
    this.driver.currentLat = this.driver.pickupLat;
    this.driver.currentLng = this.driver.pickupLng;
    this.driver.currentLocation = this.driver.pickupLocation;

    this.driver.pickupLat = null;
    this.driver.pickupLng = null;
    this.driver.pickupLocation = null;

    // this.store.dispatch(new actions.UpdateDriver(this.driver));
    // this.mapView.showDetails(this.driver, this.ride);
    this.buttonArriveDisabled = true;
    this.snackBar.open(`Driver has arrived`, 'Close', {
      duration: 3000
    });
  }

  endRide() {
    const dateTime = new Date();
    this.ride.endTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDay()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
    this.rideService.updateRide(this.ride).subscribe();
    this.driver.isActive = false;
    this.driver.currentLat = this.ride.destinationLat;
    this.driver.currentLng = this.ride.destinationLng;
    this.driver.currentLocation = this.ride.destinationLocation;
    // this.store.dispatch(new actions.UpdateDriver(this.driver));
    // this.dataTable.onChange(this.ride);
    this.ride = null;
    // this.mapView.showDetails(this.driver, this.ride);

    this.buttonEndDisabled = true;

    this.snackBar.open(`Current ride has ended`, 'Close', {
      duration: 3000
    });

    // this.mapView.clearMap();
    // this.isActive = false;
    // this.driver.isActive = false;
    // this.isDriving = false;
    // this.request = false;
    // const ride = {
    //   pickupLat: data.pickupLat,
    //   pickupLng: data.pickupLng,
    //   destinationLat: data.destinationLat,
    //   destinationLng: data.destinationLng,
    //   destinationLocation: data.destinationLocation,
    //   pickupLocation: data.pickupLocation
    // };




    this.rideService.finishRide(ride).subscribe(() => {

    });
  }

  populateRideHistory() {
    this.rideService.getRideHistory(this.id).subscribe(rides => { this.rideHistory = rides; });

  }

  onRequest(req) {
    this.requestedRide = {
      clientID: req.clientID,
      firstName: req.firstName,
      lastName: req.lastName,
      pickupLat: req.pickupLat,
      pickupLng: req.pickupLng,
      pickupLocation: req.pickupLocation,
      destinationLat: req.destinationLat,
      destinationLng: req.destinationLng,
      destinationLocation: req.destinationLocation,
    };
    this.request = true;
    this.mapView.renderRequest(this.requestedRide.pickupLocation, this.requestedRide.destinationLocation, true, this.driver);

    this.snackBar.open(`Ride request!`, 'Close', {
      duration: 3000
    });
  }

  acceptRide() {
    const payload = {
      clientID: this.requestedRide.clientID,
      driverID: this.driver.id,
      firstName: this.driver.firstName,
      lastName: this.driver.lastName,
      currentLat: this.driver.currentLat,
      currentLng: this.driver.currentLng,
      currentLocation: this.driver.currentLocation,
      distancePickup: this.distancePickup,
      distanceNum: this.distanceNum
    };
    console.log(payload);
    this.store.dispatch(new actions.AcceptRide(payload));

    this.request = false;
    this.mapView.clearMap();

    this.snackBar.open(`Request accepted! Standby`, 'Close', {
      duration: 3000
    });
  }

  rejectRide() {
    this.request = false;
    this.mapView.clearMap();
    this.snackBar.open(`Request rejected`, 'Close', {
      duration: 3000
    });
  }
}


