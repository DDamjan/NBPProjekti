import { Ride } from '../models/Ride';
import { RideService } from '../service/ride.service';
import { Driver } from '../models/Driver';
import { APPID, APPCODE } from 'src/constants/map-credentials';
declare var H: any;

export function toMMSS(eta: number) {
    if (eta > 3600) {
        return Math.floor(eta / 60 / 60) + ' hours ' + Math.floor(eta / 60 % 60) + ' minutes ' + (eta % 60) + ' seconds. (in current traffic)';
    } else {
        return Math.floor(eta / 60) + ' minutes ' + (eta % 60) + ' seconds. (in current traffic)';
    }
}

export function toKM(distance: number) {
    if (distance >= 1000) {
        return (distance / 1000).toFixed(2) + ' km';
    } else {
        return distance + ' m';
    }
}

export function createRide(driver: Driver, route, address: string, rideService: RideService) {
    rideService.getLastID().subscribe(async ID => {
        const dateTime = new Date();
        let startingTime: string = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDay()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
        const ride: Ride = {
            ID: ID[0].ID + 1,
            driverID: driver.ID,
            startLat: driver.currentLat,
            startLng: driver.currentLng,
            destinationLat: route.lat,
            destinationLng: route.lng,
            destinationLocation: address,
            startLocation: driver.pickupLocation,
            startTime: startingTime,
            isCanceled: false
        };
        rideService.addRide(ride).subscribe();
    });
}


export function calculateFare(distance: number) {
    let fare = 110;
    const date = new Date();
    const time = date.getHours();
    if (distance >= 1000) {
        if (time >= 22 || time < 7) {
            fare += parseFloat((distance / 1000).toFixed(2)) * 50;
        } else {
            fare += parseFloat((distance / 1000).toFixed(2)) * 40;
        }
    } else {
        if (time >= 22 || time < 7) {
            fare += 50;
        } else {
            fare += 40;
        }
    }
    return fare;
}

export function fareDistance(distance: number, rideService: RideService, ID: number) {
    const fare = Math.floor(calculateFare(distance));
    const dst = toKM(distance);
    rideService.addDistanceFare(dst, fare, ID).subscribe();
}
