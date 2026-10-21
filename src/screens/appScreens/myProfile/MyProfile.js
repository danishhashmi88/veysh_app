import React, { useCallback } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { GetUserDetails } from '../../../services/auth.service';
import { updateUserData } from '../../../redux/slices/userSlice';
import { getProfileCompletionApi } from '../../../services/user.service';
import LinearGradient from 'react-native-linear-gradient';
import { getStyles } from './styles';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { wp, mapBackendUserToFrontend, hp, toSafeString } from '../../../utils/helper';
import { showDangerToast } from '../../../utils/toast';
import { profileData } from '../../../constant';
import Header from '../../../component/common/UI/Header';
import Svg, { Circle, G } from 'react-native-svg';
import {
  colorPalette,
  colorPaletteEye,
  colorPaletteBrand,
} from '../../../constant';
import { FontSize } from '../../../constant/fonts';
import FullScreenImageModal from '../../../component/common/Modal/FullScreenImageModal';

const LIGHT_COLOR_NAMES = ['white', 'cream', 'ivory', 'beige', 'platinum'];

const getPreferredColorSwatch = colorName => {
  const normalized = String(colorName || '').trim().toLowerCase();
  const matched = colorPaletteBrand.find(
    c => c.name.toLowerCase() === normalized,
  );
  if (matched) {
    return {
      backgroundColor: matched.colorCode,
      needsBorder: matched.showBorder,
    };
  }
  const isLight =
    LIGHT_COLOR_NAMES.includes(normalized) ||
    normalized === '#ffffff' ||
    normalized === '#fff';
  return {
    backgroundColor: normalized.startsWith('#') ? normalized : normalized,
    needsBorder: isLight,
  };
};

