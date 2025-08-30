import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileUrl: null, // Store the URL/path to the profile picture
  coverUrl: null, // Store the URL/path to the cover picture
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setProfileUrl: (state, action) => {
      // Store the URL/path of the uploaded profile picture
      localStorage.setItem("profileUrl", action.payload);
      state.profileUrl = action.payload;
    },
    setCoverUrl: (state, action) => {
      // Store the URL/path of the uploaded cover picture
      localStorage.setItem("coverUrl", action.payload);
      state.coverUrl = action.payload;
    },
    // Load URLs from localStorage on app initialization
    loadFromStorage: (state) => {
      const profileUrl = localStorage.getItem("profileUrl");
      const coverUrl = localStorage.getItem("coverUrl");
      if (profileUrl) state.profileUrl = profileUrl;
      if (coverUrl) state.coverUrl = coverUrl;
    },
  },
});

export const { setProfileUrl, setCoverUrl, loadFromStorage } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
