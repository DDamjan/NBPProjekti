export interface Ride {
    id?: number;
    clientID: number;
    driverID: number;
    driverFirstName: string;
    driverLastName: string;
    driverCurrentLat: number;
    driverCurrentLng: number;
    driverLocation: string;
    operatorID?: number;
    pickupLat: number;
    pickupLng: number;
    destinationLat: number;
    destinationLng: number;
    pickupLocation: string;
    destinationLocation: string;
    startTime: string;
    endTime?: string;
    isCanceled?: boolean;
    fare?: any;
    distance?: string;
}
