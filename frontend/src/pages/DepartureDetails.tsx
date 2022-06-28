import { useAtom } from 'jotai';
import StaticMap from 'react-map-gl';
import DeckGL, { ScatterplotLayer } from 'deck.gl';

import { departuresDetails } from '../utils/atoms';
import DepartureInfo from '../components/DepartureInfo';

const DeparturesDetails = () => {
  const [departure] = useAtom(departuresDetails);

  console.log(departure);
  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */

  const layer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: {
      name: 'Mitten',
      code: 'CM',
      coordinates: [
        66.54386, 20.15199,
        // departure.departure.stop_position.lng,
        // departure.departure.stop_position.lat,
      ],
    },
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: (d) => d.coordinates,
    getRadius: (d) => Math.sqrt(d.exits),
    getFillColor: (d) => [255, 140, 0],
    getLineColor: (d) => [0, 0, 0],
  });
  return (
    <>
      <DeckGL layers={[layer]} key={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
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
