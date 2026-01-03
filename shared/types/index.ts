export type UserType = 'TRAVELER' | 'LOCAL' | 'OPERATOR' | 'ADMIN';

export type Currency = 'USD' | 'MVR';

export type Language = 'EN' | 'DV' | 'ZH' | 'RU';

export type FerryType = 'PUBLIC' | 'SPEED' | 'PRIVATE';

export interface User {
    id: string;
    phone: string;
    email?: string;
    userType: UserType;
    currency: Currency;
    language: Language;
}

export interface Ferry {
    id: string;
    operatorId: string;
    departureFrom: string;
    arrivalAt: string;
    departureTime: string;
    arrivalTime: string;
    priceUSD: number;
    priceMVR: number;
    capacity: number;
    bookedSeats: number;
    ferryType: FerryType;
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
}
