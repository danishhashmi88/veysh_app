import postsSlice from './slices/postsSlice';
import { configureStore } from '@reduxjs/toolkit';
import RootWorkSlice from './slices/rootLoaderSlice';
import GlobalSlice from './slices/globalSlice';
import UserSlice from './slices/userSlice';
import ThemeSlice from './slices/themeSlice';
import ItemsSlice from './slices/itemsSlice';
import OutfitsSlice from './slices/outfitsSlice';
import PlannerSlice from './slices/plannerSlice';
import SocialCommunitySlice from './slices/socialCommunitySlice';
import SubscriptionSlice from './slices/subscriptionSlice';


export const store = configureStore({
  reducer: {
    rootLoader: RootWorkSlice,
    global: GlobalSlice,
    user: UserSlice,
    theme: ThemeSlice,
    items: ItemsSlice,
    posts: postsSlice,
    outfits: OutfitsSlice,
    planner: PlannerSlice,
    socialCommunity: SocialCommunitySlice,
    subscription: SubscriptionSlice,
  },
});
