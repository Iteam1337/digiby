export type Address = {
  coordinates: [lon: number, lat: number];
  address: string;
};

export type FormData = {
  from: Address;
  to: Address;
  date: Date;
};