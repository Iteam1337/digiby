import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import StaticMap from 'react-map-gl';
import DeckGL, { GeoJsonLayer, IconLayer } from 'deck.gl';

import pin from '../icons/pin.svg';
import startPin from '../icons/startPin.svg';
import { departuresDetails } from '../utils/atoms';
import DepartureInfo from '../components/DepartureInfo';

const DeparturesDetails = () => {
  const [mapState, setMapState] = useState({
    longitude: 20.15199,
    latitude: 66.54386,
    zoom: 7,
    pitch: 0,
    bearing: 0,
  });
  const [departure] = useAtom(departuresDetails);

  useEffect(() => {
    if (departure)
      setMapState({
        longitude: parseFloat(departure.destination.stop_position.lng),
        latitude: parseFloat(departure.destination.stop_position.lat),
        zoom: 7,
        pitch: 0,
        bearing: 0,
      });
  }, [departure]);

  if (!departure) {
    return (
      <div className=" flex flex-col items-center">
        <p>Ingen rutt hittades</p>
        <a className="underline" href="/">
          Tillbaka till sök
        </a>
      </div>
    );
  }

  const stopPosition = departure.destination.stop_position;
  const startPosition = departure.departure.stop_position;

  const geoJsonObject = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: departure?.geometry,
    },
  };

  const busLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonObject,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: 'circle',
    lineWidthScale: 1,
    lineWidthMinPixels: 1,
    getFillColor: [19, 197, 123],
    getLineColor: [19, 197, 123],
    getPointRadius: 100,
    getLineWidth: 2,
    getElevation: 3,
  });

  const stopPositionLayer = new IconLayer({
    id: 'icon-layer',
    data: [
      {
        coordinates: [
          parseFloat(stopPosition.lng),
          parseFloat(stopPosition.lat),
        ],
      },
    ],
    getIcon: () => ({
      url: pin,
      mask: false,
      width: 16,
      height: 20,
    }),
    sizeScale: 1,
    getPosition: (d: any) => d.coordinates,
    getSize: () => 20,
  });

  const startPositionLayer = new IconLayer({
    id: 'icon-layer',
    data: [
      {
        coordinates: [
          parseFloat(startPosition.lng),
          parseFloat(startPosition.lat),
        ],
      },
    ],
    getIcon: () => ({
      url: startPin,
      mask: false,
      width: 10,
      height: 10,
    }),
    sizeScale: 1,
    getPosition: (d: any) => d.coordinates,
    getSize: () => 10,
  });

  return (
    <>
      {departure && (
        <>
          <DeckGL
            layers={[busLayer, stopPositionLayer, startPositionLayer]}
            initialViewState={mapState}
            controller={true}
          >
            <StaticMap
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
              reuseMaps
              mapStyle="mapbox://styles/mapbox/dark-v10"
            />
          </DeckGL>
          <DepartureInfo departure={departure} />
        </>
      )}
    </>
  );
};

export default DeparturesDetails;
