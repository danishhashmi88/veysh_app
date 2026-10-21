import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Switch,
  ScrollView,
} from 'react-native';

import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, OutfitFamily, GaramondFamily } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../../hooks/useTheme';
import { resetAuthState } from '../../../redux/slices/userSlice';
import { updateGlobalSliceState } from '../../../redux/slices/globalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH_TOKEN_KEY,
  USER_DATA,
  USER_ID,
  USER_ROLE,
} from '../../../utils/storage';
import { clearAllAiDataConsent } from '../../../utils/aiConsent';
import LogoutModal from '../../Profile/Logout';

const MenuDrawer = forwardRef(
  (
    {
      userDetails = {},
      onNavigate = () => { },
      onToggleTheme = () => { },
      onMyPostsPress = () => { }, // 👈 custom action
      isLightTheme = false,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const logoutModalRef = useRef(null);
    const slideAnim = useRef(new Animated.Value(-wp(100))).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const themeColors = useTheme();

    /* ================= MENU ITEMS ================= */
    const menuItems = [
      {
        id: 1,
        label: 'My Lookbook',
        icon: imagePath.lookbookHome,
        type: 'navigate',
        screen: 'MyLookbook',
      },
      {
        id: 2,
        label: 'My Outfits',
        icon: imagePath.outfit,
        type: 'navigate',
        screen: 'OutfitHome',
        action: 'MY_OUTFITS',
      },
      {
        id: 3,
        label: 'My Posts',
        icon: imagePath.list_detail,
        type: 'custom',
        action: 'MY_POSTS',
      },
      {
        id: 4,
        label: 'Closet Insights',
        icon: imagePath.graph,
        type: 'navigate',
        screen: 'ClosetInsightsScreen',
      },
      {
        id: 5,
        label: 'Rent / Buy',
        icon: imagePath.shopping_bag,
        type: 'navigate',
        screen: 'RentBuyScreen',
      },
      // {
      //   id: 6,
      //   label: 'My Orders',
      //   icon: imagePath.box,
      //   type: 'none',
      //   // screen: 'MyOrders',
      // },
      {
        id: 7,
        label: 'Subscriptions',
        icon: imagePath.list,
        type: 'navigate',
        screen: 'SubscriptionPlans',
      },
      // {
      //   id: 8,
      //   label: 'My Rewards',
      //   icon: imagePath.coins,
      //   type: 'none',
      //   // screen: 'MyRewards',
      // },
      {
        id: 9,
        label: 'Settings',
        icon: imagePath.settings,
        type: 'navigate',
        screen: 'Settings',
      },
      {
        id: 10,
        label: 'Help',
        icon: imagePath.question_mark || imagePath.message,
        type: 'navigate',
        screen: 'Help',
      },
      {
        id: 11,
        label: 'Logout',
        icon: imagePath.LogOut || imagePath.logout,
        type: 'logout',
      },

    ];


    const openDrawer = () => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const closeDrawer = () => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -wp(100),
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    };

    useImperativeHandle(ref, () => ({
      open: openDrawer,
      close: closeDrawer,
    }));

    const handleMenuPress = item => {
      closeDrawer();

      setTimeout(() => {
        if (item.type === 'navigate') {
          onNavigate(item.screen);
        }

        if (item.type === 'custom') {
          if (item.action === 'MY_POSTS') {
            onMyPostsPress();
          }
          if (item.action === 'MY_OUTFITS') {
            onNavigate(() => navigation.navigate('OutfitHome'));
          }
        }

        if (item.type === 'logout') {
          handleLogoutPress();
        }
      }, 300);
    };

    const handleLogoutPress = () => {
      closeDrawer();
      setTimeout(() => {
        logoutModalRef.current?.open();
      }, 350);
    };

    const handleLogoutConfirm = async () => {
      await clearAllAiDataConsent();
      await AsyncStorage.multiRemove([
        AUTH_TOKEN_KEY,
        USER_DATA,
        USER_ID,
        USER_ROLE,
      ]);
      dispatch(resetAuthState());
      dispatch(updateGlobalSliceState(false));
    };

    return (
      <>
        <Modal transparent visible={visible} animationType="none">
          <View style={styles.container}>
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={closeDrawer}
                activeOpacity={1}
              />
            </Animated.View>

            {/* Drawer */}
            <Animated.View
              style={[
                styles.drawer,
                {
                  transform: [{ translateX: slideAnim }],
                  backgroundColor: themeColors.backGroundColor1,
                },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Profile */}
                <View style={styles.profileSection}>
                  <Image
                    source={
                      userDetails?.profileImage
                        ? { uri: userDetails.profileImage }
                        : imagePath.Post1
                    }
                    style={styles.profileImage}
                  />
                  <Text style={styles.userName}>
                    {userDetails?.firstName
                      ? `${userDetails.firstName} ${userDetails.lastName || ''}`
                      : 'Caroline Barbee'}
                  </Text>
                </View>

                {/* Menu */}
                <View style={styles.menuItemsContainer}>
                  {menuItems.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleMenuPress(item)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={item.icon}
                        style={[
                          styles.menuIcon,
                          { tintColor: themeColors.themeColor },
                        ]} // ✅ Style ke andar daaliye
                        resizeMode="contain"
                      />
                      <Text style={[styles.menuLabel, { color: themeColors.blackVar3 }]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Logout Button */}
            </Animated.View>
          </View>
        </Modal>

        <LogoutModal
          ref={logoutModalRef}
          onPress={() => {
            logoutModalRef.current?.close();
            handleLogoutConfirm();
          }}
          buttonTitle="Yes"
          cancelText="No"
        />
      </>
    );
  },
);

export default MenuDrawer;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: wp(75),
    backgroundColor: Colors.backGroundColor1,
    borderTopRightRadius: wp(8),
    borderBottomRightRadius: wp(8),
    elevation: 6,
  },
  scrollContent: {
    paddingTop: hp(6),
    paddingBottom: hp(3),
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: hp(3),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBorder,
    marginHorizontal: wp(4),
  },
  profileImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    marginBottom: hp(1.5),
  },
  userName: {
    fontSize: FontSize.FONT_22,
    fontFamily: FontFamily.Bold,
  },
  menuItemsContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  menuIcon: {
    width: wp(5.5),
    height: wp(5.5),
    marginRight: wp(4),
    tintColor: Colors.redvar3,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.FONT_15,
    fontFamily: FontFamily.OutfitMedium,
    // color: Colors.red,
  },
  // sellerButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#FBF9FF',
  //   marginHorizontal: wp(4),
  //   marginTop: hp(18),
  //   paddingVertical: hp(2),
  //   paddingHorizontal: wp(4),
  //   borderRadius: wp(6),
  //   borderBottomColor: '#7100D7',
  //   borderBottomWidth: 1,
  // },
  sellerIcon: {
    width: wp(6),
    height: wp(6),
    marginRight: wp(3),
  },
  sellerText: {
    flex: 1,
    fontSize: FontSize.FONT_15,
    fontFamily: GaramondFamily.Regular,
  },
  arrowIcon: {
    width: wp(6),
    height: wp(6),
  },
});
