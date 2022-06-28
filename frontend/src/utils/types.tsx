export type Address = {
  coordinates: [lon: number, lat: number];
  address: string;
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

export type Departures = {
  cost: number;
  departure: Travelinfo;
  destination: Travelinfo;
  line_number: string;
  stops: Stop[];
  transportation_type: string;
  travel_time: number;
};
