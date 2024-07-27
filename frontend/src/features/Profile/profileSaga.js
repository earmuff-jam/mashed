import { takeLatest, put, call, takeEvery } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../util/Common';
import { profileActions } from './profileSlice';
import instance from '../../util/Instances';

const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1/profile`;

/**
 * User Details related api calls
 */

export function* fetchProfileList() {
  try {
    const response = yield call(instance.get, `${BASEURL}/list`);
    yield put(profileActions.getProfileListSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getProfileListFailure(e));
  }
}

export function* fetchExistingUserDetails() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}`);
    yield put(profileActions.getProfileDetailsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getProfileDetailsFailure(e));
  }
}

export function* updateExistingUserDetails(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const { formattedData } = action.payload;
    console.log(formattedData);
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}`, {
      id: USER_ID,
      username: formattedData.username,
      full_name: formattedData.full_name,
      email_address: formattedData.email_address,
      phone_number: formattedData.phone_number,
      about_me: formattedData.about_me,
    });
    yield put(profileActions.getProfileDetailsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getProfileDetailsFailure(e));
  }
}

/**
 * Volunteering related api calls
 */

export function* fetchVolunteeringDetails(action) {
  try {
    const { userID } = action.payload;
    const response = yield call(instance.get, `${BASEURL}/${userID}/volunteering`);
    yield put(profileActions.getVolunteeringDetailsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getVolunteeringDetailsFailure(e));
  }
}

/**
 * Profile picture related api calls
 */

export function* fetchUpdateProfileImage(action) {
  try {
    const { selectedImage, userID } = action.payload;
    const formData = new FormData();
    formData.append('avatarSrc', selectedImage);
    const response = yield call(instance.post, `${BASEURL}/${userID}/updateAvatar`, formData);
    yield put(profileActions.updateProfileImageSuccess(response.data));
  } catch (e) {
    yield put(profileActions.updateProfileImageFailure(e));
  }
}

/**
 * Notification related api calls
 *
 */

export function* fetchExistingNotificationsUserDetails() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/notifications`);
    yield put(profileActions.getProfileNotificationsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getProfileNotificationsFailure(e));
  }
}

export function* fetchUpdateProfileNotification(action) {
  try {
    const { data } = action.payload;
    const notificationID = data.id;
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}/notifications/${notificationID}`, {
      ...data,
    });
    yield put(profileActions.updateProfileNotificationSuccess(response.data));
  } catch (e) {
    yield put(profileActions.updateProfileNotificationFailure(e));
  }
}

/**
 * Recent Activities related api calls
 */

export function* fetchRecentActivitiesList() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/recent`);
    yield put(profileActions.getRecentActivitiesListSuccess(response.data || []));
  } catch (e) {
    yield put(profileActions.getRecentActivitiesListFailure(e));
  }
}

/**
 * Inventories related api calls
 */

export function* fetchAllInventoriesForUser() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/inventories`);
    yield put(profileActions.getAllInventoriesForUserSuccess(response.data || {}));
  } catch (e) {
    yield put(profileActions.getAllInventoriesForUserFailure(e));
  }
}

export function* fetchInvByID({ payload }) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/inventories/${payload}`);
    yield put(profileActions.getInvByIDSuccess(response.data || []));
  } catch (e) {
    yield put(profileActions.getInvByIDFailure(e));
  }
}

export function* fetchAddNewInventory(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories`, { ...action.payload });
    yield put(profileActions.addInventorySuccess(response.data));
  } catch (e) {
    yield put(profileActions.addInventoryFailure(e));
  }
}

export function* fetchAddBulkInventory(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories/bulk`, { ...action.payload });
    yield put(profileActions.addBulkInventorySuccess(response.data));
  } catch (e) {
    yield put(profileActions.addBulkInventoryFailure(e));
  }
}

export function* fetchUpdateExistingInventoryDetails(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}/inventories`, { ...action.payload });
    yield put(profileActions.updateInventorySuccess(response.data));
  } catch (e) {
    yield put(profileActions.updateInventoryFailure(e));
  }
}

export function* fetchTransferItemsToSelectedEvent(action) {
  try {
    const { userID } = action.payload;
    const response = yield call(instance.post, `${BASEURL}/${userID}/inventories/transfer`, { ...action.payload });
    yield put(profileActions.transferItemsToSelectedEventSuccess(response.data));
  } catch (e) {
    yield put(profileActions.transferItemsToSelectedEventFailure(e));
  }
}

/**
 * Recent Trophy related api calls
 */

export function* fetchRecentActivitiesTrophyList() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/highlights`);
    yield put(profileActions.getRecentActivitiesTrophyListSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getRecentActivitiesTrophyListFailure(e));
  }
}

/**
 * Notes related api calls
 */

export function* fetchUserNotes() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/notes`);
    yield put(profileActions.getUserNotesSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getUserNotesFailure(e));
  }
}

export function* fetchAddNewNote(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/notes`, { ...action.payload });
    yield put(profileActions.addNewNoteSuccess(response.data));
  } catch (e) {
    yield put(profileActions.addNewNoteFailure(e));
  }
}

