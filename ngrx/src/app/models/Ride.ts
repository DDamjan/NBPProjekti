export interface Ride{
    ID: number;
    driverID: number;
    startLat: number;
    startLng: number;
    destinationLat: number;
    destinationLng: number;
    startLocation: string;
    destinationLocation: string;
    startTime: string;
    endTime?: string;
    isCanceled: boolean;
    fare?: number;
    distance?: string;
}