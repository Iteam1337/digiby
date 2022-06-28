import axios from 'axios';

import { FormattedState } from './types';

const url = 'https://digiby.predictivemovement.se/api/transports';
// https://digiby.predictivemovement.se/api/transports?fromLat=67.838153&fromLng=20.273026&toLat=67.648362&toLng=21.046703

export default async function getTransports(data: FormattedState) {
  console.log('data in get transport', data);
  try {
    const response = await axios.get(url, {
      params: {
        fromLat: data.from.coordinates[1],
        fromLng: data.from.coordinates[0],
        toLat: data.to.coordinates[1],
        toLng: data.to.coordinates[0],
        time: data.time,
        date: data.date,
      },
    });
    return response.data.data;
  } catch {
    throw new Error();
  }
}
