import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { APPID, APPCODE } from '../../../constants/map-credentials';
import { toMMSS, toKM, fareDistance } from 'src/app/func/functions';
import { Store } from '@ngrx/store';
import { taxiBlack, taxiWhite } from 'src/constants/svgs';
import { Driver } from 'src/app/models/Driver';
import { MatSnackBar } from '@angular/material';
import { RideService } from 'src/app/service/ride.service';
import { Ride } from 'src/app/models/Ride';
import * as mapConstants from 'src/constants/nis-loc';
declare var H: any;

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  @ViewChild('map', null)
  public mapElement: ElementRef;
  public drivers: Driver[] = [];
  public platform: any;
  public ui: any;
  public map: any;
  public defaultLayers: any;

  @Input()
  public width: any;

  @Input()
  public height: any;

  @Input()
  public float: any;

  @Input()
  public lat: number;

  @Input()
  public lng: number;

  @Input()
  public zoom: number;

  @Input()
  public mode: string;

  @Output()
  routeParams = new EventEmitter<any>();

  public constructor(public store: Store<any>, private snackBar: MatSnackBar, private rideService: RideService) { }

  public ngOnInit() {
    // this.store.select(selectAllDrivers).subscribe(drivers => {
    //   drivers.forEach(d => {console.log(typeof(d.currentLat)); this.drivers.push(d)});
    // });
  }

  public async ngAfterViewInit() {
    this.platform = await new H.service.Platform({
      app_id: APPID,
      app_code: APPCODE
    });
    this.defaultLayers = await this.platform.createDefaultLayers();
    this.map = await new H.Map(
      this.mapElement.nativeElement,
      this.defaultLayers.normal.map,
      {
        zoom: this.zoom,
        center: { lat: this.lat, lng: this.lng }
      }
    );
    const behavior = await new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = await H.ui.UI.createDefault(this.map, this.defaultLayers);

    this.map.addEventListener('tap', (evt) => {
      const bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
        content: evt.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);
  }

  public renderRequest(pickupAddress: string, destinationAddress: string) {
    const geocoder = this.platform.getGeocodingService();
    const geocodingParameters = {
      searchText: pickupAddress,
      jsonattributes: 1
    };

    geocoder.geocode(
      geocodingParameters, (result) => {
        this.onSuccess(result, pickupAddress, destinationAddress);
      }, (error) => { console.log(error); }
    );
  }

  public clearMap(){
    this.map.removeObjects(this.map.getObjects());
    const coord = {
      lat: mapConstants.konjLat,
      lng: mapConstants.konjLng
    };
    this.map.setCenter(coord);
  }

  public renderDriver(driver: any, pickupAddress: any) {
    const geocoder = this.platform.getGeocodingService();
    const geocodingParameters = {
      searchText: pickupAddress,
      jsonattributes: 1
    };

    geocoder.geocode(
      geocodingParameters, (result) => {
        this.renderDriverSuccess(driver, result);
      }, (error) => { console.log(error); }
    );
  }

  public renderDriverSuccess(driver: any, pickupCoords: any) {
    const pickupRoute = pickupCoords.response.view[0].result;
    const extractedCoords = {
      lat: pickupRoute[0].location.displayPosition.latitude,
      lng: pickupRoute[0].location.displayPosition.longitude
    };

    const driverCoords = {
      lat: driver.currentLat,
      lng: driver.currentLng,
      mode: 'driver'
    };

    this.addDriverToMap(driver);
    this.calculateRouteFromAtoB(driverCoords, extractedCoords);
  }

  onSuccess(resultAddress, pickupAddressString: string, destinationAddressString: string) {
    const pickupRoute = resultAddress.response.view[0].result;
    const pickupCoord = {
      lat: pickupRoute[0].location.displayPosition.latitude,
      lng: pickupRoute[0].location.displayPosition.longitude,
      mode: 'location'
    };

    this.addLocationToMap(pickupCoord, pickupAddressString);

    this.findDestination(pickupCoord, destinationAddressString);
    this.snackBar.open(`Ride requested`, 'Close', {
      duration: 3000
    });
  }

  findDestination(pickupLocation, destinationAddress: string) {
    const geocoder = this.platform.getGeocodingService();
    const geocodingParameters = {
      searchText: destinationAddress,
      jsonattributes: 1
    };

    geocoder.geocode(
      geocodingParameters, (result) => {
        this.drawDestination(result, pickupLocation, destinationAddress);
      }, (error) => { console.log(error); }
    );
  }

  drawDestination(destinationCoords, pickupLocation: any, destinationAddressString: string) {
    const destinationRoute = destinationCoords.response.view[0].result;
    const destinationCoord = {
      lat: destinationRoute[0].location.displayPosition.latitude,
      lng: destinationRoute[0].location.displayPosition.longitude,
      mode: 'location'
    };

    this.addLocationToMap(destinationCoord, destinationAddressString);
    this.calculateRouteFromAtoB(pickupLocation, destinationCoord);

    // createRide(nearestDriver, destinationCoord, destinationAddressString, this.rideService);
    // this.snackBar.open(`Driver assigned. Car no: ${nearestDriver.id}`, 'Close', {
    //   duration: 3000
    // });
  }

  addLocationToMap(location, addressString) {
    const marker = new H.map.Marker(location);
    marker.setData(`Destination: ${addressString}`);
    this.map.addObject(marker);
    this.map.setCenter(location);
    this.map.setZoom(14);
  }

  findNearestDriver(locationCoords) {
    this.map.removeObjects(this.map.getObjects());
    if (this.map.getObjects().length === 0) {
      this.drivers.forEach((d, index) => {
        if (d.isActive === false && (d.currentLat !== locationCoords.lat && d.currentLng !== locationCoords.lng)) {
          const coords = {
            lat: d.currentLat,
            lng: d.currentLng
          };
          const driverLocation = new H.map.Marker(coords);
          driverLocation.setData(index);
          this.map.addObject(driverLocation);
        }
      });
    }
    const objects = this.map.getObjects();
    if (objects.length !== 0) {
      let minDist = objects[0].getPosition().distance(locationCoords);
      let markerDist;
      let nearestIndex = objects[0].getData();
      const len = this.map.getObjects().length;

      // iterate over objects and calculate distance between them
      for (let i = 1; i < len; i++) {
        markerDist = objects[i].getPosition().distance(locationCoords);
        if (markerDist < minDist) {
          minDist = markerDist;
          nearestIndex = objects[i].getData();
        }
      }
      this.map.removeObjects(this.map.getObjects());
      return this.drivers[nearestIndex];
    } else {
      return null;
    }
  }

  addDriverToMap(driver) {
    const coord = {
      lat: driver.currentLat,
      lng: driver.currentLng
    };
    let svg;
    if (driver.isActive) {
      svg = taxiBlack;
    } else {
      svg = taxiWhite;
    }
    const driverIcon = new H.map.Icon(svg);
    const marker = new H.map.Marker(coord, { icon: driverIcon });
    marker.setData(`Car no: ${driver.id} Name: ${driver.firstName} ${driver.lastName}`);
    this.map.addObject(marker);
    this.map.setCenter(coord);
  }

  addDriversToMap(drivers) {
    drivers.forEach(driver => {
      this.addDriverToMap(driver);
    });
  }

  calculateRouteFromAtoB(waypoint1, waypoint2) {
    const router = this.platform.getRoutingService();
    const convertCoordsWP1 = waypoint1.lat + ',' + waypoint1.lng;
    const convertCoordsWP2 = waypoint2.lat + ',' + waypoint2.lng;
    const routeRequestParams = {
      mode: 'fastest;car',
      representation: 'display',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      waypoint0: convertCoordsWP1,
      waypoint1: convertCoordsWP2
    };

    router.calculateRoute(
      routeRequestParams, (success) => {
        this.addRouteShapeToMap(success, waypoint1.mode);
        this.alertDispatcher(success, waypoint1.mode);
        if (waypoint1.mode === 'location') {
          fareDistance(success.response.route[0].summary.distance, this.rideService, waypoint1.driverID);
        }
      },
      (error) => { console.log(error); }
    );
  }

  addRouteShapeToMap(result, mode) {
    const route = result.response.route[0];
    const lineString = new H.geo.LineString();
    const routeShape = route.shape;
    let polyline;

    routeShape.forEach((point) => {
      const parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    if (mode === 'driver') {
      polyline = new H.map.Polyline(lineString, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(240, 128, 128, 0.7)'
        }
      });
    } else if (mode === 'location' || mode === 'location-detail') {
      polyline = new H.map.Polyline(lineString, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });
    }


    this.map.addObject(polyline);
  }

  alertDispatcher(result, mode) {
    const route = result.response.route[0];
    if (mode === 'driver') {
      const msg = {
        distance: toKM(route.summary.distance),
        ETA: toMMSS(route.summary.travelTime),
        mode: 'pickup'
      };
      this.routeParams.emit(msg);
    } else {
      const msg = {
        distance: toKM(route.summary.distance),
        ETA: toMMSS(route.summary.travelTime),
        mode: 'destination',
        fare: route.summary.distance,
        pickupLat: route.waypoint[0].originalPosition.latitude,
        pickupLng: route.waypoint[0].originalPosition.longitude,
        destinationLat: route.waypoint[1].originalPosition.latitude,
        destinationLng: route.waypoint[1].originalPosition.longitude
      };
      this.routeParams.emit(msg);
    }

  }

  removeUnwanted(index) {
    const objects = this.map.getObjects();
    const length = objects.length;
    if (length - 1 !== index) {
      const obj = objects[length - 1].setVisibility(false);
      objects[length - 1] = obj;
    }
  }

  showDetails(driver: Driver, ride: Ride) {
    this.map.removeObjects(this.map.getObjects());
    const driverCoord = {
      lat: driver.currentLat,
      lng: driver.currentLng,
      mode: 'driver'
    };

    if (ride !== undefined && ride != null) {
      const destCoord = {
        lat: ride.destinationLat,
        lng: ride.destinationLng,
        mode: 'location-detial'
      };

      if (driver.pickupLat !== null && driver.pickupLng !== null) {

        const pickupCoord = {
          lat: driver.pickupLat,
          lng: driver.pickupLng,
          mode: 'location-detail'
        };

        this.addDriverToMap(driver);
        const markerPickup = new H.map.Marker(pickupCoord);
        markerPickup.setData(`Destination: ${driver.pickupLocation}`);
        this.map.addObject(markerPickup);
        this.calculateRouteFromAtoB(driverCoord, pickupCoord);

        const markerDest = new H.map.Marker(destCoord);
        markerDest.setData(`Destination: ${driver.pickupLocation}`);
        this.map.addObject(markerDest);
        this.calculateRouteFromAtoB(pickupCoord, destCoord);

        this.map.setCenter(destCoord);
        this.map.setZoom(14);
      } else {
        this.addDriverToMap(driver);
        const marker = new H.map.Marker(destCoord);
        marker.setData(`Destination: ${ride.destinationLocation}`);
        this.map.addObject(marker);
        this.map.setCenter(destCoord);
        this.map.setZoom(14);
        this.calculateRouteFromAtoB(driverCoord, destCoord);
      }
    } else {
      this.addDriverToMap(driver);
      this.map.setCenter(driverCoord);
      this.map.setZoom(14);
    }
  }
}
