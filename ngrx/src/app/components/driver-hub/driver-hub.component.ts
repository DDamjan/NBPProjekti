import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { APPID, APPCODE } from 'src/constants/map-credentials';
import { RideService } from 'src/app/service/ride.service';
import { WebSocketService } from '../../service/web-socket.service';
import { MatSnackBar } from '@angular/material';
import { calculateFare } from 'src/app/func/functions';

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
  public isDriving = true;

  constructor(private rideService: RideService, private webSocketService: WebSocketService, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.webSocketService.listen('').subscribe((data: any) => {
      console.log(data);
      this.mapView.renderDriver(data, this.pickupAddressName);
      this.snackBar.open(` ${data.id} en route`, 'Close', {
        duration: 3000
      });
    });
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
}
