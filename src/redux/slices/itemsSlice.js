import { createSlice } from '@reduxjs/toolkit';
// Fix: Import updateItem alongside addItem
// Fix: Import updateItem and getItemsList alongside addItem
import { addItem, updateItem, getItemsList, getCategories, deleteItem } from '../thunks/itemsThunk';

const initialState = {
    loading: false,
    error: null,
    success: false,
    addedItem: null,
    tempItemData: null,
    itemsList: [], // Added itemsList
    categoriesList: [], // Added categoriesList
    ItemCategoryList: [], // Added for item categories
};

// Helper to parse nested list data from API response
const extractList = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (typeof payload === 'object') {
        const potentialArrays = [
            payload.data,
            payload.items,
            payload.list,
            payload.docs,
            payload.categories,
            // Deep nest check
            payload.data?.data,
            payload.data?.items,
            payload.data?.list,
            payload.data?.docs
        ];
        return potentialArrays.find(arr => Array.isArray(arr)) || [];
    }
    return [];
};

// State Helpers
const setPending = (state) => {
    state.loading = true;
    state.error = null;
    state.success = false;
};
const setRejected = (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.success = false;
};

export const ItemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        resetItemState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.addedItem = null;
        },
        setTempItemData: (state, action) => {
            state.tempItemData = action.payload;
        },
        clearTempItemData: (state) => {
            state.tempItemData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Add Item
            .addCase(addItem.pending, setPending)
            .addCase(addItem.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.addedItem = action.payload?.data?.item || action.payload;
            })
            .addCase(addItem.rejected, setRejected)

            // Update Item
            .addCase(updateItem.pending, setPending)
            .addCase(updateItem.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.addedItem = action.payload?.data?.item || action.payload;
                // const newItem = action.payload?.data?.item;
                // if (state.addedItem?._id === newItem?._id) {
                //     state.addedItem = newItem;
                // }
            })
            .addCase(updateItem.rejected, setRejected)

            // Get Items List
            .addCase(getItemsList.pending, setPending)
            .addCase(getItemsList.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.itemsList = extractList(action.payload);
            })
            .addCase(getItemsList.rejected, setRejected)

            // Get Categories
            .addCase(getCategories.pending, setPending)
            .addCase(getCategories.fulfilled, (state, action) => {
                console.log("actiopn.payload", action.payload)
                state.loading = false;
                const extractedList = extractList(action.payload);
                state.categoriesList = extractedList.filter(cat => cat.type === 'outfit');
                state.ItemCategoryList = extractedList.filter(cat => cat.type === 'item');
            })
            .addCase(getCategories.rejected, setRejected)

            // Delete Item
            .addCase(deleteItem.pending, setPending)
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (Array.isArray(state.itemsList)) {
                    state.itemsList = state.itemsList.filter(item => item?._id !== action.meta.arg);
                }
            })
            .addCase(deleteItem.rejected, setRejected);
    },
});

export const { resetItemState, setTempItemData, clearTempItemData } = ItemsSlice.actions;
export default ItemsSlice.reducer;


