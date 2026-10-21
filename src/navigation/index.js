/* eslint-disable react-hooks/exhaustive-deps */
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackNavigation from './stackNavigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from '../screens/Splash/Splash';
import {
  AUTH_TOKEN_KEY,
  USER_ID,
  getData,
  ONBOARD_SHOWN_KEY,
} from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  updateGlobalSliceState,
  updateInitialAppRoute,
  updateShowOnboard,
} from '../redux/slices/globalSlice';
import { updateTokenData, updateUserData } from '../redux/slices/userSlice';
import { GetUserDetails } from '../services/auth.service';
import {
  mapBackendUserToFrontend,
  getScreenNameFromSlug,
} from '../utils/helper';

import GlobalModal from '../component/common/Modal/GlobalModal';
import { loadTheme } from '../redux/slices/themeSlice';
import { View, StyleSheet, Platform } from 'react-native';
import { ENV } from '../config/env';

export const navigationRef = createNavigationContainerRef();

const MainNavigation = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.global.isLoggedIn);

  const Stack = createNativeStackNavigator();
  const [showHideSplash, setShowHideSplash] = useState(true);
  console.log("showHideSplash", showHideSplash)
  useEffect(() => {
    if (Platform.OS === 'android') {
      manageLogin();
    }
  }, []);

  const manageLogin = async () => {
    dispatch(loadTheme());

    try {
      const onboardShown = await getData(ONBOARD_SHOWN_KEY);
      dispatch(updateShowOnboard(!onboardShown));

      const token = await getData(AUTH_TOKEN_KEY);
      if (token) {
        const storedUserId = await getData(USER_ID);
        console.log('storedUserIdhbdkvbkvbx', storedUserId);
        const response = await GetUserDetails(token, storedUserId);
        const user =
          response?.data?.user || response?.data?.data || response?.data;

        if (user) {
          const mappedUser = mapBackendUserToFrontend(user);
          dispatch(
            updateTokenData({
              token,
              userId: storedUserId || user._id,
              userRole: user.role,
            }),
          );
          dispatch(updateUserData(mappedUser));

          if (user.role === 'stylist') {
            const isProfileComplete =
              user?.first_name && user?.stylePreferences?.visibility;

            if (isProfileComplete) {
              dispatch(updateInitialAppRoute('MainTab'));
            } else {
              console.log('Redirecting to: StylistProfileSet');
              dispatch(updateInitialAppRoute('StylistProfileSet'));
            }
            dispatch(updateGlobalSliceState(true));
          } else {
            // Use profile_slugs if available, otherwise fallback
            const slugs = user.profile_slugs || {};
            const screenName = getScreenNameFromSlug(slugs);

            console.log(
              'Navigation: Analyzed Slugs:',
              slugs,
              'Target Screen:',
              screenName,
            );

            if (screenName === 'HomeScreen' || screenName === 'MainTab') {
              dispatch(updateInitialAppRoute('MainTab'));
            } else {
              console.log('Redirecting to:', screenName);
              dispatch(updateInitialAppRoute(screenName));
            }
            dispatch(updateGlobalSliceState(true));
          }
        } else {
          console.log('No user found with token');
          //  dispatch(updateGlobalSliceState(false)); // Ensure logged out
        }
      }
    } catch (e) {
      console.log('Restoring token failed', e);
    } finally {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          setShowHideSplash(false);
        }, 800);
      } else {
        setTimeout(() => {
          setShowHideSplash(false);
        }, 1500);
      }
    }

    // setTimeout(() => {
    //   setShowHideSplash(false);
    // }, 3000);

  }


  if (showHideSplash) {
    if (Platform.OS === 'ios') {
      return <SplashScreen manageLogin={manageLogin} />;
    } else {
      // Android: Return a blank view so it doesn't flash the Login screen
      return <View style={{ flex: 1, }} />;
    }
  }

  const linking = {
    prefixes: ENV.LINKING_PREFIXES,
    config: {
      screens: {
        StackNavigation: {
          screens: {
            SocialCommunityScreen: 'post/:postId',
            ClosetDetails: 'closet/:id',
            OutfitDetail: 'outfit/:outfitId',
            RentItemDetail: 'rent/:id',
          },
        },
      },
    },
  };

  return (
    <>
      <GlobalModal />

      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          {isLoggedIn ? (
            <Stack.Screen name="StackNavigation" component={StackNavigation} />
          ) : (
            <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainNavigation;
