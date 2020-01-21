import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-request-ride',
  templateUrl: './request-ride.component.html',
  styleUrls: ['./request-ride.component.css']
})
export class RequestRideComponent implements OnInit {
  @ViewChild('mapView', null) mapView: MapComponent;
  private pickupAddressName: string;
  private destinationAddressName: string;
  private distancePickup: number;
  private ETAPickup: string;
  private distanceDestination: number;
  private ETADestination: string;
  private fare: number;
  private options: string[] = [];
  public isRequested = true;
  private user: User;

  constructor(private store: Store<any>, private rideService: RideService,
              private webSocketService: WebSocketService, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.store.select(selectAllUsers).subscribe(currentUser => {
      if (currentUser.length === 0) {
        // tslint:disable-next-line: radix
        const id = parseInt(localStorage.getItem('currentUser'));
        this.store.dispatch(new actions.GetUser(id));
        this.store.select(selectAllUsers).subscribe(current => {
          this.user = current[0];
        });
      } else {
        this.store.select(selectAllUsers).subscribe(current => {
          this.user = current[0];
        });
      }
    });
    this.webSocketService.listen(`user:${this.user.id}`).subscribe((data: any) => {
      console.log(data);
      this.mapView.renderDriver(data, this.pickupAddressName);
      this.snackBar.open(`Driver ${data.id} en route`, 'Close', {
        duration: 3000
      });
    });
  }

  onSubmit(event) {
    this.pickupAddressName = event.target[0].value;
    this.destinationAddressName = event.target[1].value;
    if (this.pickupAddressName !== '' && this.destinationAddressName !== '') {
      this.mapView.renderRequest(this.pickupAddressName, this.destinationAddressName);

      const payload = {
        clientID: this.user.id,
        currentLat: this.user.currentLat,
        currentLng: this.user.currentLng,
        currentLocation: this.user.currentLocation,
        destinationLat: this.user.destinationLat,
        destinationLng: this.user.destinationLng,
        destinationLocation: this.user.destinationLocation
      };

      this.rideService.requestRide(payload).subscribe();
      this.isRequested = false;
    } else {
      this.snackBar.open('Enter a valid address!', 'Close', {
        duration: 3000
      });
    }

  }

  receiveRouteParams($event) {
    if ($event.mode === 'pickup') {
      this.distancePickup = $event.distance;
      this.ETAPickup = $event.ETA;
    } else if ($event.mode === 'destination') {
      this.distanceDestination = $event.distance;
      this.ETADestination = $event.ETA;
      this.fare = calculateFare($event.fare);
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
}




