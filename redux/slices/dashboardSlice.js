import { createSlice } from "@reduxjs/toolkit";

// These are written because Next.js does server-side rendering where
// window(top level object in browser) and localStorage are not available. so without these custome functions it will give error during build time
const getFromLocalStorage = (key, defaultValue = null) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

const setToLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

// initial state is evaluated when the component is loaded and this runs in the server because of that we can not just get the items from localStorage
// instead we will load the values from localStorage after the component mounts using a separate action
const initialState = {
  profileUrl: null, // Will be hydrated from localStorage after component mounts
  coverUrl: null, // Will be hydrated from localStorage after component mounts
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setProfileUrl: (state, action) => {
      // Store the URL/path of the uploaded profile picture
      setToLocalStorage("profileUrl", action.payload);
      state.profileUrl = action.payload;
    },
    setCoverUrl: (state, action) => {
      // Store the URL/path of the uploaded cover picture
      setToLocalStorage("coverUrl", action.payload);
      state.coverUrl = action.payload;
    },
    // Load URLs from localStorage - call this after component mounts on client side
    loadFromStorage: (state) => {
      state.profileUrl = getFromLocalStorage("profileUrl", "/profilePic.png");
      state.coverUrl = getFromLocalStorage("coverUrl", "/coverImage.PNG");
    },
  },
});

export const { setProfileUrl, setCoverUrl, loadFromStorage } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
