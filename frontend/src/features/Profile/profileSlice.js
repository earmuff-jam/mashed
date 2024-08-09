import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: '',
  profiles: [],
  profileDetails: {},
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getProfileList: (state) => {
      state.loading = true;
      state.error = '';
      state.profiles = [];
    },
    getProfileListSuccess: (state, action) => {
      state.profiles = action.payload;
      state.loading = false;
      state.error = '';
    },
    getProfileListFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.profiles = [];
    },
    getProfileDetails: (state) => {
      state.loading = true;
      state.error = '';
      state.profileDetails = {};
    },
    getProfileDetailsSuccess: (state, action) => {
      state.profileDetails = action.payload;
      state.loading = false;
      state.error = '';
    },
    getProfileDetailsFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.profileDetails = {};
    },
    updateProfileDetails: (state) => {
      state.loading = true;
      state.error = '';
      state.profileDetails = {};
    },
    updateProfileDetailsSuccess: (state, action) => {
      state.profileDetails = action.payload;
      state.loading = false;
      state.error = '';
    },
    updateProfileDetailsFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.profileDetails = {};
    },
    updateProfileImage: (state) => {
      state.loading = true;
      state.error = '';
    },
    updateProfileImageSuccess: (state) => {
      state.loading = false;
      state.error = '';
    },
    updateProfileImageFailure: (state) => {
      state.loading = false;
      state.error = '';
    },
  },
});

export const { actions: profileActions } = profileSlice;
export default profileSlice.reducer;
