import './map.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import * as proj from 'ol/proj';
import ReactDOM from 'react-dom';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import PropTypes from 'prop-types';
import Overlay from 'ol/Overlay.js';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';
import LayerTile from 'ol/layer/Tile.js';
import SourceOSM from 'ol/source/OSM.js';
import { useEffect, useRef } from 'react';
import PopupContent from './PopupContent';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import makeStyles from '@mui/styles/makeStyles';
import { Attribution, defaults as defaultControls } from 'ol/control.js';

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    margin: theme.spacing(2),
  },
}));

const HomePageHeaderMap = ({ location, eventList, isLoading }) => {
  const classes = useStyles();
  const mapRef = useRef(null);
  const popupContentRef = useRef(null);
  const popupCloserRef = useRef(null);
  const dataContainerRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;

    let center = [0, 0];
    let zoom = 4;
    if (location) {
      center = proj.fromLonLat([location.long || 0, location.lat || 0]);
      if (location.lat != 0 && location.long !== 0) {
        zoom = 6;
      }
    }

    const map = new Map({
      target: mapRef.current,
      layers: [
        new LayerTile({
          source: new SourceOSM({
            attributions: [
              '© <a href="https://geocode.maps.co/">Map data contributors</a>.',
              '© OpenStreetMap contributors.',
            ],
          }),
        }),
      ],
      controls: defaultControls({
        attribution: false,
        rotate: false,
        attributionOptions: { collapsed: true, collapsible: false },
      }),
      view: new View({
        center,
        zoom,
      }),
    });
    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });
    map.addLayer(vectorLayer);

    addMarkers(vectorLayer, eventList);

    const container = new Overlay({
      position: center,
      element: popupContentRef.current,
      positioning: 'center-center',
      stopEvent: false,
    });
    const button = new Overlay({
      position: center,
      element: popupCloserRef.current,
      positioning: 'center-center',
      stopEvent: false,
    });

    map.addOverlay(container);

    const popup = new Overlay({
      element: popupContentRef.current,
      positioning: 'center-center',
      stopEvent: false,
    });

    const data = new Overlay({
      element: dataContainerRef.current,
      positioning: 'center-center',
      stopEvent: false,
    });

    map.on('click', (evt) => {
      // if the selected event does not have the marker, we do not display the popup
      const feature = map.getFeaturesAtPixel(evt.pixel)[0];
      if (!feature) {
        return;
      }
      const features = vectorLayer.getSource().getClosestFeatureToCoordinate(evt.coordinate);
      const selectedEvent = features.get('eventInfo');
      popup.setPosition(evt.coordinate);
      button.setPosition(evt.coordinate);
      map.addOverlay(button);
      map.addOverlay(popup);
      const coordinate = evt.coordinate;
      const root = ReactDOM.createRoot(popupContentRef.current);
      root.render(<PopupContent selectedEvent={selectedEvent} />);

      map.addOverlay(data);
      data.setPosition(coordinate);
    });

    popupCloserRef.current.onclick = () => {
      popup.setPosition(undefined);
      button.setPosition(undefined);
      data.setPosition(undefined);
      dataContainerRef.current.blur();
      popupCloserRef.current.blur();
      return false;
    };

    map.addControl(
      new Attribution({
        className: 'ol-attribution-bottom',
        collapsible: false,
        collapsed: false,
      })
    );

    return () => {
      map.setTarget(null);
    };
  }, [eventList, JSON.stringify(location)]);

  return (
    <div className={classes.mapContainer}>
      <div id="map" style={{ width: '100%', height: '20rem' }} ref={mapRef} />
      <button id="popup-closer" className="ol-popup-closer" ref={popupCloserRef} href="">
        X
      </button>
      <div className="ol-popup" id="popup" ref={popupContentRef}>
        <div className="ol-popup-data" id="popup-data" ref={dataContainerRef}></div>
      </div>
    </div>
  );
};

HomePageHeaderMap.defaultProps = {
  eventList: [],
  isLoading: false,
  location: {},
};

HomePageHeaderMap.propTypes = {
  eventList: PropTypes.array,
  isLoading: PropTypes.bool,
  location: PropTypes.object,
};

export default HomePageHeaderMap;

/**
 * addMarkers fn is used to mark endpoints with the red dot as svg icons
 *
 * @param {Object} vectorLayer contains source that we add features to
 * @param {Array} events contains the lat, lon to display the red dot
 * @returns {Object} updated vectorLayer with red dot for markers
 */
const addMarkers = (vectorLayer, events) => {
  const features = events?.map((details, index) => {
    const { lon, lat } = details;
    const geometry = new Point(fromLonLat([lon, lat]));
    const feature = new Feature({
      geometry,
      eventInfo: events[index],
    });
    const markerStyle = new Style({
      image: new Icon({
        src: 'reddot.svg',
        scale: 0.4,
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        crossOrigin: 'anonymous',
      }),
    });
    feature.setStyle(markerStyle);
    return feature;
  });

  vectorLayer.getSource().addFeatures(features);
};
