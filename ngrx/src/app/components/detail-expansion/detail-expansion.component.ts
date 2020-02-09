import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/User';
import { Ride } from 'src/app/models/Ride';
import { RideService } from 'src/app/service/ride.service';
import { Router } from '@angular/router';

@Component({
  selector: 'detail-expansion',
  templateUrl: './detail-expansion.component.html',
  styleUrls: ['./detail-expansion.component.css']
})

export class DetailExpansionComponent implements OnInit {

  panelOpenState = false;
  @Input() public driver: any;
  @Input() public client: any;

  @Output()
  mapParams = new EventEmitter<any>();


  constructor(private rideService: RideService, private router: Router) { }

  ngOnInit() {
  }

  onMap() {
    console.log(this.driver);
    const msg = {
      driverID: this.driver.driverID,
      currentLat: this.driver.currentLat,
      currentLng: this.driver.currentLng,
      currentLocation: this.driver.currentLocation
    };
    this.mapParams.emit(msg);
  }

  onAssign() {
    const dateTime = new Date();
    const startingTime: string = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDay()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
    const ride: Ride = {
      clientID: this.client.clientID,
      driverID: this.driver.driverID,
      pickupLat: this.client.currentLat,
      pickupLng: this.client.currentLng,
      destinationLat: this.client.destinationLat,
      destinationLng: this.client.destinationLng,
      destinationLocation: this.client.destinationLocation,
      pickupLocation: this.client.pickupLocation,
      startTime: startingTime,
      distance: this.client.distanceDestination,
      fare: this.client.fare
    };

    this.rideService.addRide(ride);
    this.router.navigate(['/']);
  }
}
