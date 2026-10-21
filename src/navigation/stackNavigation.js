import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import SplashScreen from '../screens/Splash/Splash';
import CmsScreen from '../screens/Cms/CmsPages/CmsPage';
import FrequentQuestions from '../screens/Cms/Faq/Faq';
import NotificationSettings from '../screens/Cms/NotificationSettings/NotificationSettings';
import ContactUs from '../screens/Cms/ContactUs/ContactUs';
import Settings from '../screens/Cms/Settings/Settings';
import PrivacySettings from '../screens/Cms/PolicySetting/PolicySetting';
import Help from '../screens/Cms/Help/Help';
import ChangePassword from '../screens/Cms/ChangePassword/ChangePassword';

import HomeScreen from '../screens/appScreens/homeScreens/HomeScreen';
import EditProfile from '../screens/appScreens/editProfile/EditProfile';
import MyProfile from '../screens/appScreens/myProfile/MyProfile';
import EditStylePreferance from '../screens/appScreens/editStylePreferance/EditStylePreferance';
import EditMyStyle from '../screens/appScreens/editMyStyle/EditMyStyle';
import ResetPass from '../screens/authScreens/ResetPass/ResetPass';
import ForgotPassOtp from '../screens/authScreens/ForgotPassOtp/ForgotPassOtp';
import CompleteProfile from '../screens/authScreens/ProfileSetup/ProfileInfo/ProfileInfo';
import DefineYourStyle from '../screens/authScreens/ProfileSetup/DefineStyle/DefineStyle';
import BrandPreference from '../screens/authScreens/ProfileSetup/BrandPreference/BrandPreference';
import SizeInfo from '../screens/authScreens/ProfileSetup/SizeInfo/SizeInfo';
import PersonalApperence from '../screens/authScreens/ProfileSetup/PersonalApperence/PersonalApperence';
import AssignedTask from '../screens/authScreens/ProfileSetup/AssignedTask/AssignedTask';
import PrivacySetting from '../screens/authScreens/ProfileSetup/PrivacySetting/PrivacySetting';
import ThankYou from '../screens/authScreens/ProfileSetup/ThankYou/ThankYou';
import StylistProfileSet from '../screens/authScreens/stylistProfileSetup/stylistProfileSet/StylistProfileSet';
import ImagePreview from '../screens/appScreens/imagePreview/ImagePreview';
import AddItemDetails from '../screens/appScreens/addClosetScreens/addItemDetails/AddItemDetails';
// import ClosetFormData from '../screens/appScreens/addClosetScreens/addClosetForm/closetFormData';
import AddClosetFinalScreen from '../screens/appScreens/addClosetScreens/addClosetFinalScreen/AddClosetFinalScreen';
import FilterClosetData from '../screens/appScreens/showClosetScreens/filterCloset/FilterClosetData';
import MyClosetHome from '../screens/appScreens/showClosetScreens/myClosetHome/MyClosetHome';
import OutfitHome from '../screens/appScreens/outfitScreens/outfitHome/outfitHome';
import ClosetDetails from '../screens/appScreens/showClosetScreens/closetDetails/ClosetDetails';
import CreateOutfitScreen from '../screens/appScreens/createOutfitScreens/CreateOutfitScreen';
import AddOutfitDetails from '../screens/appScreens/createOutfitScreens/AddOutfitDetails';
import Thanku from '../screens/appScreens/createOutfitScreens/Thanku/Thanku';
import OutfitDetail from '../screens/appScreens/outfitScreens/outfitDetail/OutfitDetail';

import MyPlanner from '../screens/appScreens/planner/MyPlanner';
import CreatePlanner from '../screens/appScreens/planner/CreatePlanner';
import Calendar from '../screens/appScreens/planner/Calendar';

import ItemDetail from '../screens/appScreens/planner/ItemDetail';

import MainTabNavigator from './MainTabNavigator';
import CreatePosts from '../screens/appScreens/createNewPosts/createPosts';
import PostsList from '../screens/appScreens/myPosts/PostsList';
import UserProfile from '../screens/appScreens/userProfileScreen/UserProfile';
import BlockedUsers from '../screens/appScreens/blockedUsers/BlockedUsers';
import ReportPostScreen from '../screens/appScreens/socialScreens/ReportPostScreen';
import ClosetInsights from '../screens/appScreens/closetInsightsScreen/ClosetInsightScreen';
import LookBookHome from '../screens/appScreens/lookBook/lookBookHome/LookBookHome';
import CreateLookbook from '../screens/appScreens/lookBook/createLookbook/CreateLookbook';
import ChatScreen from '../screens/appScreens/messageScreens/ChatScreen';
import SelectOutfitScreen from '../screens/appScreens/messageScreens/SelectOutfitScreen';
import SocialCommunity from '../screens/appScreens/socialScreens/SocialCommunity';
import RentBuyScreen from '../screens/appScreens/rentBuyScreen/RentBuyScreen';
import RentItemDetail from '../screens/appScreens/rentBuyScreen/RentItemDetail';
import ContactUsDetails from '../screens/appScreens/rentBuyScreen/ContactUsDetails';

