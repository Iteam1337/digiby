export type Address = {
  coordinates: [lon: number, lat: number];
  address: string;
};

export type FormData = {
  from: Address | undefined;
  to: Address | undefined;
  time: string;
  date: string;
};
