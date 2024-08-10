import { takeLatest, put, call } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../util/Common';
import instance from '../../util/Instances';
import { maintenancePlanActions } from './maintenanceSlice';

const DEFAULT_LIMIT = 10;
const MAINTENANCE_STATUS_OPTION_TYPE = 'maintenance';
const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1`;

export function* getPlans() {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('limit', DEFAULT_LIMIT);
    const response = yield call(instance.get, `${BASEURL}/maintenance-plans?${params.toString()}`);
    yield put(maintenancePlanActions.getPlansSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.getPlansFailure(e));
  }
}

export function* getStatusOptions() {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('type', MAINTENANCE_STATUS_OPTION_TYPE);
    const response = yield call(instance.get, `${BASEURL}/status/list?${params.toString()}`);
    yield put(maintenancePlanActions.getStatusOptionsSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.getStatusOptionsFailure(e));
  }
}

export function* createPlan(action) {
  try {
    const userID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/plan`, { ...action.payload, created_by: userID });
    yield put(maintenancePlanActions.createPlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.createPlanFailure(e));
  }
}

export function* updatePlan(action) {
  try {
    const { id } = action.payload;
    const userID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/plan/${id}`, { ...action.payload, updated_by: userID });
    yield put(maintenancePlanActions.updatePlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.updatePlanFailure(e));
  }
}

export function* removePlan(action) {
  try {
    const response = yield call(instance.delete, `${BASEURL}/plan/${action.payload}`);
    yield put(maintenancePlanActions.removePlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.removePlanFailure(e));
  }
}

export function* watchGetPlanList() {
  yield takeLatest(`maintenancePlan/getPlans`, getPlans);
}
export function* watchGetStatusOptions() {
  yield takeLatest(`maintenancePlan/getStatusOptions`, getStatusOptions);
}

export function* watchCreatePlan() {
  yield takeLatest(`maintenancePlan/createPlan`, createPlan);
}

export function* watchUpdatePlan() {
  yield takeLatest(`maintenancePlan/updatePlan`, updatePlan);
}

export function* watchRemovePlan() {
  yield takeLatest(`maintenancePlan/removePlan`, removePlan);
}

export default [watchGetPlanList, watchGetStatusOptions, watchCreatePlan, watchUpdatePlan, watchRemovePlan];