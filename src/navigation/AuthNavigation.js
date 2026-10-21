import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import SplashScreen from '../screens/Splash/Splash';
import Onboarding from '../screens/authScreens/Onboarding/Onboarding';
import AuthSelection from '../screens/authScreens/Auth/Auth';
import Login from '../screens/authScreens/Login/Login';
import ForgotPass from '../screens/authScreens/ForgotPass/ForgotPass';
import CheckEmail from '../screens/authScreens/ForgotPass/CheckEmail';
import ResetPass from '../screens/authScreens/ResetPass/ResetPass';
import LinkSend from '../screens/authScreens/LinkSent/LinkSent';
import OtpVerification from '../screens/authScreens/OtpVerification/OtpVerification';
import EmailOtpVerification from '../screens/authScreens/EmailOtpVerification/EmailOtpVerification';
import ForgotPassOtp from '../screens/authScreens/ForgotPassOtp/ForgotPassOtp';
import Signup from '../screens/authScreens/Signup/Signup';
import CompleteProfile from '../screens/authScreens/ProfileSetup/ProfileInfo/ProfileInfo';
import BrandPreference from '../screens/authScreens/ProfileSetup/BrandPreference/BrandPreference';
import SizeInfo from '../screens/authScreens/ProfileSetup/SizeInfo/SizeInfo';
import PersonalApperence from '../screens/authScreens/ProfileSetup/PersonalApperence/PersonalApperence';
import DefineYourStyle from '../screens/authScreens/ProfileSetup/DefineStyle/DefineStyle';
import AssignedTask from '../screens/authScreens/ProfileSetup/AssignedTask/AssignedTask';
import PrivacySetting from '../screens/authScreens/ProfileSetup/PrivacySetting/PrivacySetting';
import ThankYou from '../screens/authScreens/ProfileSetup/ThankYou/ThankYou';
import CmsScreen from '../screens/Cms/CmsPages/CmsPage';
import StylistProfileSet from '../screens/authScreens/stylistProfileSetup/stylistProfileSet/StylistProfileSet';

const AuthNavigation = () => {
  const Stack = createNativeStackNavigator();
  const showOnboard = useSelector(state => state.global.showOnboard);
  const authInitialRoute = useSelector(state => state.global.authInitialRoute);

  const initialRouteName = showOnboard
    ? 'Onboard'
    : authInitialRoute === 'Login'
      ? 'Login'
      : 'AuthSelection';

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name="Onboard" component={Onboarding} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AuthSelection" component={AuthSelection} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="CheckEmail" component={CheckEmail} />
        <Stack.Screen name="ResetPass" component={ResetPass} />
        <Stack.Screen name="LinkSend" component={LinkSend} />

        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen
          name="EmailOtpVerification"
          component={EmailOtpVerification}
        />
        <Stack.Screen name="ForgotPassOtp" component={ForgotPassOtp} />
        <Stack.Screen name="BrandPreference" component={BrandPreference} />
        <Stack.Screen name="SizeInfo" component={SizeInfo} />
        <Stack.Screen name="PersonalApperence" component={PersonalApperence} />
        <Stack.Screen name="DefineYourStyle" component={DefineYourStyle} />
        <Stack.Screen name="AssignedTask" component={AssignedTask} />
        <Stack.Screen name="PrivacySetting" component={PrivacySetting} />
        <Stack.Screen name="ThankYou" component={ThankYou} />
        <Stack.Screen name="CmsScreen" component={CmsScreen} />
        <Stack.Screen name="StylistProfileSet" component={StylistProfileSet} />
      </Stack.Navigator>
    </>
  );
};

export default AuthNavigation;
