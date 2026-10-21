import React, { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/appScreens/homeScreens/HomeScreen';
import MyClosetHome from '../screens/appScreens/showClosetScreens/myClosetHome/MyClosetHome';
import CustomBottomTab from '../component/common/UI/CustomBottomTab';
import FloatingActionMenu from '../component/common/UI/FloatingActionMenu';
import VerticalMediaPicker from '../component/common/Modal/VerticalMediaPicker';
import { Colors } from '../constant/colors';
import AppButton from '../component/common/Buttons/AppButton';
import PostsList from '../screens/appScreens/myPosts/PostsList';
import SocialCommunity from '../screens/appScreens/socialScreens/SocialCommunity';
import MessageScreen from '../screens/appScreens/messageScreens/MessageScreen';
import SearchUser from '../screens/appScreens/Search/SearchUser';

// Placeholder screens for other tabs
const IDCardScreen = () => (
  <View style={{ flex: 1, backgroundColor: 'red' }}>
    <Text>ID Card</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const navigation = useNavigation();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const isMenuAnimatingRef = useRef(false);
  const verticalPickerRef = useRef(null);

  const handleAddPress = () => {
    if (isMenuAnimatingRef.current) {
      return;
    }
    setIsAddMenuOpen(prev => !prev);
  };

  const handleMenuAnimatingChange = animating => {
    isMenuAnimatingRef.current = animating;
  };

  const handleSelectedMedia = media => {
    console.log('Selected Media:', media);
    if (media.path || media.uri) {
      navigation.navigate('ImagePreview', {
        imageUri: media.path || media.uri,
        mediaType: media.mime,
      });
    }
  };

  const handleNavigation = screen => {
    if (screen === 'AddItem') {
      verticalPickerRef.current?.open();
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={props => (
          <CustomBottomTab
            activeTab={props.state.routeNames[props.state.index]}
            onNavigate={screen => props.navigation.navigate(screen)}
            isAddMenuOpen={isAddMenuOpen}
            onAddPress={handleAddPress}
          />
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="MyCloset" component={MyClosetHome} />
        {/* <Tab.Screen name="IDCard" component={PostsList} /> */}
        <Tab.Screen name="SearchUser" component={SearchUser} />
        <Tab.Screen name="Messages" component={MessageScreen} />
      </Tab.Navigator>

      <FloatingActionMenu
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onNavigate={handleNavigation}
        onAnimatingChange={handleMenuAnimatingChange}
        colors={Colors}
      />

      <VerticalMediaPicker
        ref={verticalPickerRef}
        handleSelectedMedia={handleSelectedMedia}
      />
    </>
  );
};

export default MainTabNavigator;
