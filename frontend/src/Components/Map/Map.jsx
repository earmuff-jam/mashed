import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj';
import classNames from 'classnames';
import TileLayer from 'ol/layer/Tile';
import makeStyles from '@mui/styles/makeStyles';
import { defaults as defaultControls } from 'ol/control.js';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}));

const MapComponentFn = ({ shrinkSize = false, locationDetails = {}, disabled }) => {
  const classes = useStyles();
  const mapElement = useRef();
  const map = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const longlatArr = [locationDetails.lon, locationDetails.lat];
    const transFormedLatLong = proj.fromLonLat([...longlatArr]);

    if (Object.keys(locationDetails).length !== 0 && locationDetails) {
      map.current = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        controls: defaultControls({
          attribution: false,
          rotate: false,
          attributionOptions: { collapsed: true, collapsible: false },
        }),
        view: new View({
          center: transFormedLatLong,
          zoom: 10,
        }),
      });
    }

    return () => {
      if (isMounted.current) {
        if (map.current) {
          map.current.setTarget(null);
        }
        isMounted.current = false;
      }
    };
  }, [locationDetails.lat, locationDetails.lon]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      map.current.setTarget(null);
    };
  }, []);

  if (disabled) {
    return null;
  }

  return (
    <div className={classNames({ [classes.container]: shrinkSize })}>
      <div className="mapRow">
        <div ref={mapElement} className="map-container" />
      </div>
    </div>
  );
};

MapComponentFn.defaultProps = {
  shrinkSize: false,
  locationDetails: {},
  disabled: false,
};

MapComponentFn.propTypes = {
  shrinkSize: PropTypes.bool,
  locationDetails: PropTypes.object,
  disabled: PropTypes.bool,
};

export default MapComponentFn;
