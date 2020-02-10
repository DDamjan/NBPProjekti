export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    username?: string;
    type?: string;
    isActive?: boolean;
    // Driver
    phone?: string;
    car?: string;
    carColor?: string;
    licencePlate?: string;
    currentLat?: number;
    currentLng?: number;
    currentLocation?: string;
    // Driver i Client
    pickupLat?: number;
    pickupLng?: number;
    pickupLocation?: string;
    // Client
    destinationLat?: number;
    destinationLng?: number;
    destinationLocation?: string;
}
