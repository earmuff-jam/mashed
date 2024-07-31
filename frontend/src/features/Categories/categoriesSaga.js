import { takeLatest, put, call } from 'redux-saga/effects';
import { categoryActions } from './categoriesSlice';
import { REACT_APP_LOCALHOST_URL } from '../../util/Common';
import instance from '../../util/Instances';

const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1`;

export function* getCategories() {
  try {
    const response = yield call(instance.get, `${BASEURL}/categories`);
    yield put(categoryActions.getCategoriesSuccess(response.data));
  } catch (e) {
    yield put(categoryActions.getCategoriesFailure(e));
  }
}

export function* createCategory() {
  try {
    const response = yield call(instance.post, `${BASEURL}/categories`);
    yield put(categoryActions.createCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.createCategoryFailure(e));
  }
}

export function* removeCategory(action) {
  try {
    const { id } = action.payload;
    const response = yield call(instance.delete, `${BASEURL}/category/${id}`);
    yield put(categoryActions.removeCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.removeCategoryFailure(e));
  }
}

export function* watchGetCategoryList() {
  yield takeLatest(`category/getCategories`, getCategories);
}

export function* watchCreateCategory() {
  yield takeLatest(`category/createCategory`, createCategory);
}

export function* watchRemoveCategory() {
  yield takeLatest(`category/removeCategory`, removeCategory);
}

export default [watchGetCategoryList, watchCreateCategory, watchRemoveCategory];