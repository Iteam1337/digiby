import axios from 'axios';

const url = 'https://digiby.predictivemovement.se/api/transports';

export default function getTransports() {
  axios.get(url).then((response) => {
    console.log(response.data);
  });
}
