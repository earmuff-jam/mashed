// store.js
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';

import home from './features/Home/homeSlice';
import auth from './Containers/Auth/authSlice';
import event from './Containers/Event/eventSlice';

import profile from './features/Profile/profileSlice';
import notes from './features/Notes/notesSlice';
import categories from './features/Categories/categoriesSlice';
import inventory from './features/InventoryList/inventorySlice';

import { all } from 'redux-saga/effects'; // Import 'all' from redux-saga

import homeSaga from './features/Home/homeSaga';
import authSaga from './Containers/Auth/authSaga';
import eventSaga from './Containers/Event/eventSaga';
import profileSaga from './features/Profile/profileSaga';
import notesSaga from './features/Notes/notesSaga';
import categoriesSaga from './features/Categories/categoriesSaga';
import inventorySaga from './features/InventoryList/inventorySaga';

const sagaMiddleware = createSagaMiddleware();

// Combine all sagas into one root saga
function* rootSaga() {
  yield all([
    ...authSaga.map((saga) => saga()),
    ...profileSaga.map((saga) => saga()),
    ...homeSaga.map((saga) => saga()),
    ...eventSaga.map((saga) => saga()),
    ...categoriesSaga.map((saga) => saga()),
    ...notesSaga.map((saga) => saga()),
    ...inventorySaga.map((saga) => saga()),
  ]);
}

export const store = configureStore({
  reducer: {
    auth,
    home,
    event,
    profile,
    categories,
    inventory,
    notes,
  },
  middleware: [sagaMiddleware],
  // devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);
