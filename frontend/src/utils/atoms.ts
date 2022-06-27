import { atom } from 'jotai';

import { FormData } from './types';
import getTransports from './getTransports';

export type DeparturesData = {
  loading: boolean;
  error: string | null;
  data: any;
};

const fetchDepartures = atom<DeparturesData>({
  loading: true,
  error: null,
  data: null,
});

export const departuresAtom = atom(
  (get) => get(fetchDepartures),
  (_get, set, formData: FormData) => {
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
