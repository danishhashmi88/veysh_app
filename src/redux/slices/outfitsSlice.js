import { createSlice } from '@reduxjs/toolkit';
import {
  getOutfitsList,
  createOutfit,
  getOutfitDetails,
  deleteOutfit,
} from '../thunks/outfitsThunk';

const initialState = {
  loading: false,
  outfitsList: [],
  totalRecords: 0,
  error: null,
  success: false,
  outfitDetail: null,
  detailLoading: false,
  detailError: null,
};

const outfitsSlice = createSlice({
  name: 'outfits',
  initialState,
  reducers: {
    clearOutfitsState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearOutfitDetail: state => {
      state.outfitDetail = null;
      state.detailError = null;
    },
  },
  extraReducers: builder => {
    // getOutfitsList
    builder.addCase(getOutfitsList.pending, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getOutfitsList.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.outfitsList = action.payload?.list || [];
      state.totalRecords = action.payload?.total_records || 0;
    });
    builder.addCase(getOutfitsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // createOutfit
    builder.addCase(createOutfit.pending, state => {
      state.loading = true;
    });
    builder.addCase(createOutfit.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(createOutfit.rejected, state => {
      state.loading = false;
    });

    // getOutfitDetails
    builder.addCase(getOutfitDetails.pending, state => {
      state.detailLoading = true;
      state.detailError = null;
    });
    builder.addCase(getOutfitDetails.fulfilled, (state, action) => {
      state.detailLoading = false;
      state.outfitDetail = action.payload;
    });
    builder.addCase(getOutfitDetails.rejected, (state, action) => {
      state.detailLoading = false;
      state.detailError = action.payload;
    });

    // deleteOutfit
    builder.addCase(deleteOutfit.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteOutfit.fulfilled, (state, action) => {
      state.loading = false;
      state.outfitsList = state.outfitsList.filter(
        item => item._id !== action.payload,
      );
      state.totalRecords = Math.max(0, state.totalRecords - 1);
    });
    builder.addCase(deleteOutfit.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearOutfitsState, clearOutfitDetail } = outfitsSlice.actions;
export default outfitsSlice.reducer;
