import axios from 'axios';

const url = 'https://digiby.predictivemovement.se/api/transports';

export default async function getTransports() {
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch {
    throw new Error();
  }
}
