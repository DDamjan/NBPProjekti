import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { APPID, APPCODE } from 'src/constants/map-credentials';
import { RideService } from 'src/app/service/ride.service';
import { WebSocketService } from '../../service/web-socket.service';
import { MatSnackBar } from '@angular/material';
import { calculateFare } from 'src/app/func/functions';
import * as actions from '../../store/actions';
import { Store, select } from '@ngrx/store';
import { selectAllUsers } from 'src/app/store/reducers/user.reducer';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Ride } from 'src/app/models/Ride';
import { FormControl } from '@angular/forms';
import { selectAllRides } from 'src/app/store/reducers/ride.reducer';

@Component({
  selector: 'app-request-ride',
  templateUrl: './request-ride.component.html',
  styleUrls: ['./request-ride.component.css']
})
export class RequestRideComponent implements OnInit, AfterViewInit {
  @ViewChild('mapView', null) mapView: MapComponent;
  private pickupLat: number;
  private pickupLng: number;
  private pickupAddressName: string;

  private destinationLat: number;
  private destinationLng: number;
  private destinationAddressName: string;

  private distancePickup: string;
  private ETAPickup: string;
  private distanceDestination: number;
  private ETADestination: string;
  private fare: number;
  private options: string[] = [];
  public isRequested: boolean;
  private user: User;
  private again: boolean;
  private driver: User;
  private ride: Ride;
  private favouriteRides: Ride[];
  private rideHistory: Ride[];
  private id: number;
  selected = new FormControl(0);
  private isEnroute = false;
  private driverID: number;
  public cancelDisabled: boolean;

  constructor(private store: Store<any>, private rideService: RideService,
    private webSocketService: WebSocketService, private snackBar: MatSnackBar, private location: Location,
    private route: ActivatedRoute, private router: Router, private userService: UserService) { this.again = false; }

  ngOnInit() {
    this.id = Number(localStorage.getItem('currentUser'));
    const type = localStorage.getItem('currentUserType');
    this.webSocketService.onConnect(this.id, type);
    this.store.select(selectAllUsers).subscribe(currentUser => {
      if (currentUser.length === 0) {
        this.store.dispatch(new actions.GetUser({ id: this.id, auth: true }));
      } else {
        this.user = currentUser[0];
        this.store.select(selectAllRides).subscribe(currentRide => {
          if (Object.keys(currentRide[0]).length !== 0) {
            this.isEnroute = true;
            this.ride = currentRide[0];
            this.driverID = Number(localStorage.getItem('designatedDriver'));
            this.userService.getUser({ id: this.driverID, auth: false }).subscribe(currentDriver => {
              this.driver = currentDriver.user;
              this.mapView.showDetails(this.driver, this.ride);
            });
            // const payload = {
            //   clientID: this.user.id,
            //   rideID: this.ride.id
            // };
            // if (this.ride.id !== undefined) {
            //   this.userService.getDriverByRide(payload).subscribe(designatedDriver => {
            //     this.driverID = designatedDriver.id;
            //   });
            // } else {

            // }

          }
        });
        this.isRequested = this.user.isActive;
        if (this.isRequested) {
          if (this.mapView.platform !== undefined) {
            this.mapView.renderRequest(this.user.currentLocation, this.user.destinationLocation, false, null);
          }
        }
      }
    });

    this.populateRideHistory();

    this.webSocketService.listen('Client:' + this.id).subscribe((data: any) => {
      console.log(data);
      if (data.hasArrived !== undefined || data.hasFinished !== undefined) {
        if (data.hasArrived === true) {
          this.mapView.clearMap();
          this.driver.currentLat = data.pickupLat;
          this.driver.currentLng = data.pickupLng;
          this.driver.currentLocation = data.pickupLocation;
          this.mapView.showDetails(this.driver, this.ride);
          this.cancelDisabled = true;
        } else if (data.hasFinished === true) {
          this.driver.currentLat = data.destinationLat;
          this.driver.currentLng = data.destinationLng;
          this.driver.currentLocation = data.destinationLocation;
          this.mapView.clearMap();
          this.isRequested = false;
        }
      } else {
        this.driver = {
          id: data.driverID,
          firstName: data.firstName,
          lastName: data.lastName,
          currentLat: data.driverCurrentLat,
          currentLng: data.driverCurrentLng,
          currentLocation: data.drvierLocation,
          isActive: true
        };
        this.isEnroute = true;
        localStorage.setItem('designatedDriver', String(this.driver.id));
        setTimeout(() => {
          this.store.dispatch(new actions.GetUser({ id: this.id, auth: false }));
          this.mapView.renderDriver(this.driver, this.pickupAddressName);
        }, 1000);
        this.snackBar.open(`Driver ${data.driverID} en route`, 'Close', {
          duration: 3000
        });
      }
    });
  }

