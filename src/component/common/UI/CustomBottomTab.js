import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { imagePath } from '../../../constant/imagePath';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontWeight } from '../../../constant/fonts';

const CustomBottomTab = ({
  activeTab,
  onNavigate,
  isAddMenuOpen,
  onAddPress,
}) => {
  // Default navigation handler if not provided
  const handleNavigation = screen => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <View style={styles.bottomTabContainer}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigation('Home')}
      >
        <Image
          source={imagePath.smart_home}
          style={[
            styles.tabIcon,
            activeTab === 'Home' && { tintColor: Colors.mediumPurple },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'Home' && styles.activeTabLabel,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigation('MyCloset')}
      >
        <Image
          source={imagePath.closet}
          style={[
            styles.tabIcon,
            activeTab === 'MyCloset' && { tintColor: Colors.mediumPurple },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'MyCloset' && styles.activeTabLabel,
          ]}
        >
          Closet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.floatingButtonWrapper,
          isAddMenuOpen && styles.floatingButtonWrapperActive,
        ]}
        activeOpacity={0.8}
        onPress={onAddPress}
      >
        <Image
          source={isAddMenuOpen ? imagePath.crossbottom : imagePath.plusbuttom}
          style={styles.floatingImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigation('SearchUser')}
      >
        <Image
          source={imagePath.id_home}
          style={[
            styles.tabIcon,
            activeTab === 'SearchUser' && {
              tintColor: Colors.mediumPurple,
            },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'SearchUser' && styles.activeTabLabel,
          ]}
        >
          Social
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigation('Messages')}
      >
        <Image
          source={imagePath.message}
          style={[
            styles.tabIcon,
            activeTab === 'Messages' && { tintColor: Colors.mediumPurple },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'Messages' && styles.activeTabLabel,
          ]}
        >
          Messages
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? hp(9) : hp(8),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),

    shadowColor: Colors.pureBlack,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: hp(1),
  },
  tabIcon: {
    width: wp(6.5),
    height: wp(6.5),
    tintColor: Colors.greyDark2,
    marginBottom: hp(0.2),
  },
  tabLabel: {
    fontSize: wp(2.8),
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.greyDark2,
    marginBottom: Platform.OS === 'ios' ? hp(2) : hp(1.5),
  },
  activeTabLabel: {
    color: Colors.mediumPurple,
  },
  floatingButtonWrapper: {
    top: -hp(2.6),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 12,
  },
  floatingButtonWrapperActive: {
    zIndex: 1001,
    elevation: 30,
  },
  floatingImage: {
    width: wp(22),
    height: wp(22),
    width: wp(22),
    height: wp(22),
  },
});

export default CustomBottomTab;
