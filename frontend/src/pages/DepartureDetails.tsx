import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import StaticMap from 'react-map-gl';
import DeckGL, { GeoJsonLayer, IconLayer } from 'deck.gl';
import { useNavigate } from 'react-router-dom';

import { departuresDetails, departuresAtom, fromToAtom } from '../utils/atoms';
import DepartureInfo from '../components/DepartureInfo';
import { Departure } from '../utils/types';
import Section from '../components/Section';
import EmptyStates from '../components/EmptyStates';

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
  const [fromTo] = useAtom(fromToAtom);
  const navigate = useNavigate();

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

  if (!departure || !departures.data) {
    return (
      <EmptyStates
        heading="Något blev fel"
        text="Sidan du letar efter är för närvarande inte tillgänglig."
        buttonText="Tillbaka till startsidan"
        onClick={() => navigate('/')}
      />
    );
  }

  const routes = {
    type: 'FeatureCollection',
    features: departures.data
      .filter((dep) => dep.geometry.length > 0)
      .map((dep) => {
        return {
          type: 'Feature',
          properties: {
            color:
              // todo: check <id> instead of <arrival_time> when <id> endpoint is available from api.
              dep.departure.arrival_time === departure.departure.arrival_time
                ? [19, 197, 123]
                : [200, 200, 200],
          },
          geometry: { type: 'LineString', coordinates: dep.geometry },
        };
      })
      .sort((a, b) => {
        return a.properties.color[0] === 19
          ? 1
          : b.properties.color[0] === 19
          ? -1
          : 0;
      }),
  };

  const userRoute = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [
          parseFloat(fromTo.from.coordinates[0].toString()),
          parseFloat(fromTo.from.coordinates[1].toString()),
        ],
        [
          parseFloat(departure.departure.stop_position.lng),
          parseFloat(departure.departure.stop_position.lat),
        ],
      ],
    },
  };

  const positions = departures.data
    .filter((dep) => dep.departure.arrival_time && dep.destination.arrival_time)
    .map((dep: Departure) => {
      return {
        userCoordinates: {
          from: [
            parseFloat(fromTo.from.coordinates[0].toString()),
            parseFloat(fromTo.from.coordinates[1].toString()),
          ],
          // todo: add fromTo.to.coordinates as final destination
          // when we add walking distance from last stop on route
          to: [
            parseFloat(dep.destination.stop_position.lng),
            parseFloat(dep.destination.stop_position.lat),
          ],
        },
        routeCoordinates: {
          from: [
            parseFloat(dep.departure.stop_position.lng),
            parseFloat(dep.departure.stop_position.lat),
          ],
          to: [
            parseFloat(departure.destination.stop_position.lng),
            parseFloat(departure.destination.stop_position.lat),
          ],
        },
        // todo: check <id> instead of <arrival_time> when <id> endpoint is available from api.
        color:
          dep.departure.arrival_time === departure.departure.arrival_time
            ? [
                [19, 197, 123],
                [52, 51, 50],
              ]
            : [
                [200, 200, 200],
                [200, 200, 200],
              ],
      };
    })
    .sort((a, b) => {
      return a.color[0][0] === 19 ? 1 : b.color[0][0] === 19 ? -1 : 0;
    });

  function createStopIcon(colorArr: number[][]) {
    return `
      <svg width="16" height="20" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.50625 10.9483C2.41875 9.54031 0 6.12773 0 4.2109C0 1.88525 1.79083 0 4 0C6.20833 0 8 1.88525 8 4.2109C8 6.12773 5.5625 9.54031 4.49375 10.9483C4.2375 11.2839 3.7625 11.2839 3.50625 10.9483ZM4 5.61453C4.73542 5.61453 5.33333 4.98509 5.33333 4.2109C5.33333 3.43671 4.73542 2.80726 4 2.80726C3.26458 2.80726 2.66667 3.43671 2.66667 4.2109C2.66667 4.98509 3.26458 5.61453 4 5.61453Z" fill="rgb(${colorArr[0]})"/>
</svg>
    `;
  }

  function createUserStartIcon(colorArr: number[][]) {
    return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9 14C11.7614 14 14 11.7614 14 9C14 6.23858 11.7614 4 9 4C6.23858 4 4 6.23858 4 9C4 11.7614 6.23858 14 9 14Z" fill="rgb(${colorArr[1]})" stroke="rgb(${colorArr[0]})" stroke-width="5"/></svg>`;
  }

  function svgToDataURL(svg: string) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const routesLayer = new GeoJsonLayer({
    id: 'routes-layer',
    data: routes,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: 'circle',
    lineCapRounded: true,
    lineJointRounded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 3,
    getFillColor: (d: any) => d.properties.color,
    getLineColor: (d: any) => d.properties.color,
    getPointRadius: 100,
    getLineWidth: 3,
    getElevation: 3,
  });

  const stopPositionLayer = new IconLayer({
    id: 'stop-icon-layer',
    data: positions,
    getIcon: (d: any) => ({
      url: svgToDataURL(createStopIcon(d.color)),
      mask: false,
      width: 16,
      height: 20,
    }),
    sizeScale: 1,
    getPosition: (d: any) => d.routeCoordinates.to,
    getSize: () => 20,
  });

  const userStartPositionLayer = new IconLayer({
    id: 'user-start-icon-layer',
    data: positions,
    getIcon: (d: any) => ({
      url: svgToDataURL(createUserStartIcon(d.color)),
      mask: false,
      width: 18,
      height: 18,
    }),
    sizeScale: 1,
    getPosition: (d: any) => d.userCoordinates.from,
    getSize: () => 18,
  });

  const userRouteLayer = new GeoJsonLayer({
    id: 'user-route-layer',
    data: userRoute,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: 'circle',
    lineCapRounded: true,
    lineJointRounded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 3,
    getFillColor: [253, 254, 255],
    getLineColor: [253, 254, 255],
    getPointRadius: 100,
    getLineWidth: 3,
    getElevation: 3,
  });

  const layers = [
    routesLayer,
    userRouteLayer,
    userStartPositionLayer,
    stopPositionLayer,
  ];

  return (
    <Section details>
      <h1 className="sr-only">Vald avgång</h1>
      <div className="relative mx-[2px] h-[calc(100%-160px)] w-[calc(100%-4px)]">
        <DeckGL layers={layers} initialViewState={mapState} controller={true}>
          <StaticMap
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v10"
          />
        </DeckGL>
      </div>
      <DepartureInfo departure={departure} />
    </Section>
  );
};

export default DeparturesDetails;
