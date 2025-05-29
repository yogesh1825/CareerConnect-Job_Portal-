import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    savedJobs: [],
    filterCriteria: {
      location: '',
      industry: '',
      salary: ''
    }
  },
  reducers: {
    // actions
    setAllJobs: (state, action) => {
      state.allJobs = action.payload || [];
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload || [];
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload || [];
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setFilterCriteria: (state, action) => {
      state.filterCriteria = action.payload || { location: '', industry: '', salary: '' };
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload || [];
    },
    resetSavedJobs: (state) => {
      state.savedJobs = [];
    },
    toggleSavedJob: (state, action) => {
      if (!action.payload || !action.payload._id) return;
      
      // Initialize savedJobs if undefined
      if (!state.savedJobs) {
        state.savedJobs = [];
      }
      
      const jobId = action.payload._id;
      const jobIndex = state.savedJobs.findIndex(job => 
        (job && job._id === jobId) || (String(job) === String(jobId))
      );
      
      if (jobIndex >= 0) {
        state.savedJobs = state.savedJobs.filter(job => 
          !((job && job._id === jobId) || (String(job) === String(jobId)))
        );
      } else {
        state.savedJobs.push(action.payload);
      }
    },
    isSavedJob: (state, action) => {
      if (!state.savedJobs || !action.payload) return false;
      return state.savedJobs.some(job => job && job._id === action.payload);
    }
  },
});
export const {
  setAllJobs,
  setSingleJob,
  setSearchJobByText,
  setAllAdminJobs,
  setAllAppliedJobs,
  setSearchedQuery,
  setFilterCriteria,
  setSavedJobs,
  resetSavedJobs,
  toggleSavedJob,
  isSavedJob
} = jobSlice.actions;
export default jobSlice.reducer;