  ngAfterViewInit() {
    if (this.isRequested) {
      this.mapView.renderRequest(this.user.currentLocation, this.user.destinationLocation, false, null);
    } else if (this.isEnroute) {
      this.mapView.showDetails(this.driver, this.ride);
    }
  }

  populateRideHistory() {
    this.rideService.getTopRides(this.id).subscribe(rides => {
      this.favouriteRides = rides;
      this.favouriteRides.sort((a, b) => (a.count > b.count) ? 1 : -1);
    });
    this.rideService.getRideHistory(this.id).subscribe(rides => { this.rideHistory = rides; });

  }

  update() {
    this.ngOnInit();
  }

  onSubmit(event) {
    this.pickupAddressName = event.target[0].value;
    this.destinationAddressName = event.target[1].value;
    if (this.pickupAddressName !== '' && this.destinationAddressName !== '') {
      this.mapView.renderRequest(this.pickupAddressName, this.destinationAddressName, false, null);
      if (this.user === undefined) {
        this.store.select(selectAllUsers).subscribe(user => {
          this.user = user[0];
        });
      }
    } else {
      this.snackBar.open('Enter a valid address!', 'Close', {
        duration: 3000
      });
    }

  }

  updateAndRequest() {
    this.user.currentLat = this.pickupLat;
    this.user.currentLng = this.pickupLng;
    this.user.currentLocation = this.pickupAddressName;

    const payload = {
      client: {
        clientID: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        pickupLat: this.user.currentLat,
        pickupLng: this.user.currentLng,
        pickupLocation: this.user.currentLocation,
        destinationLat: this.destinationLat,
        destinationLng: this.destinationLng,
        destinationLocation: this.destinationAddressName,
        distanceDestination: this.distanceDestination,
        fare: this.fare,
        isRequest: true
      }
    };

    if (this.isRequested !== true) {
      this.isRequested = true;
      this.user.isActive = true;
      this.snackBar.open('Ride requested!', 'Close', {
        duration: 3000
      });
      this.store.dispatch(new actions.RequestRide(payload));
    }
  }

  receiveRouteParams($event) {
    if ($event.mode === 'pickup') {
      this.distancePickup = $event.distance;
      this.ETAPickup = $event.ETA;
    } else if ($event.mode === 'destination') {
      this.pickupLat = $event.pickupLat;
      this.pickupLng = $event.pickupLng;
      this.distanceDestination = $event.distance;
      this.destinationLat = $event.destinationLat;
      this.destinationLng = $event.destinationLng;
      this.ETADestination = $event.ETA;
      this.fare = calculateFare($event.fare);

      if (this.distancePickup === '0 m') {
        this.cancelDisabled = true;
      }
      this.updateAndRequest();
    }
  }

  autoCompleteListener(event) {
    let query = '';
    this.options.length = 0;
    if (query !== event.target.value) {
      if (event.target.value.length >= 1) {

        const params = '?' +
          'query=' + encodeURIComponent(event.target.value) +   // The search text which is the basis of the query
          '&maxresults=5' +
          '&app_id=' + APPID +
          '&app_code=' + APPCODE;
        this.rideService.findRideAddress(params).subscribe(suggestion => suggestion.suggestions.forEach(s => this.options.push(s.label)));
      }
    }
    query = event.target.value;

  }

  cancelRide() {
    this.mapView.clearMap();
    this.isRequested = false;
    let payload;
    if (this.driver === undefined || this.ride === undefined) {
      payload = {
        clientID: this.user.id,
        isAssigned: false,
        isCanceled: true
      };
    } else {
      const dateTime = new Date();
      const endTime: string = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDay()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
      payload = {
        clientID: this.user.id,
        rideID: this.ride.id,
        driverID: this.driverID,
        destinationLat: this.user.destinationLat,
        destinationLng: this.user.destinationLng,
        destinationLocation: this.user.destinationLocation,
        endTime,
        isCanceled: true,
        isAssigned: true
      };
    }
    this.store.dispatch(new actions.CancelRide(payload));
    this.snackBar.open('Ride canceled!', 'Close', {
      duration: 3000
    });
  }

  receiveMapParams($event) {
    this.pickupAddressName = this.user.currentLocation;
    this.destinationAddressName = $event.destinationLocation;
    this.selected.setValue(0);
    this.mapView.renderRequest(this.pickupAddressName, this.destinationAddressName, false, null);
  }
}
