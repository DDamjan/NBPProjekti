import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'approve-ride',
  templateUrl: './approve-ride.component.html',
  styleUrls: ['./approve-ride.component.css']
})
export class ApproveRideComponent implements OnInit, AfterViewInit {

  public drivers: any[];
  public client: User;
  public closestDriver: User;
  @ViewChild('mapView', null) mapView: MapComponent;
  constructor() { }

  ngOnInit() {
    this.drivers = history.state.drivers.sort((a, b) => (a.distanceNum > b.distanceNum) ? 1 : -1);
    this.closestDriver = history.state.closestDriver;
    this.client = history.state.client;
    console.log(history.state);
  }

  ngAfterViewInit() {
    this.mapView.renderRequest(this.client.pickupLocation, this.client.destinationLocation, false, null);
  }

  receiveMapParams($event) {
    console.log($event);
    const selectedDriver = this.drivers.filter(driver => driver.driverID === $event.driverID)[0];
    this.mapView.clearMap();
    this.mapView.showDetails(selectedDriver, this.client);
  }
}
