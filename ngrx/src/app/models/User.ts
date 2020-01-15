export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    type: string;
    // Driver i Operator
    isActive?: boolean;
    // Driver
    phone?: number;
    car?: string;
    carColor?: string;
    licencePlate?: string;
    // Driver i Client
    currentLat?: number;
    currentLng?: number;
    currentLocation?: string;
    pickupLat?: number;
    pickupLng?: number;
    pickupLocation?: string;
}
