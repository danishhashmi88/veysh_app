import { createSlice } from '@reduxjs/toolkit';
import { extractPlannerList } from '../../utils/helper';
import {
  getPlannerList,
  addPlannerEvent,
  getOutfitOfTheDay,
  deleteEvent,
  updateEvent,
  getWardrobeInsights,
  getTotalSpend,
  getRentItemsList,
} from '../thunks/plannerThunk';

const initialState = {
  loading: false,
  plannerList: [],
  ootdList: [],
  totalRecords: 0,
  page: 1,
  offset: 0,
  perPage: 10,
  error: null,
  success: false,
  type: 'most_worn',
  wardrobeItems: [],
  totalSpend: null,
  averageClosetValue: 0,
  rentItems: [],
  rentOutfits: [],
  draftPlannerData: {
    name: '',
    date: '',
    time: '',
    notes: '',
    dayReminder: false,
    hourReminder: false,
    isDraftActive: false,
  },
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    clearPlannerState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    updateDraftPlannerData: (state, action) => {
      state.draftPlannerData = { ...state.draftPlannerData, ...action.payload, isDraftActive: true };
    },
    clearDraftPlannerData: state => {
      state.draftPlannerData = initialState.draftPlannerData;
    },
  },
  extraReducers: builder => {
    // getPlannerList
    builder.addCase(getPlannerList.pending, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getPlannerList.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.plannerList = action.payload?.list || [];
      state.totalRecords = action.payload?.total_records || 0;
      state.page = action.payload?.page || 1;
      state.offset = action.payload?.offset || 0;
      state.perPage = action.payload?.per_page || 10;
    });
    builder.addCase(getPlannerList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
    // getwrod
    builder.addCase(getWardrobeInsights.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getWardrobeInsights.fulfilled, (state, action) => {
      state.loading = false;
      state.type = action.payload?.type || '';
      state.wardrobeItems = action.payload?.items || [];
      state.averageClosetValue = action.payload?.averageClosetValue ?? 0;
    });
    builder.addCase(getWardrobeInsights.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // addPlannerEvent
    builder.addCase(addPlannerEvent.pending, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addPlannerEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(addPlannerEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // getOutfitOfTheDay
    builder.addCase(getOutfitOfTheDay.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOutfitOfTheDay.fulfilled, (state, action) => {
      state.loading = false;
      state.ootdList = extractPlannerList(action.payload);
    });
    builder.addCase(getOutfitOfTheDay.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //deleteEvent
    builder.addCase(deleteEvent.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.plannerList = state.plannerList.filter(
        item => item._id !== action.payload,
      );
      state.totalRecords = Math.max(0, state.totalRecords - 1);
    });
    builder.addCase(deleteEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //updateEvent
    builder.addCase(updateEvent.pending, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(updateEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    builder.addCase(getTotalSpend.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTotalSpend.fulfilled, (state, action) => {
      state.loading = false;

      state.totalSpend = action.payload;
    });
    builder.addCase(getTotalSpend.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // getRentItemsList
    builder.addCase(getRentItemsList.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRentItemsList.fulfilled, (state, action) => {
      state.loading = false;
      state.rentItems = action.payload?.rent_items || [];
      state.rentOutfits = action.payload?.rent_outfits || [];
    });
    builder.addCase(getRentItemsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearPlannerState, updateDraftPlannerData, clearDraftPlannerData } = plannerSlice.actions;
export default plannerSlice.reducer;
