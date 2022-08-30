import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Departure, Departures, DepartureSearchParams, LngLat } from './types';
import getTransports from './getTransports';

export type DeparturesData = {
  loading: boolean;
  error: string | null;
  data: Departures | null;
};

const fetchDepartures = atom<DeparturesData>({
  loading: true,
  error: null,
  data: null,
});

export const departuresAtom = atom(
  (get) => get(fetchDepartures),
  (_get, set, searchParams: DepartureSearchParams) => {
    const fetchData = async () => {
      set(fetchDepartures, (prev) => ({ ...prev, loading: true }));
      try {
        const data = await getTransports(searchParams);
        set(fetchDepartures, { loading: false, error: null, data });
      } catch (error: any) {
        set(fetchDepartures, { loading: false, error, data: null });
      }
    };
    fetchData();
  }
);

export const departuresDetails = atom<Departure | null>(null);

type FromTo = {
  from: { address: string; coordinates: LngLat };
  to: { address: string; coordinates: LngLat };
};

export const fromToAtom = atom<FromTo>({
  from: { address: '', coordinates: [0, 0] },
  to: { address: '', coordinates: [0, 0] },
});

export const bookingsAtom = atomWithStorage<{ id: string; seats: number }[]>(
  'bookings',
  []
);
