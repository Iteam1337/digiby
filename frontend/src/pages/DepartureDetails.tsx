import { useAtom } from 'jotai';
import StaticMap from 'react-map-gl';
import DeckGL from 'deck.gl';

import { departuresDetails } from '../utils/atoms';
import DepartureInfo from '../components/DepartureInfo';

const DeparturesDetails = () => {
  const [departure] = useAtom(departuresDetails);

  console.log(departure);

  return (
    <>
      <DeckGL key={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <StaticMap
          initialViewState={{
            longitude: 20.15199,
            latitude: 66.54386,
            zoom: 9,
          }}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          reuseMaps
          // preventStyleDiffing={true}

          mapStyle="mapbox://styles/mapbox/dark-v10"
        />
      </DeckGL>
      {departure && <DepartureInfo departure={departure} />}
    </>
  );
};

export default DeparturesDetails;
