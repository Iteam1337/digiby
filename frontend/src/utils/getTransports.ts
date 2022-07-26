import axios from 'axios';

import { DepartureSearchParams } from './types';

const url = 'https://digiby.predictivemovement.se/api/transports';
// https://digiby.predictivemovement.se/api/transports?fromLat=67.838153&fromLng=20.273026&toLat=67.648362&toLng=21.046703

export default async function getTransports(data: DepartureSearchParams) {
  try {
    const response = await axios.get(url, {
      params: {
        fromLat: data.fromLat,
        fromLng: data.fromLng,
        toLat: data.toLat,
        toLng: data.toLng,
        time: data.time,
        date: data.date,
      },
    });
    return response.data.data;
  } catch {
    throw new Error();
  }
}
