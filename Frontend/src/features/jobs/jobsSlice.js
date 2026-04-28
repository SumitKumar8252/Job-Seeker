import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "../auth/authSlice";
import { apiGet, apiPost, getErrorMessage } from "../../shared/api/client";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      return await apiGet("/jobs");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to fetch jobs"));
    }
  },
  {
    condition: (_, { getState }) => getState().jobs.status !== "loading",
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiPost("/jobs/create", payload);
      return data.job;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to create job"));
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobFeedback: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to fetch jobs";
      })
      .addCase(createJob.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items = [action.payload, ...state.items];
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Unable to create job";
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { clearJobFeedback } = jobsSlice.actions;

export const selectJobs = (state) => state.jobs.items;
export const selectJobsStatus = (state) => state.jobs.status;
export const selectJobsError = (state) => state.jobs.error;
export const selectCreateJobStatus = (state) => state.jobs.createStatus;
export const selectCreateJobError = (state) => state.jobs.createError;

export const selectJobStats = createSelector([selectJobs], (jobs) => ({
  total: jobs.length,
  applied: jobs.filter((job) => job.status === "Applied").length,
  interview: jobs.filter((job) => job.status === "Interview").length,
  offer: jobs.filter((job) => job.status === "Offer").length,
  rejected: jobs.filter((job) => job.status === "Rejected").length,
}));

export const selectJobsInsights = createSelector(
  [selectJobs, selectJobStats],
  (jobs, stats) => {
    const companyCounts = jobs.reduce((accumulator, job) => {
      const companyName = job.company?.trim();

      if (companyName) {
        accumulator[companyName] = (accumulator[companyName] || 0) + 1;
      }

      return accumulator;
    }, {});

    const salaryValues = jobs
      .map((job) => job.salary)
      .filter((salary) => typeof salary === "number" && !Number.isNaN(salary));

    const pipelinePriority = [
      ["Applied", stats.applied],
      ["Interview", stats.interview],
      ["Offer", stats.offer],
      ["Rejected", stats.rejected],
    ].sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1]);

    return {
      averageSalary: salaryValues.length
        ? Math.round(
            salaryValues.reduce((sum, salary) => sum + salary, 0) /
              salaryValues.length
          )
        : null,
      companyCount: Object.keys(companyCounts).length,
      topCompanies: Object.entries(companyCounts)
        .sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count })),
      latestJob: jobs[0] || null,
      dominantStage: pipelinePriority[0]?.[1] ? pipelinePriority[0][0] : "Applied",
      activeJobs: Math.max(stats.total - stats.rejected, 0),
    };
  }
);

export default jobsSlice.reducer;
