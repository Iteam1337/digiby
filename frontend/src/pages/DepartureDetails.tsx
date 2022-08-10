import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import StaticMap from 'react-map-gl';
import DeckGL, { GeoJsonLayer, IconLayer } from 'deck.gl';

import pin from '../icons/pin.svg';
import startPin from '../icons/startPin.svg';
import { departuresDetails, departuresAtom } from '../utils/atoms';
import DepartureInfo from '../components/DepartureInfo';

// type Feature = {
//   type: string;
//   properties: { color: number[] };
//   geometry: {
//     type: string;
//     coordinates: LatLng[];
//   };
// };

// type GeoJsonObject = {
//   type: string;
//   features: Feature[] | undefined;
// };

const DeparturesDetails = () => {
  const [mapState, setMapState] = useState({
    longitude: 20.15199,
    latitude: 66.54386,
    zoom: 7,
    pitch: 0,
    bearing: 0,
  });
  const [departure] = useAtom(departuresDetails);
  const [departures] = useAtom(departuresAtom);

  console.log('departures in details', departures);
  console.log('departure in details', departure);

  useEffect(() => {
    if (departure) {
      setMapState({
        longitude: parseFloat(departure.destination.stop_position.lng),
        latitude: parseFloat(departure.destination.stop_position.lat),
        zoom: 12,
        pitch: 0,
        bearing: 0,
      });
    }
  }, [departure]);

  if (!departure) {
    return (
      <div className=" flex flex-col items-center pt-6">
        <p>Ingen rutt hittades</p>
        <a className="underline" href="/">
          Tillbaka till sök
        </a>
      </div>
    );
  }

  const stopPosition = departure?.stops.slice(-1)[0].stop_position;
  const startPosition = departure.stops[0].stop_position;

  const geoJsonObject = {
    type: 'FeatureCollection',
    features: departures.data
      ?.filter((dep) => dep.geometry.length > 0)
      .map((dep) => {
        console.log('dep.departure.arrival_time', dep.departure.arrival_time);
        return {
          type: 'Feature',
          properties: {
            color:
              dep.departure.arrival_time === departure.departure.arrival_time
                ? [19, 197, 123]
                : [200, 200, 200],
          },
          geometry: { type: 'LineString', coordinates: dep.geometry },
        };
      })
      .sort(function (x, y) {
        return x.properties.color == [19, 197, 123]
          ? -1
          : y.properties.color == [19, 197, 123]
          ? 1
          : 0;
      }),
  };

  console.log('geoJsonObject', geoJsonObject);

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
    getFillColor: (d: any) => d.properties.color,
    getLineColor: (d: any) => d.properties.color,
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
    <section className="h-full w-full bg-pm-black">
      <h1 className="sr-only">Vald avgång</h1>
      {departure && (
        <>
          <div className="relative mx-[2px] h-[calc(100%-160px)] w-[calc(100%-4px)]">
            {geoJsonObject?.features?.length && (
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
            )}
          </div>
          <DepartureInfo departure={departure} />
        </>
      )}
    </section>
  );
};

export default DeparturesDetails;