import AiHomeScreen from '../screens/appScreens/AIScreen/AiHomeScreen';
import SubscriptionPlans from '../screens/appScreens/SubscriptionPlans/SubscriptionPlans';
import PaymentSuccess from '../screens/appScreens/SubscriptionPlans/PaymentSuccess';
import Notifications from '../screens/appScreens/notifications/Notifications';
import SearchUser from '../screens/appScreens/Search/SearchUser';
import ItemHomes from '../screens/appScreens/planner/itemHomes';

const StackNavigation = ({ initialRouteName }) => {
  const Stack = createNativeStackNavigator();
  const { initialAppRoute } = useSelector(state => state.global);

  const AUTH_ONLY_ROUTES = ['Login', 'AuthSelection', 'Signup', 'Onboard', 'Splash'];
  const resolvedInitialRoute =
    initialRouteName ||
    (AUTH_ONLY_ROUTES.includes(initialAppRoute) ? 'MainTab' : initialAppRoute) ||
    'MainTab';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={resolvedInitialRoute}
    >
      <Stack.Screen name="MainTab" component={MainTabNavigator} />
      <Stack.Screen name="HomeScreen" component={MainTabNavigator} />
      <Stack.Screen name="MyClosetHome" component={MainTabNavigator} />
      <Stack.Screen name="ForgotPassOtp" component={ForgotPassOtp} />
      <Stack.Screen name="OutfitHome" component={OutfitHome} />

      {/* Screens that stack ON TOP of tabs */}
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen
        name="EditStylePreferance"
        component={EditStylePreferance}
      />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
      <Stack.Screen name="StylistProfileSet" component={StylistProfileSet} />
      <Stack.Screen name="EditMyStyle" component={EditMyStyle} />
      <Stack.Screen name="DefineYourStyle" component={DefineYourStyle} />
      <Stack.Screen
        name="AddClosetFinalScreen"
        component={AddClosetFinalScreen}
      />
      {/* Removed MyClosetHome and HomeScreen as they are in MainTab */}
      <Stack.Screen
        name="CmsScreen"
        component={CmsScreen}
        options={{ contentStyle: { backgroundColor: '#FFFFFF' } }}
      />
      <Stack.Screen name="FrequentQuestions" component={FrequentQuestions} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
      <Stack.Screen name="BrandPreference" component={BrandPreference} />
      <Stack.Screen name="SizeInfo" component={SizeInfo} />
      <Stack.Screen name="PersonalApperence" component={PersonalApperence} />
      <Stack.Screen name="AssignedTask" component={AssignedTask} />
      <Stack.Screen name="PrivacySetting" component={PrivacySetting} />
      <Stack.Screen name="ThankYou" component={ThankYou} />
      <Stack.Screen name="AddItemDetails" component={AddItemDetails} />
      {/* <Stack.Screen name="ClosetFormData" component={ClosetFormData} /> */}
      <Stack.Screen
        name="FilterClosetData"
        component={FilterClosetData}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="ClosetDetails" component={ClosetDetails} />
      <Stack.Screen name="CreateOutfit" component={CreateOutfitScreen} />
      <Stack.Screen name="AddOutfitDetails" component={AddOutfitDetails} />
      <Stack.Screen name="Thanku" component={Thanku} />
      <Stack.Screen name="OutfitDetail" component={OutfitDetail} />
      <Stack.Screen name="ItemHomes" component={ItemHomes} />
      <Stack.Screen name="MyPlanner" component={MyPlanner} />
      <Stack.Screen name="CreatePlanner" component={CreatePlanner} />
      <Stack.Screen name="ItemDetail" component={ItemDetail} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
      />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ImagePreview" component={ImagePreview} />

      <Stack.Screen name="Calendar" component={Calendar} />
      <Stack.Screen name="CreatePosts" component={CreatePosts} />
      <Stack.Screen name="PostsList" component={PostsList} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
      <Stack.Screen name="ReportPostScreen" component={ReportPostScreen} />
      <Stack.Screen name="ClosetInsightsScreen" component={ClosetInsights} />
      <Stack.Screen name="MyLookbook" component={LookBookHome} />
      <Stack.Screen name="CreateLookbook" component={CreateLookbook} />
      <Stack.Screen name="AiHomeScreen" component={AiHomeScreen} />
      <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlans} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="SelectOutfitScreen" component={SelectOutfitScreen} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen
        name="SocialCommunityScreen"
        component={SocialCommunity}
        options={{
          headerShown: false,
          statusBarTranslucent: true,
        }}
      />
      <Stack.Screen name="RentBuyScreen" component={RentBuyScreen} />
      <Stack.Screen name="RentItemDetail" component={RentItemDetail} />
      <Stack.Screen name="ContactUsDetails" component={ContactUsDetails} />
      <Stack.Screen name="SearchUser" component={SearchUser} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
