import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { getData, setData } from './storage';
import { ENV } from '../config/env';

export const GOOGLE_WEB_CLIENT_ID = ENV.GOOGLE_WEB_CLIENT_ID;
export const IOS_CLIENT_ID = ENV.GOOGLE_IOS_CLIENT_ID;

export const APPLE_USER_CACHE_KEY = 'APPLE_USER_PROFILE_CACHE';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    offlineAccess: false,
  });
};

// Configure as soon as this module loads so the first tap isn't racing useEffect.
// GoogleSignin.signIn() awaits the library's internal configure promise.
configureGoogleSignIn();

const decodeJwtPayload = token => {
  try {
    if (!token || typeof token !== 'string') return null;
    const segment = token.split('.')[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );
    const json =
      typeof global.atob === 'function'
        ? global.atob(padded)
        : Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (error) {
    console.log('decodeJwtPayload error', error);
    return null;
  }
};

export const getCachedAppleProfile = async appleUserId => {
  if (!appleUserId) return null;
  const cache = (await getData(APPLE_USER_CACHE_KEY)) || {};
  return cache[appleUserId] || null;
};

export const cacheAppleProfile = async (appleUserId, profile) => {
  if (!appleUserId || !profile) return;
  const cache = (await getData(APPLE_USER_CACHE_KEY)) || {};
  const previous = cache[appleUserId] || {};
  cache[appleUserId] = {
    ...previous,
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  await setData(APPLE_USER_CACHE_KEY, cache);
};

/**
 * Normalize Apple auth response and merge with local cache.
 * Apple only returns fullName/email on the *first* authorization.
 */
export const resolveAppleUserProfile = async appleAuthResponse => {
  const appleUserId = appleAuthResponse?.user || '';
  const cached = await getCachedAppleProfile(appleUserId);
  const jwtPayload = decodeJwtPayload(appleAuthResponse?.identityToken);

  const givenName =
    appleAuthResponse?.fullName?.givenName || cached?.firstName || '';
  const familyName =
    appleAuthResponse?.fullName?.familyName || cached?.lastName || '';
  const email =
    appleAuthResponse?.email || jwtPayload?.email || cached?.email || '';

  const profile = {
    appleUserId,
    firstName: givenName || '',
    lastName: familyName || '',
    email: email || '',
    identityToken: appleAuthResponse?.identityToken || '',
    authorizationCode: appleAuthResponse?.authorizationCode || '',
    providedByApple: !!(givenName || familyName || email),
  };

  if (appleUserId && (givenName || familyName || email)) {
    await cacheAppleProfile(appleUserId, {
      firstName: givenName,
      lastName: familyName,
      email,
    });
  }

  return profile;
};

export const signInWithGoogle = async () => {
  try {
    // Ensure configure has been invoked (safe to call again)
    configureGoogleSignIn();

    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    const userInfo = await GoogleSignin.signIn();

    // v13+ returns { type: 'cancelled' } instead of throwing on cancel
    if (!userInfo || userInfo.type === 'cancelled') {
      return null;
    }

    let idToken = userInfo?.data?.idToken || userInfo?.idToken || '';

    if (!idToken) {
      try {
        const tokens = await GoogleSignin.getTokens();
        if (tokens?.idToken) {
          idToken = tokens.idToken;
        }
      } catch (tokenError) {
        console.log('error in getTokens', tokenError);
      }
    }

    if (!idToken) {
      throw new Error('Unable to get Google ID token');
    }

    return {
      ...userInfo,
      idToken,
      data: {
        ...(userInfo?.data || {}),
        idToken,
        user: userInfo?.data?.user || userInfo?.user,
      },
    };
  } catch (error) {
    console.log(error, 'error');

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return null;
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      return null;
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return null;
    }

    throw error;
  }
};

export const onAppleButtonPress = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse?.identityToken) {
      return null;
    }

    // Confirm credential is still authorized for this Apple user id
    if (appleAuthRequestResponse.user) {
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        console.log('Apple credential not authorized:', credentialState);
      }
    }

    const profile = await resolveAppleUserProfile(appleAuthRequestResponse);
    return {
      ...appleAuthRequestResponse,
      profile,
    };
  } catch (error) {
    console.log('Apple Login Error:', error);
    return null;
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
  }
};
