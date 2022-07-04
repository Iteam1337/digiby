import { atom } from 'jotai';

import { Departure, FormattedState } from './types';
import getTransports from './getTransports';

export type DeparturesData = {
  loading: boolean;
  error: string | null;
  data: Departure[] | null;
};

const fetchDepartures = atom<DeparturesData>({
  loading: true,
  error: null,
  data: null,
});

export const departuresAtom = atom(
  (get) => get(fetchDepartures),
  (_get, set, formData: FormattedState) => {
    const fetchData = async () => {
      set(fetchDepartures, (prev) => ({ ...prev, loading: true }));
      try {
        const data = await getTransports(formData);
        set(fetchDepartures, { loading: false, error: null, data });
      } catch (error: any) {
        set(fetchDepartures, { loading: false, error, data: null });
      }
    };
    fetchData();
  }
);

export const departuresDetails = atom<Departure>({
  cost: 1,
  departure: {
    arrival_time: '',
    meters_from_query_to_stop: 1,
    stop_position: {
      lng: '',
      lat: '',
      name: '',
    },
  },
  destination: {
    arrival_time: '',
    meters_from_query_to_stop: 1,
    stop_position: {
      lng: '',
      lat: '',
      name: '',
    },
  },
  line_number: '51',
  stops: [
    {
      arrival_time: '13:50',
      stop_position: {
        lng: '',
        lat: '',
        name: '',
      },
    },
  ],
  transportation_type: 'buss',
  travel_time: 1,
  geometry: [0, 0],
});
