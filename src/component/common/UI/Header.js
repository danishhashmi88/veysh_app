import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { imagePath } from '../../../constant/imagePath';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import { hp, wp, safeGoBack } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { useTheme } from '../../../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = ({
  showLeftButton = false,
  leftIcon = imagePath.arrow_left,
  onLeftButtonPress,
  leftComponent,
  title,
  centerComponent,
  showRightButton = false,
  rightIcon = imagePath.eye,
  onRightButtonPress = () => {},
  rightIconStyle = {},
  rightComponent,
  backgroundColor,
  leftButtonBgColor,
  headerTextStyle = {},
  containerStyle = {},
  safeAreaEdges = ['top', 'left', 'right'],
  showBottomBorder = true,
  // ── Search variant props ──
  variant,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [searchOpen, setSearchOpen] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;

  const headerBgColor = backgroundColor || Colors.white;
  const showLeft = !!(leftComponent || showLeftButton);
  const hasCenter = !!(centerComponent || title);

  const toggleSearch = () => {
    const opening = !searchOpen;
    setSearchOpen(opening);
    if (!opening && onSearchChange) onSearchChange('');
    Animated.timing(searchAnim, {
      toValue: opening ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  // ── Default renderLeft (unchanged) ───────────────────────────────────────
  const renderLeft = () => {
    if (leftComponent) return leftComponent;
    if (showLeftButton) {
      return (
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            if (onLeftButtonPress) {
              onLeftButtonPress();
            } else {
              safeGoBack(navigation);
            }
          }}
          style={[
            styles.buttonView,
            { backgroundColor: leftButtonBgColor || Colors.bgGrey },
          ]}
        >
          <Image
            source={leftIcon}
            resizeMode="contain"
            style={styles.miniArrowIcon}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  // ── Default renderCenter (unchanged) ─────────────────────────────────────
  const renderCenter = () => {
    if (centerComponent) return centerComponent;
    return (
      <View style={styles.centerView}>
        {title ? (
          <Text numberOfLines={1} style={[styles.headerText, headerTextStyle]}>
            {title}
          </Text>
        ) : null}
      </View>
    );
  };

  // ── Default renderRight (unchanged) ──────────────────────────────────────
  const renderRight = () => {
    if (rightComponent) return rightComponent;
    if (showRightButton) {
      return (
        <TouchableOpacity
          hitSlop={20}
          onPress={onRightButtonPress}
          style={styles.rightButton}
        >
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={[styles.rightIcon, rightIconStyle]}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.placeholder} />;
  };

  // ── Search variant right component ───────────────────────────────────────
  const renderSearchRight = () => {
    return (
      <View style={styles.searchRightRow}>
        {/* Expanding input — hidden until search opens */}
        <Animated.View
          style={[
            styles.searchInputWrapper,
            {
              width: searchAnim.interpolate({
                inputRange: [0, 1],
               outputRange: [0, wp(78)],
              }),
              opacity: searchAnim,
              marginRight: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, wp(2)],
              }),
            },
          ]}
        >
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={Colors.grey}
            value={searchValue}
            onChangeText={onSearchChange}
            autoFocus={searchOpen}
            returnKeyType="search"
          />
        </Animated.View>

        {/* Toggle button — search icon or ✕ text */}
        <TouchableOpacity
          hitSlop={20}
          onPress={toggleSearch}
          style={styles.buttonView}
        >
          {searchOpen ? (
            <Text style={styles.closeText}>✕</Text>
          ) : (
            <Image
              source={imagePath.search}
              resizeMode="contain"
              style={styles.miniArrowIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ── Search variant full render ────────────────────────────────────────────
  if (variant === 'search') {
    return (
      <SafeAreaView
        edges={safeAreaEdges}
        style={{
          backgroundColor: headerBgColor,
          borderBottomWidth: showBottomBorder ? 1 : 0,
          borderBottomColor: Colors.greyBorder,
        }}
      >
        <View
          style={[
            styles.headerMainView,
            { backgroundColor: 'transparent' },
            containerStyle,
          ]}
        >
          {/* Title — stays on left, fades when search opens */}
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.headerText,
              headerTextStyle,
              {
                flex: 1,
                opacity: searchAnim.interpolate({
                  inputRange: [0, 0.4, 1],
                  outputRange: [1, 0, 0],
                }),
              },
            ]}
          >
            {title}
          </Animated.Text>

          {/* Right side: input + toggle button */}
          {renderSearchRight()}
        </View>
      </SafeAreaView>
    );
  }

  // ── Default variant (completely unchanged) ────────────────────────────────
  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={{
        backgroundColor: headerBgColor,
        borderBottomWidth: showBottomBorder ? 1 : 0,
        borderBottomColor: Colors.greyBorder,
      }}
    >
      <View
        style={[
          styles.headerMainView,
          { backgroundColor: 'transparent' },
          containerStyle,
        ]}
      >
        {showLeft && (
          <View style={[styles.leftContainer, !hasCenter && { flex: 4 }]}>
            {renderLeft()}
          </View>
        )}
        <View
          style={[
            styles.centerContainer,
            !hasCenter && { flex: 0 },
            !showLeft && { marginLeft: 0 },
          ]}
        >
          {renderCenter()}
        </View>
        <View style={styles.rightContainer}>{renderRight()}</View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const getStyles = Colors =>
  StyleSheet.create({
    // ── Default styles (all unchanged) ───────────────────────────────────────
    headerMainView: {
      flexDirection: 'row',
      alignItems: 'center',
      width: wp(100),
      paddingHorizontal: wp(5),
      height: hp(8),
      overflow: 'visible',
    },
    leftContainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    centerContainer: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginLeft: wp(3),
    },
    rightContainer: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      overflow: 'visible',
      zIndex: 2,
    },
    placeholder: {
      width: wp(10),
    },
    buttonView: {
      backgroundColor: Colors.bgGrey,
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      alignItems: 'center',
      justifyContent: 'center',
      padding: wp(2.5),
    },
    rightButton: {
      backgroundColor: Colors.bgGrey,
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      alignItems: 'center',
      justifyContent: 'center',
      padding: wp(2.5),
    },
    miniArrowIcon: {
      width: wp(5),
      height: wp(5),
    },
    rightIcon: {
      width: wp(10),
      height: wp(10),
    },
    headerText: {
      fontFamily: FontFamily.Bold,
      fontSize: FontSize.FONT_26,
      color: Colors.black,
      textAlign: 'left',
    },
    // ── Search variant styles ─────────────────────────────────────────────────
    searchRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInputWrapper: {
      height: wp(10),
      backgroundColor: Colors.bgGrey,
      borderRadius: wp(3),
      overflow: 'hidden',
      justifyContent: 'center',
      paddingHorizontal: wp(3),
    },
    searchInput: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.Regular,
      color: Colors.black,
      padding: 0,
      margin: 0,
    },
    closeText: {
      fontSize: FontSize.FONT_14,
      color: Colors.black,
      fontFamily: FontFamily.Regular,
    },
  });