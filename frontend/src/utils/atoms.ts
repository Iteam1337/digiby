import { atom } from 'jotai';

import { Departure, Departures, DepartureSearchParams } from './types';
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
  address: { from: string; to: string };
  coordinates: { lat: string; lng: string };
};

export const fromToAtom = atom<FromTo>({
  address: { from: '', to: '' },
  coordinates: { lat: '', lng: '' },
});
