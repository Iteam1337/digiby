import { useState } from 'react';
import { useAtom } from 'jotai';
import StaticMap from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';

import { departuresDetails } from '../utils/atoms';

const DeparturesDetails = () => {
  const [mapState, setMapState] = useState({
    longitude: 20.15199,
    latitude: 66.54386,
    zoom: 7,
    pitch: 0,
    bearing: 0,
  });

  const [departure] = useAtom(departuresDetails);

  console.log('departure', departure);

  const geoJsonObject = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: departure.geometry,
    },
  };

  const layer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonObject,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: 'circle',
    lineWidthScale: 5,
    lineWidthMinPixels: 2,
    getFillColor: [19, 197, 123],
    getLineColor: [19, 197, 123],
    getPointRadius: 100,
    getLineWidth: 5,
    getElevation: 3,
  });

  console.log(layer);

  return (
    <>
      <DeckGL
        layers={[layer]}
        initialViewState={mapState}
        mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        controller={true}
      >
        <StaticMap
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          reuseMaps
          mapStyle="mapbox://styles/mapbox/dark-v10"
        />
      </DeckGL>
      {/* {departure && <DepartureInfo departure={departure} />} */}
    </>
  );
};

export default DeparturesDetails;
