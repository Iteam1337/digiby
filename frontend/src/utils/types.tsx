export type Address = {
  address: string;
  coordinates: LngLat;
};

export type FormattedState = {
  from: Address;
  to: Address;
  time: string;
  date: string;
};

export type FormData = {
  from: Address;
  to: Address;
  date: Date;
};

type StopPosition = {
  lat: string;
  lng: string;
  name: string;
};

type Travelinfo = {
  arrival_time: string;
  meters_from_query_to_stop: number;
  stop_position: StopPosition;
};

type Stop = {
  arrival_time: string;
  stop_position: StopPosition;
};

export type LngLat = [number, number];

export type Departure = {
  date: string;
  cost: number;
  agency: string;
  vehicle_type: string;
  departure: Travelinfo;
  destination: Travelinfo;
  line_number: string;
  stops: Stop[];
  transportation_type: string;
  travel_time: number;
  geometry: LngLat[];
  id: string;
};

export type Departures = Departure[];

export type DepartureSearchParams = {
  fromLat: string;
  fromLng: string;
  toLat: string;
  toLng: string;
  time: string;
  date: string;
};
