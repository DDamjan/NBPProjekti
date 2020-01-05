import { Component, OnInit, ViewChild } from '@angular/core';
import { Driver } from 'src/app/models/Driver';
import { Store } from '@ngrx/store';
import { selectAllDrivers } from 'src/app/store/reducers/driver.reducer';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  @ViewChild('mapView', null) mapView: MapComponent;
  drivers: Driver[] = [];
  activeRides: number = 0;

  constructor(private store$: Store<any>) { }

  ngOnInit() {
    this.store$.select(selectAllDrivers).subscribe(drivers => {
      drivers.forEach(d => this.drivers.push(d));
    });

    this.drivers.forEach(d => {
      if (d.isActive === true) {
        this.activeRides++;
      }
    });
  }

  onClick() {
    this.mapView.addDriversToMap(this.drivers);
  }
}
