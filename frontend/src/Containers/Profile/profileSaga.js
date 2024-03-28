import { takeLatest, put, call, takeEvery } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../util/Common';
import { profileActions } from './profileSlice';
import instance from '../../util/Instances';

const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1/profile`;

export function* fetchExistingUserDetails() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}`);
    yield put(profileActions.getProfileDetailsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getProfileDetailsFailure(e));
  }
}

export function* fetchRecentActivitiesList() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/recent`);
    yield put(profileActions.getRecentActivitiesListSuccess(response.data || []));
  } catch (e) {
    yield put(profileActions.getRecentActivitiesListFailure(e));
  }
}

export function* fetchRecentActivitiesTrophyList() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/highlights`);
    yield put(profileActions.getRecentActivitiesTrophyListSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getRecentActivitiesTrophyListFailure(e));
  }
}

export function* fetchExistingNotificationsUserDetails() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/notifications`);
    yield put(profileActions.getProfileNotificationsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getProfileNotificationsFailure(e));
  }
}

export function* updateExistingUserDetails(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const { formattedData } = action.payload;
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}`, {
      username: formattedData.username,
      full_name: formattedData.name,
      avatar_url: formattedData.avatarUrl,
      email_address: formattedData.email,
      phone_number: formattedData.phone,
      goal: formattedData.objective,
      about_me: formattedData.aboutMe,
      online_status: formattedData.onlineStatus,
      role: formattedData.role,
    });
    yield put(profileActions.getProfileDetailsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getProfileDetailsFailure(e));
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

export function* fetchVolunteeringDetails(action) {
  try {
    const { userID } = action.payload;
    const response = yield call(instance.get, `${BASEURL}/${userID}/volunteering`);
    yield put(profileActions.getVolunteeringDetailsSuccess(response.data));
  } catch (e) {
    yield put(profileActions.getVolunteeringDetailsFailure(e));
  }
}

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
    const { noteID } = action.payload;
    const response = yield call(instance.delete, `${BASEURL}/${USER_ID}/notes`);
    yield put(profileActions.removeSelectedNoteSuccess(response.data));
  } catch (e) {
    yield put(profileActions.removeSelectedNoteFailure(e));
  }
}

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

export function* watchExistingNotificationsUserDetails() {
  yield takeLatest(`profile/getProfileNotifications`, fetchExistingNotificationsUserDetails);
}

export function* watchGetUserNotes() {
  yield takeLatest(`profile/getUserNotes`, fetchUserNotes);
}

export function* watchFetchRemoveSelectedNote() {
  yield takeLatest(`profile/removeSelectedNote`, fetchRemoveSelectedNote);
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

export function* watchFetchUpdateProfileImage() {
  yield takeEvery(`profile/updateProfileImage`, fetchUpdateProfileImage);
}

// eslint-disable-next-line
export default [
  watchGetUserNotes,
  watchFetchAddNewNote,
  watchFetchUpdateExistingNote,
  watchFetchRemoveSelectedNote,
  watchExistingNotificationsUserDetails,
  watchFetchRecentActivitiesTrophyList,
  watchFetchRecentActivitiesList,
  watchUpdateProfileNotification,
  watchFetchExistingUserDetails,
  watchUpdateExistingUserDetails,
  watchFetchVolunteeringDetails,
  watchFetchUpdateProfileImage,
];
