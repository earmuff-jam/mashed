import { takeLatest, put, call } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../util/Common';
import { inventoryActions } from './inventorySlice';
import instance from '../../util/Instances';

const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1/profile`;

export function* fetchAllInventoriesForUser() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/inventories`);
    yield put(inventoryActions.getAllInventoriesForUserSuccess(response.data || {}));
  } catch (e) {
    yield put(inventoryActions.getAllInventoriesForUserFailure(e));
  }
}

export function* fetchInvByID({ payload }) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/inventories/${payload}`);
    yield put(inventoryActions.getInvByIDSuccess(response.data || []));
  } catch (e) {
    yield put(inventoryActions.getInvByIDFailure(e));
  }
}

export function* fetchAddNewInventory(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories`, { ...action.payload });
    yield put(inventoryActions.addInventorySuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.addInventoryFailure(e));
  }
}

export function* fetchAddBulkInventory(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories/bulk`, { ...action.payload });
    yield put(inventoryActions.addBulkInventorySuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.addBulkInventoryFailure(e));
  }
}

export function* fetchUpdateExistingInventoryDetails(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}/inventories`, { ...action.payload });
    yield put(inventoryActions.updateInventorySuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.updateInventoryFailure(e));
  }
}

export function* fetchRemoveInventoryRows(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories/prune`, { ...action.payload });
    yield put(inventoryActions.removeInventoryRowsSuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.removeInventoryRowsFailure(e));
  }
}

/********************************
 * WATCHER FUNCTIONS BELOW HERE
 ********************************/

export function* watchFetchAllInventoriesForUser() {
  yield takeLatest(`inventory/getAllInventoriesForUser`, fetchAllInventoriesForUser);
}

export function* watchFetchInvByID() {
  yield takeLatest(`inventory/getInvByID`, fetchInvByID);
}

export function* watchFetchAddNewInventory() {
  yield takeLatest(`inventory/addInventory`, fetchAddNewInventory);
}

export function* watchFetchAddBulkInventory() {
  yield takeLatest(`inventory/addBulkInventory`, fetchAddBulkInventory);
}

export function* watchUpdateExistingInventoryDetails() {
  yield takeLatest(`inventory/updateInventory`, fetchUpdateExistingInventoryDetails);
}

export function* watchFetchRemoveInventoryRows() {
  yield takeLatest(`inventory/removeInventoryRows`, fetchRemoveInventoryRows);
}

export default [
  watchFetchInvByID,
  watchFetchAddBulkInventory,
  watchFetchRemoveInventoryRows,
  watchFetchAllInventoriesForUser,
  watchUpdateExistingInventoryDetails,
];
