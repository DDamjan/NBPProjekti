export interface Driver {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
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
