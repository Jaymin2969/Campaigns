import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Campaign} from '../types';

interface CampaignsState {
    campaigns: Campaign[];
}

const initialState: CampaignsState = {
    campaigns: [],
};

const campaignsSlice = createSlice({
    name: 'campaigns',
    initialState,
    reducers: {
        addCampaign: (state, action: PayloadAction<Campaign>) => {
            state.campaigns.push(action.payload);
        },
        updateCampaign: (state, action: PayloadAction<Campaign>) => {
            const index = state.campaigns.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.campaigns[index] = action.payload;
            }
        },
        deleteCampaign: (state, action: PayloadAction<string>) => {
            state.campaigns = state.campaigns.filter(campaign => campaign.id !== action.payload);
        },
    },
});

export const {addCampaign, updateCampaign, deleteCampaign} = campaignsSlice.actions;
export default campaignsSlice.reducer;