const CircularProgress = ({
  size,
  strokeWidth,
  progress,
  color,
  trackColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
  const svgProgress = 100 - progress;
  const halfSize = size / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" originX={halfSize} originY={halfSize}>
          <Circle
            stroke={trackColor}
            fill="none"
            cx={halfSize}
            cy={halfSize}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={color}
            fill="none"
            cx={halfSize}
            cy={halfSize}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circum} ${circum}`}
            strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

// import EditMyStyle from '../editMyStyle/EditMyStyle';

// Returns true only if the value is a non-empty, non-null, non-N/A string / array
const hasValue = val => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'object') {
    return Array.isArray(val) && val.length > 0;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim().toLowerCase();
    return (
      trimmed.length > 0 &&
      trimmed !== 'n/a' &&
      trimmed !== 'null' &&
      trimmed !== 'undefined'
    );
  }
  return !!val;
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const [imageError, setImageError] = React.useState(false);
  const [completionData, setCompletionData] = React.useState(null);
  const [fullScreenImage, setFullScreenImage] = React.useState(null);

  console.log('MyProfile: userDetails keys:', Object.keys(userDetails || {}));

  React.useEffect(() => {
    setImageError(false);
  }, [userDetails?.profileImage]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, []),
  );

  const fetchUserData = async () => {
    try {
      if (tokenAndId?.token && tokenAndId?.userId) {
        const response = await GetUserDetails(
          tokenAndId?.token,
          tokenAndId?.userId,
        );
        if (response?.data) {
          const userData =
            response?.data?.user || response?.data?.data || response?.data;
          const mappedUser = mapBackendUserToFrontend(userData);
          dispatch(updateUserData(mappedUser));
        }
      }
    } catch (error) {
      console.log('MyProfile Fetch Error', error);
      showDangerToast('Failed to load profile data');
    }

    try {
      const compRes = await getProfileCompletionApi();
      if (compRes?.success) {
        setCompletionData(compRes.data);
      }
    } catch (err) {
      console.log('Profile completion error', err);
    }
  };

  const renderProfileHeader = () => {
    const completeness = completionData?.profile_completion_percentage || 0;
    return (
      <View style={{ marginBottom: hp(2), marginTop: hp(2) }}>
        <View style={[styles.completenessCard, { overflow: 'hidden' }]}>
          <LinearGradient
            colors={['#F116A5', '#7100D7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <View style={styles.completenessTitleBox}>
            <Text style={styles.completenessTitle}>Profile Completeness</Text>
            <Text
              style={[
                styles.completenessSubtitle,
                { fontSize: 13, marginTop: 4 },
              ]}
            >
              Complete your details
            </Text>
          </View>
          <View style={styles.progressCircleWrapper}>
            <CircularProgress
              size={wp(14)}
              strokeWidth={wp(1)}
              progress={completeness}
              color="#FF9500"
              trackColor="rgba(255,255,255,0.2)"
            />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>{completeness}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsColumn}>
            <Text style={styles.statValue}>{userDetails?.itemsCount || 0}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsColumn}>
            <Text style={styles.statValue}>{userDetails?.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsColumn}>
            <Text style={styles.statValue}>{userDetails?.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStylist = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.stylistCard}>
        <Text style={styles.stylistTitle}>My Stylist</Text>

        <View style={styles.stylistRow}>
          <View style={styles.stylistInfo}>
            <Image
              source={profileData.stylist.image}
              style={styles.stylistAvatar}
            />
            <Text style={styles.stylistName}>{profileData.stylist.name}</Text>
          </View>

          <TouchableOpacity style={styles.chatBtn}>
            <Image
              source={imagePath.ic_chat || imagePath.message}
              style={styles.chatIcon}
              tintColor={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderInfoSection = () => (
    <View style={styles.cardContainer}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Image
            source={imagePath.pencil || imagePath.menu}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>

      {Object.entries({
        'Phone:': userDetails?.phone || userDetails?.phone_number,
        'DOB:':
          userDetails?.dob || userDetails?.DOB
            ? moment(userDetails.dob || userDetails.DOB).format('DD/MM/YYYY')
            : null,
        'Gender:': userDetails?.gender,
        'Location:': userDetails?.location || userDetails?.address,
      }).filter(([, val]) => hasValue(val)).length > 0 ||
        hasValue(userDetails?.goals) ||
        hasValue(userDetails?.bio || userDetails?.short_bio || userDetails?.long_bio) ? (
        <>
          {Object.entries({
            'Phone:': userDetails?.phone || userDetails?.phone_number,
            'DOB:':
              userDetails?.dob || userDetails?.DOB
                ? moment(userDetails.dob || userDetails.DOB).format('DD/MM/YYYY')
                : null,
            'Gender:': userDetails?.gender,
            'Location:': userDetails?.location || userDetails?.address,
          })
            .filter(([, val]) => hasValue(val))
            .map(([key, val]) => (
              <View
                key={key}
                style={{
                  paddingVertical: hp(1.2),
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.dividerBg,
                }}
              >
                <View style={[styles.infoRow, { marginVertical: 0 }]}>
                  <Text style={styles.infoLabel}>{key}</Text>
                  <Text style={styles.infoValue}>{toSafeString(val)}</Text>
                </View>
              </View>
            ))}

          {hasValue(userDetails?.goals) && (
            <View
              style={{
                paddingVertical: hp(1.2),
                borderBottomWidth: 1,
                borderBottomColor: Colors.dividerBg,
              }}
            >
              <Text style={styles.infoLabel}>Goals on the app:</Text>
              <Text style={[styles.infoValueDark, { marginTop: hp(0.5) }]}>
                {userDetails.goals.join(', ')}
              </Text>
            </View>
          )}

          {hasValue(
            userDetails?.bio || userDetails?.short_bio || userDetails?.long_bio,
          ) && (
              <View style={{ paddingTop: hp(1.2) }}>
                <Text style={styles.infoLabel}>Bio:</Text>
                <Text style={styles.bioText}>
                  {toSafeString(
                    userDetails?.bio ||
                      userDetails?.short_bio ||
                      userDetails?.long_bio,
                  )}
                </Text>
              </View>
            )}
        </>
      ) : (
        <Text style={styles.noDataText}>No data found</Text>
      )}
    </View>
  );

  const renderStylePreferences = () => {
    // 1. Extract Data from Redux userDetails
    const colors = userDetails?.preferred_colors || [];
    const brands = userDetails?.brands || [];
    const sizesObj = userDetails?.sizes || {};
    const measureObj = userDetails?.measurements || {};
    const dislikes = userDetails?.dislikes || 'N/A';
    const bodyImages =
      userDetails?.bodyImages || userDetails?.full_body_image || [];

    // 2. Standardized Size Display List
    const displaySizes = [
      {
        key: 'shirt_size',
        label: 'Shirt',
        icon: imagePath.shirtIcon || imagePath.Shirticon,
        val: sizesObj.shirt_size || sizesObj.shirtSize || 'N/A',
      },
      {
        key: 'trouser_size',
        label: 'Trouser',
        icon: imagePath.TrouserIcon || imagePath.jeans_img,
        val: sizesObj.trouser_size || sizesObj.trouserSize || 'N/A',
      },
      {
        key: 'shoe_size',
        label: 'Shoes',
        icon: imagePath.shoeIcon || imagePath.shoes,
        val: sizesObj.shoe_size || sizesObj.shoeSize || 'N/A',
      },
      {
        key: 'wrist_size',
        label: 'Wrist',
        icon: imagePath.WristIcon,
        val: sizesObj.wrist_size || sizesObj.wristSize || 'N/A',
      },
    ];

    // 3. Prepare Body Details Array (Matches your UI loop structure)
    const getValidColor = (colorStr, label) => {
      if (!colorStr || colorStr.toLowerCase() === 'n/a') return null;
      const palette = label === 'Eye Color' ? colorPaletteEye : colorPalette;
      const matched = palette.find(
        c => c.name.toLowerCase() === colorStr.toLowerCase(),
      );
      if (matched) {
        return {
          backgroundColor: matched.colorCode,
          needsBorder: matched.showBorder,
        };
      }

      // Fallback for legacy names
      const hairLegacy = {
        red: '#0A0A0A',
        blue: '#3D2314',
        green: '#D4A76A',
        black: '#E5E4E2',
        white: '#A52A2A',
        pink: '#B2BEB5',
      };
      const eyeLegacy = {
        red: '#383838',
        blue: '#5A292C',
        green: '#4868B5',
        black: '#B4A250',
        white: '#8B7466',
        pink: '#49865D',
        purple: '#6A7F84',
      };
      const legacy = label === 'Eye Color' ? eyeLegacy : hairLegacy;
      const backgroundColor =
        legacy[colorStr.toLowerCase()] || colorStr.toLowerCase();
      return { backgroundColor, needsBorder: false };
    };

    const bodyDetails = [
      { label: 'Body Type', val: userDetails?.bodyType || 'N/A' },
      {
        label: 'Hair Color',
        val: userDetails?.hairColor || 'N/A',
        colorDot: getValidColor(userDetails?.hairColor, 'Hair Color'),
      },
      { label: 'Hair Type', val: userDetails?.hairType || 'N/A' },
      {
        label: 'Eye Color',
        val: userDetails?.eyeColor || 'N/A',
        colorDot: getValidColor(userDetails?.eyeColor, 'Eye Color'),
      },
      { label: 'Face Shape', val: userDetails?.faceShape || 'N/A' },
      { label: 'Complexion', val: userDetails?.complexion || 'N/A' },
    ];

    return (
      <View style={styles.cardContainer}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Style Preferences</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditStylePreferance')}
          >
            <Image source={imagePath.pencil} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* --- COLORS --- */}
        <Text style={styles.subLabel}>Colors:</Text>
        <View style={styles.row}>
          {colors.length > 0 ? (
            colors.map((color, index) => {
              const swatch = getPreferredColorSwatch(color);
              return (
                <View
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: swatch.backgroundColor },
                    swatch.needsBorder && styles.colorCircleBordered,
                  ]}
                />
              );
            })
          ) : (
            <Text style={styles.infoValue}>No colors added</Text>
          )}
        </View>

        {/* --- BRANDS --- */}
        <Text style={styles.subLabel}>Favorite Designers / Brands:</Text>
        <View style={styles.row}>
          {brands.length > 0 ? (
            brands.map((brand, index) => (
              <View key={index} style={styles.brandChip}>
                <Text style={styles.brandText}>{brand}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.infoValue}>No brands added</Text>
          )}
        </View>

        {/* --- SIZES --- */}
        {displaySizes.some(item => hasValue(item.val)) && (
          <>
            <Text style={styles.subLabel}>Sizes</Text>
            <View style={styles.sizesContainer}>
              {displaySizes
                .filter(item => hasValue(item.val))
                .map((item, index) => (
                  <View key={index} style={styles.sizeColumn}>
                    <Text style={styles.sizeValue}>{item.val}</Text>
                    <Text style={styles.sizeLabel}>{item.label}</Text>
                  </View>
                ))}
            </View>
          </>
        )}

        {/* --- MEASUREMENTS --- */}
        {Object.entries(measureObj).filter(
          ([key, val]) =>
            hasValue(String(val ?? '')) &&
            !['inseam', 'hip'].includes(key.toLowerCase()),
        ).length > 0 && (
            <>
              <Text style={styles.subLabel}>Measurements/in</Text>
              <View style={styles.gridContainer}>
                {Object.entries(measureObj)
                  .filter(
                    ([key, val]) =>
                      hasValue(String(val ?? '')) &&
                      !['inseam', 'hip'].includes(key.toLowerCase()),
                  )
                  .map(([key, val], index) => (
                    <View key={index} style={styles.measureBox}>
                      <Text numberOfLines={1} style={styles.measureLabel}>
                        {key.replace(/_/g, ' ')}
                      </Text>
                      <Text style={styles.measureValue}>{val}</Text>
                    </View>
                  ))}
              </View>
            </>
          )}

        {/* --- BODY DETAILS (Loop) --- */}
        {bodyDetails
          .filter(item => hasValue(item.val))
          .map((item, index) => (
            <View
              key={index}
              style={{
                paddingVertical: hp(1.2),
                borderBottomWidth: 1,
                borderBottomColor: Colors.dividerBg,
              }}
            >
              <View style={[styles.infoRow, { marginVertical: 0 }]}>
                <Text style={styles.infoLabel}>{item.label}:</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  {item.colorDot?.backgroundColor &&
                    item.colorDot.backgroundColor !== 'n/a' &&
                    item.colorDot.backgroundColor !== '' && (
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor: item.colorDot.backgroundColor,
                          },
                          item.colorDot.needsBorder && styles.colorCircleBordered,
                        ]}
                      />
                    )}
                  <Text numberOfLines={1} style={styles.infoValue}>
                    {item.val.charAt(0).toUpperCase() + item.val.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

        {/* --- DISLIKES --- */}
        {hasValue(dislikes) && (
          <View
            style={{
              paddingVertical: hp(1.2),
              borderBottomWidth: 1,
              borderBottomColor: Colors.dividerBg,
              marginBottom: hp(1),
            }}
          >
            <Text style={[styles.subLabel, { marginBottom: 5 }]}>
              Dislikes:
            </Text>
            <Text style={[styles.infoValueDark, { marginTop: 0 }]}>
              {dislikes}
            </Text>
          </View>
        )}

        {/* --- FULL BODY PHOTO --- */}
        <Text style={[styles.subLabel, { marginTop: 5 }]}>Full Body Photo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosRow}
          contentContainerStyle={{ paddingRight: wp(2) }}
        >
          {bodyImages.length > 0 ? (
            bodyImages.map((imgUrl, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => setFullScreenImage(imgUrl)}
              >
                <Image
                  source={{ uri: imgUrl }}
                  style={styles.bodyPhoto}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.infoValue}>No photos uploaded</Text>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderMyStyle = () => (
    <View style={styles.cardContainer}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>My Style</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditMyStyle')}>
          <Image source={imagePath.pencil} style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {hasValue(userDetails?.style) ||
        hasValue(userDetails?.moodboard) ||
        hasValue(userDetails?.sustainablityPreference) ||
        hasValue(userDetails?.styleDesc) ||
        hasValue(userDetails?.pinterestLink) ||
        hasValue(userDetails?.brands) ||
        hasValue(userDetails?.marketPlace) ? (
        <>
          {Object.entries({
            'Style:': userDetails?.style,
            'Moodboard:': userDetails?.moodboard,
            'Sustainability Preferences:': userDetails?.sustainablityPreference,
          })
            .filter(([, val]) =>
              hasValue(Array.isArray(val) ? val.join(', ') : val),
            )
            .map(([key, val]) => (
              <View
                key={key}
                style={{
                  paddingVertical: hp(1.2),
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.dividerBg,
                }}
              >
                <Text style={styles.infoLabel}>{key}</Text>
                <Text style={[styles.infoValueDark, { marginTop: hp(0.5) }]}>
                  {Array.isArray(val) ? val.join(', ') : val}
                </Text>
              </View>
            ))}

          {hasValue(userDetails?.styleDesc) && (
            <View
              style={{
                paddingVertical: hp(1.2),
                borderBottomWidth: 1,
                borderBottomColor: Colors.dividerBg,
              }}
            >
              <Text style={styles.infoLabel}>Style Icons:</Text>
              <Text style={[styles.infoValueDark, { marginTop: hp(0.5) }]}>
                {userDetails.styleDesc}
              </Text>
            </View>
          )}

          {hasValue(userDetails?.pinterestLink) && (
            <View
              style={{
                paddingVertical: hp(1.2),
                borderBottomWidth: 1,
                borderBottomColor: Colors.dividerBg,
              }}
            >
              <Text style={styles.infoLabel}>Pinterest link:</Text>
              <Text style={[styles.infoValueDark, { marginTop: hp(0.5) }]}>
                {userDetails.pinterestLink}
              </Text>
            </View>
          )}

          {hasValue(
            Array.isArray(userDetails?.brands) && userDetails.brands.length > 0
              ? userDetails.brands.join(', ')
              : Array.isArray(userDetails?.marketPlace) &&
                userDetails.marketPlace.length > 0
                ? userDetails.marketPlace.join(', ')
                : null,
          ) && (
              <View style={{ paddingTop: hp(1.2) }}>
                <Text style={styles.infoLabel}>Preferred brands/marketplaces:</Text>
                <Text style={[styles.infoValueDark, { marginTop: hp(0.5) }]}>
                  {Array.isArray(userDetails?.brands) && userDetails.brands.length > 0
                    ? userDetails.brands.join(', ')
                    : userDetails.marketPlace.join(', ')}
                </Text>
              </View>
            )}
        </>
      ) : (
        <Text style={styles.noDataText}>No data found</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="My Profile"
        backgroundColor={Colors.white}
      />
      <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderProfileHeader()}
          {/* {renderStylist()} */}
          {renderInfoSection()}
          {renderStylePreferences()}
          {renderMyStyle()}
        </ScrollView>
      </View>
      <FullScreenImageModal
        visible={!!fullScreenImage}
        imageUri={fullScreenImage}
        onClose={() => setFullScreenImage(null)}
      />
    </View>
  );
};

export default ProfileScreen;
