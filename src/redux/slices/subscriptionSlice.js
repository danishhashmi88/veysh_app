import { createSlice } from '@reduxjs/toolkit';
import { addSubscription, cancelSubscription, getActiveSubscriptionDetails, getSubscriptionList, updateSubscription, verifySubscriptionPayment } from '../thunks/subscriptionThunk';

const initialState = {
    subscriptionLists: [],
    loading: false,
    error: null,
    activeSubscriptionDetails: {},
    subscriptionData: null,
    verifyPayment:null
};

export const subscriptionSlice = createSlice({
    name: 'SubscriptionSlice',
    initialState,
    reducers: {
        clearSocialError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getSubscriptionList.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubscriptionList.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.subscriptionLists = action.payload.list;
            })
            .addCase(getSubscriptionList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = true;
            });
        //activeSubscriptiondetail
        builder
            .addCase(getActiveSubscriptionDetails.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getActiveSubscriptionDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.activeSubscriptionDetails = action.payload;
            })
            .addCase(getActiveSubscriptionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = true;
            });
        //cancelSubscription
        builder
            .addCase(cancelSubscription.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(cancelSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = true;
            });
        //addSubscription
        builder
            .addCase(addSubscription.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.subscriptionData = action.payload;
            })
            .addCase(addSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = true;
            });

        //updateSubscription
        builder
            .addCase(updateSubscription.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = true;
            });

        //verifyPayment
        builder
            .addCase(verifySubscriptionPayment.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifySubscriptionPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.verifyPayment = action.payload
            })
            .addCase(verifySubscriptionPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = true;
            });
    },
});

export const { clearSocialError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
