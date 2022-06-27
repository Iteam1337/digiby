import axios from 'axios';

import { FormData } from './types';

const url = 'https://digiby.predictivemovement.se/api/transports';

export default async function getTransports(data: FormData) {
  console.log('data in get transport', data);
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch {
    throw new Error();
  }
}
