import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { APPID, APPCODE } from 'src/constants/map-credentials';
import { RideService } from 'src/app/service/ride.service';


@Component({
  selector: 'app-find-nearest',
  templateUrl: './find-nearest.component.html',
  styleUrls: ['./find-nearest.component.css']
})
export class FindNearestComponent implements OnInit {
  @ViewChild('mapView', null) mapView: MapComponent;
  private pickupAddressName: string;
  private destinationAddressName: string;
  private distancePickup: number;
  private ETAPickup: string;
  private distanceDestination: number;
  private ETADestination: string;
  private options: string[] = [];

  constructor(private rideService: RideService) { }
  ngOnInit() {
  }

  onSubmit(event) {
    this.pickupAddressName = event.target[0].value;
    this.destinationAddressName = event.target[1].value;
    this.mapView.findAdress(this.pickupAddressName, this.destinationAddressName);
  }

  receiveRouteParams($event) {
    if ($event.mode === 'pickup'){
      this.distancePickup = $event.distance;
      this.ETAPickup = $event.ETA;
    }else if ($event.mode === 'destination'){
      this.distanceDestination = $event.distance;
      this.ETADestination = $event.ETA;
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




