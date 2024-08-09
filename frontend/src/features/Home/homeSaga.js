import axios from 'axios';
import { homeActions } from './homeSlice';
import instance from '../../util/Instances';

import { takeLatest, put, call } from 'redux-saga/effects';
import { GEOJSON_API_SEARCH_URL_PARAMS, BLANK_MAP_DETAIL } from './constants';
import { REACT_APP_GEOCODING_MAP_API_KEY } from '../../util/Common';

export function* fetchAllEvents() {
  try {
    const response = yield call(instance.get, '/events');
    yield put(homeActions.getEventsSuccess(response.data || []));
  } catch (e) {
    yield put(homeActions.getEventsFailure(e));
  }
}

export function* createNewEvent(action) {
  try {
    const { draftEvent } = action.payload;
    const sanitizedMapDetails = { ...BLANK_MAP_DETAIL };
    const queryParams = {
      city: draftEvent.city,
      state: draftEvent.state,
      postalcode: draftEvent.zip,
      country: 'US', // default USA
      apiKey: REACT_APP_GEOCODING_MAP_API_KEY,
    };

    try {
      const responseMapDetails = yield call(axios.get, GEOJSON_API_SEARCH_URL_PARAMS, { params: queryParams });
      if (responseMapDetails.data.length > 0) {
        const result = responseMapDetails.data[0]; // always pick the first one
        sanitizedMapDetails.boundingbox = result.boundingbox;
        sanitizedMapDetails.class = result.class;
        sanitizedMapDetails.display_name = result.display_name;
        // sanitizedMapDetails.importance = result.importance;
        sanitizedMapDetails.lat = result.lat;
        sanitizedMapDetails.licence = result.licence;
        sanitizedMapDetails.lon = result.lon;
        // sanitizedMapDetails.osm_id = result.osm_id;
        sanitizedMapDetails.osm_type = result.osm_type;
        // sanitizedMapDetails.place_id = result.place_id;
        sanitizedMapDetails.powered_by = result.powered_by;
        sanitizedMapDetails.type = result.type;
      }
    } catch (e) {
      // eat the exception
    }

    const response = yield call(instance.post, '/events', { ...draftEvent, ...sanitizedMapDetails });
    yield put(homeActions.createEventSuccess(response.data || []));
  } catch (e) {
    yield put(homeActions.createEventFailure(e));
  }
}

export function* updateExistingEvent(action) {
  try {
    const data = { ...action.payload };
    const response = yield call(instance.put, `/event/${data.id}`, { ...action.payload });
    yield put(homeActions.updateEventSuccess(response.data));
  } catch (e) {
    yield put(homeActions.updateEventFailure(e));
  }
}

export function* fetchCauseListOptions() {
  try {
    const response = yield call(instance.get, '/causes');
    yield put(homeActions.getCauseListSuccess(response.data));
  } catch (e) {
    yield put(homeActions.getCauseListFailure(e));
  }
}

export function* fetchProjectTypeOptions() {
  try {
    const response = yield call(instance.get, '/types');
    yield put(homeActions.getProjectTypesSuccess(response.data));
  } catch (e) {
    yield put(homeActions.getProjectTypesFailure(e));
  }
}

export function* fetchAllUsaStateOptions() {
  try {
    const response = yield call(instance.get, '/states');
    yield put(homeActions.getAllStatesUSSuccess(response.data));
  } catch (e) {
    yield put(homeActions.getAllStatesUSFailure(e));
  }
}

export function* watchFetchAllEvents() {
  yield takeLatest(`home/getEvents`, fetchAllEvents);
}

export function* watchCreateNewEvent() {
  yield takeLatest(`home/createEvent`, createNewEvent);
}

export function* watchUpdateExistingEvent() {
  yield takeLatest(`home/updateEvent`, updateExistingEvent);
}

export function* watchFetchCauseListOptions() {
  yield takeLatest(`home/getCauseList`, fetchCauseListOptions);
}

export function* watchFetchProjectTypeOptions() {
  yield takeLatest(`home/getProjectTypes`, fetchProjectTypeOptions);
}

export function* watchFetchAllUsaStateOptions() {
  yield takeLatest(`home/getAllStatesUS`, fetchAllUsaStateOptions);
}

 
export default [
  watchFetchAllEvents,
  watchCreateNewEvent,
  watchUpdateExistingEvent,
  watchFetchCauseListOptions,
  watchFetchProjectTypeOptions,
  watchFetchAllUsaStateOptions,
];
