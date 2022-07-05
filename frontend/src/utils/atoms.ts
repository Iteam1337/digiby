import { atom } from 'jotai';

import { Departure, DepartureSearchParams } from './types';
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
  from?: string;
  to?: string;
};

export const fromToAddressAtom = atom<FromTo>({ from: '', to: '' });
