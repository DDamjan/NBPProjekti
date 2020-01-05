export interface Driver {
    ID: number;
    firstName: string;
    lastName: string;
    phone: number;
    car: string;
    color: string;
    licencePlate: string;
    currentLat: number;
    currentLng: number;
    currentLocation?: string;
    pickupLat?: number;
    pickupLng?: number;
    pickupLocation?: string;
    isActive: boolean;
}