export function* fetchUpdateExistingNote(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}/notes`, { ...action.payload });
    yield put(profileActions.updateExistingNoteSuccess(response.data));
  } catch (e) {
    yield put(profileActions.updateExistingNoteFailure(e));
  }
}

export function* fetchRemoveSelectedNote(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const { noteID } = action.payload;
    const response = yield call(instance.delete, `${BASEURL}/${USER_ID}/notes/${noteID}`);
    yield put(profileActions.removeSelectedNoteSuccess(response.data));
  } catch (e) {
    yield put(profileActions.removeSelectedNoteFailure(e));
  }
}

export function* fetchRemoveInventoryRows(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories/prune`, { ...action.payload });
    yield put(profileActions.removeInventoryRowsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.removeInventoryRowsFailure(e));
  }
}

export function* fetchEventsSharedWithSelectProfile(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/shared`, { ...action.payload });
    yield put(profileActions.retrieveEventsSharedWithSelectProfileSuccess(response.data));
  } catch (e) {
    yield put(profileActions.retrieveEventsSharedWithSelectProfileFailure(e));
  }
}

/********************************
 * WATCHER FUNCTIONS BELOW HERE
 ********************************/

export function* watchGetUserNotes() {
  yield takeLatest(`profile/getUserNotes`, fetchUserNotes);
}

export function* watchFetchProfileList() {
  yield takeLatest(`profile/getProfileList`, fetchProfileList);
}

export function* watchExistingNotificationsUserDetails() {
  yield takeLatest(`profile/getProfileNotifications`, fetchExistingNotificationsUserDetails);
}

export function* watchFetchRemoveSelectedNote() {
  yield takeLatest(`profile/removeSelectedNote`, fetchRemoveSelectedNote);
}

export function* watchFetchRemoveInventoryRows() {
  yield takeLatest(`profile/removeInventoryRows`, fetchRemoveInventoryRows);
}

export function* watchFetchAddNewNote() {
  yield takeLatest(`profile/addNewNote`, fetchAddNewNote);
}

export function* watchFetchUpdateExistingNote() {
  yield takeLatest(`profile/updateExistingNote`, fetchUpdateExistingNote);
}

export function* watchUpdateProfileNotification() {
  yield takeEvery(`profile/updateProfileNotification`, fetchUpdateProfileNotification);
}

export function* watchFetchExistingUserDetails() {
  yield takeLatest(`profile/getProfileDetails`, fetchExistingUserDetails);
}

export function* watchFetchAddNewInventory() {
  yield takeLatest(`profile/addInventory`, fetchAddNewInventory);
}

export function* watchFetchAddBulkInventory() {
  yield takeLatest(`profile/addBulkInventory`, fetchAddBulkInventory);
}

export function* watchUpdateExistingInventoryDetails() {
  yield takeLatest(`profile/updateInventory`, fetchUpdateExistingInventoryDetails);
}

export function* watchFetchRecentActivitiesList() {
  yield takeLatest(`profile/getRecentActivitiesList`, fetchRecentActivitiesList);
}

export function* watchFetchRecentActivitiesTrophyList() {
  yield takeLatest(`profile/getRecentActivitiesTrophyList`, fetchRecentActivitiesTrophyList);
}

export function* watchUpdateExistingUserDetails() {
  yield takeLatest(`profile/updateProfileDetails`, updateExistingUserDetails);
}

export function* watchFetchVolunteeringDetails() {
  yield takeLatest(`profile/getVolunteeringDetails`, fetchVolunteeringDetails);
}

export function* watchFetchAllInventoriesForUser() {
  yield takeLatest(`profile/getAllInventoriesForUser`, fetchAllInventoriesForUser);
}

export function* watchFetchInvByID() {
  yield takeLatest(`profile/getInvByID`, fetchInvByID);
}

export function* watchFetchUpdateProfileImage() {
  yield takeEvery(`profile/updateProfileImage`, fetchUpdateProfileImage);
}

export function* watchFetchEventsSharedWithSelectProfile() {
  yield takeEvery(`profile/retrieveEventsSharedWithSelectProfile`, fetchEventsSharedWithSelectProfile);
}

export function* watchFetchTransferItemsToSelectedEvent() {
  yield takeEvery(`profile/transferItemsToSelectedEvent`, fetchTransferItemsToSelectedEvent);
}

export default [
  watchFetchProfileList,
  watchGetUserNotes,
  watchFetchAddNewNote,
  watchFetchInvByID,
  watchFetchAddNewInventory,
  watchFetchAddBulkInventory,
  watchFetchUpdateExistingNote,
  watchFetchRemoveSelectedNote,
  watchFetchRemoveInventoryRows,
  watchFetchAllInventoriesForUser,
  watchFetchRecentActivitiesList,
  watchUpdateProfileNotification,
  watchFetchExistingUserDetails,
  watchUpdateExistingUserDetails,
  watchFetchVolunteeringDetails,
  watchFetchUpdateProfileImage,
  watchUpdateExistingInventoryDetails,
  watchFetchRecentActivitiesTrophyList,
  watchExistingNotificationsUserDetails,
  watchFetchTransferItemsToSelectedEvent,
  watchFetchEventsSharedWithSelectProfile,
];