
export interface OmrahPackage {
  id: string;
  packageName: string;
  duration: number; // in days
  makkahHotel: string;
  madinahHotel: string;
  hotelDistance: string; // e.g., '500m from Haram'
  roomType: 'Quad' | 'Triple' | 'Double';
  transportType: 'Bus' | 'Private Car';
  airline: string;
  price: number; // in BDT
  inclusions: string[];
  exclusions: string[];
}
