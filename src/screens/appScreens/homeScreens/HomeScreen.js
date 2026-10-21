import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInLeft, FadeIn } from 'react-native-reanimated';
import { useNavigation, useIsFocused, useRoute, useFocusEffect } from '@react-navigation/native';
import { getStyles } from './styles';
import { hp, onShareNative, wp, toSafeString } from '../../../utils/helper';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { homeScreenData } from '../../../constant';
import LinearGradient from 'react-native-linear-gradient';
import MyProfile from '../myProfile/MyProfile';
import { useDispatch, useSelector } from 'react-redux';
import { GetUserDetails } from '../../../services/auth.service';
import { addToLookbookApi, ClosetInsights, getNotificationsListApi } from '../../../services/user.service';
import { updateUserData } from '../../../redux/slices/userSlice';
import {
  getOutfitOfTheDay,
  // getWardrobeInsights,
  getTotalSpend,
  getRentItemsList,
} from '../../../redux/thunks/plannerThunk';
import { getData, AUTH_TOKEN_KEY } from '../../../utils/storage';
import { mapBackendUserToFrontend } from '../../../utils/helper';
import MediaPickerModal from '../../../component/common/Modal/MediaPicker';
import VerticalMediaPicker from '../../../component/common/Modal/VerticalMediaPicker';
import MenuDrawer from '../../../component/common/Drawer/MenuDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostsListView from '../../../component/common/UI/PostListView';
import {
  addCommentPost,
  getHomeLatestpost,
  likePost,
} from '../../../redux/thunks/postsThunk';
import CommentModal from '../../../component/common/Modal/CommentModal';
import ShareModal from '../../../component/common/Modal/ShareModal';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import LikesModal from '../../../component/common/Modal/LikesModal';
import { getLikelistapi } from '../../../services/auth.service';
import { IMAGEURL } from '../../../utils/axios';

import Header from '../../../component/common/UI/Header';
import ChatWidgetBanner from '../../../component/common/Home/ChatWidgetBanner';
import HomeNavPills from '../../../component/common/Home/HomeNavPills';
import OutfitOfTheDay from '../../../component/common/Home/OutfitOfTheDay';
import WardrobeInsights from '../../../component/common/Home/WardrobeInsights';
import MyWardrobe from '../../../component/common/Home/MyWardrobe';
import BuyOutfits from '../../../component/common/Home/BuyOutfits';
import { FontSize, FontFamily } from '../../../constant/fonts';
import {
  formatNotificationBadgeCount,
  getUnreadNotificationCount,
} from '../../../utils/notificationUtils';
import {
  PostsSkeleton,
} from '../../../component/common/animations/HomeSkeletons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const Colors = useTheme();
  const isFocused = useIsFocused();
  const styles = getStyles(Colors);
  const [chatText, setChatText] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const dispatch = useDispatch();
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const { latestpostList } = useSelector(state => state.posts);
  const {
    ootdList,
    // wardrobeItems,
    totalSpend,
    averageClosetValue,
    rentOutfits,
    rentItems,
  } = useSelector(state => state.planner);
  console.log("totlat spend iss", totalSpend)
  const [userId, setUserId] = useState(tokenAndId?.userId || '');
  const mediaPickerRef = useRef(null);
  const verticalPickerRef = useRef(null);
  const menuDrawerRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [shareModalvisible, setSharemodalvisible] = useState({
    visible: false,
    postDetail: '',
  });
  const [isLikesVisible, setIsLikesVisible] = useState(false);
  const [likes, setLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [insightData, setInsightData] = useState(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [ootdLoading, setOotdLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const tabToTypeMap = {
    'Most Worn': 'most_worn',
    'Least Worn': 'least_worn',
    'Never Worn': 'never_worn',
  };

  useFocusEffect(
    useCallback(() => {
      fetchOOTD();
      fetchUnreadNotificationCount();
    }, []),
  );

  useEffect(() => {
    if (isFocused) {
      console.log('HomeScreen is focused, fetching data...');
      fetchProfile();
      fetchInsights();
      fetchUnreadNotificationCount();
      dispatch(getRentItemsList());

      // Auto-open Add Item modal if param is present
      if (route.params?.openAddModal) {
        setTimeout(() => {
          verticalPickerRef.current?.open();
          navigation.setParams({ openAddModal: undefined });
        }, 500);
      }
    }
  }, [isFocused, route.params?.openAddModal]);

  useEffect(() => {
    fetchPosts();
  }, [isFocused]);

  useEffect(() => {
    setImageError(false);
  }, [userDetails?.profileImage]);

  const fetchPosts = async () => {
    try {
      await dispatch(getHomeLatestpost());
    } catch (error) {
      console.log('Error fetching posts', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await ClosetInsights();
      if (response && response.data) {
        console.log("response is", response)
        setInsightData(response?.data);
      }
    } catch (error) {
      console.log('Error fetching closet insights:', error);
    }
  };

  const fetchUnreadNotificationCount = async () => {
    try {
      const response = await getNotificationsListApi({ page: 1, limit: 50 });
      setUnreadNotificationCount(getUnreadNotificationCount(response));
    } catch (error) {
      console.log('Error fetching notification count:', error);
    }
  };

  const handleClose = () => {
    setIsCommentVisible(false);
    setIsLikesVisible(false);
    setSelectedPost(null);
    setComments([]);
    setLikes([]);
  };

  const fetchLikes = async postId => {
    try {
      setLoadingLikes(true);
      const values = {
        page: 1,
        limit: 100,
      };
      const res = await getLikelistapi(postId, values);
      if (res?.success) {
        setLikes(res?.data?.likes || []);
      }
    } catch (error) {
      console.log('Error fetching likes', error);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await dispatch(
        addCommentPost({
          postId: selectedPost?._id,
          comment: commentText,
        }),
      ).unwrap();
      setIsCommentVisible(false);
      setCommentText(''); // clear input
    } catch (error) {
      console.log('Comment post failed:', error);
    } finally {
      await fetchPosts();
    }
  };

  const fetchProfile = async () => {
    try {
      const token =
        tokenAndId?.token || (await AsyncStorage.getItem(AUTH_TOKEN_KEY));
      if (userId && token) {
        const res = await GetUserDetails(token, userId);

        if (res?.data) {
          const userObj = res.data.data || res.data.user || res.data;
          const mappedUser = mapBackendUserToFrontend(userObj);
          console.log(mappedUser, 'mappedUser');
          dispatch(updateUserData(mappedUser));
        }
      }
    } catch (error) {
      console.log('Error fetching profile', error);
    }
  };

  const toggleLike = async id => {
    try {
      await dispatch(likePost(id)).unwrap(); // wait till API finishes
    } catch (error) {
      console.log('Error liking post', error);
    }
  };

  const handleBookmark = async post => {

    try {
      console.log('Bookmark Post payload target:', post);
      const formData = new FormData();
      formData.append('type', 'post');
      formData.append('post_id', post?._id || '');
      formData.append('isLookbook', post?.isLookBook ? false : true);
      console.log("formData", formData)
      const res = await addToLookbookApi(formData);
      console.log("res", res)
      if (res?.success) {
        showSuccessToast(
          res?.message?.replace('Item', 'Post') || 'Post added to lookbook',
        );
        fetchPosts();
      } else {
        showDangerToast(res?.message || 'Failed to add post to lookbook');
      }
    } catch (error) {
      console.log('Error bookmarking post:', error);
      showDangerToast('Something went wrong');
    }
  };

  const closeShareModal = () => {
    setSharemodalvisible({
      visible: false,
      postDetail: '',
    });
  };

  const fetchOOTD = () => {
    dispatch(getOutfitOfTheDay()).finally(() => setOotdLoading(false));
  };
  // const fetchWardrobe = type => {
  //   console.log('Dispatching getWardrobeInsights with type:', type);
  //   const payload = {
  //     type: type || 'most_worn',
  //   };
  //   dispatch(getWardrobeInsights(payload));
  // };
  const fetchTotalSpend = () => {
    console.log('tootaal');
    dispatch(getTotalSpend());
  };

  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  const data = homeScreenData;
  const [activeTab, setActiveTab] = useState(
    data?.wardrobeInsights?.tabs?.[0] || 'Most Worn',
  );

  // useEffect(() => {
  // }, [wardrobeItems]);

  const handleSelectedMedia = media => {
    if (media.path || media.uri) {
      navigation.navigate('ImagePreview', {
        imageUri: media.path || media.uri,
        mediaType: media.mime,
      });
    }
  };

  const handleNavigation = (screenName, params) => {
    // console.log(`Navigating to: ${screenName}`, params);

    if (screenName === 'AddItem') {
      verticalPickerRef.current?.open();
      return;
    }

    navigation.navigate(screenName, params);
  };

  if (!data) return <View style={{ flex: 1, backgroundColor: Colors.white }} />;

  const renderLatestPosts = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.wardrobeHeader}>
        <Text style={styles.sectionTitle}>Latest Posts</Text>
        <TouchableOpacity
          onPress={() => handleNavigation('SocialCommunityScreen')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={styles.changeText}>View All</Text>
          <Image
            source={imagePath.chevronDown}
            style={[
              styles.headerChevron,
              { transform: [{ rotate: '270deg' }] },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {postsLoading && (!latestpostList || latestpostList.length === 0) ? (
        <PostsSkeleton count={2} />
      ) : (
      <PostsListView
        posts={latestpostList || []}
        userId={userDetails?._id}
        latestPost={true}
        scrollEnabled={false}
        onPressPost={post =>
          handleNavigation('SocialCommunityScreen', { postId: post._id })
        }
        onBookmark={post => handleBookmark(post)}
        onLike={post => toggleLike(post._id)}
        onComment={post => {
          setSelectedPost(post);
          setComments(post?.comments);
          setIsCommentVisible(true);
        }}
        onLikeLongPress={post => {
          setSelectedPost(post);
          fetchLikes(post._id);
          setIsLikesVisible(true);
        }}
        onMorePress={post => {
          if (post?.createdBy?._id == userDetails?._id) {
            console.log('ownUser');
            return;
          }
          setShowOptions(true);
          setSelectedPost(post);
        }}
        style={styles}
        onUserpress={post => {
          navigation.navigate('UserProfile', { item: post?.createdBy });
        }}
      />
      )}

      <LikesModal
        visible={isLikesVisible}
        onClose={handleClose}
        likes={likes}
        loadingLikes={loadingLikes}
      />
    </View>
  );

  const wardrobeItemsToShow =
    activeTab === 'Most Worn'
      ? insightData?.mostWornItems
      : activeTab === 'Least Worn'
        ? insightData?.leastWornItems
        : insightData?.neverWornItems;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Header
        backgroundColor={Colors.white}
        showBottomBorder={true}
        containerStyle={{ overflow: 'visible' }}
        leftComponent={
          <Animated.Text
            entering={FadeInLeft.duration(500).springify().damping(16)}
            numberOfLines={1}
            style={{
              fontSize: FontSize.FONT_26,
              fontFamily: FontFamily.Bold,
              color: Colors.black,
              flexShrink: 1,
            }}
          >
            Hello {toSafeString(userDetails?.first_name) || 'Guest'}
          </Animated.Text>
        }
        rightComponent={
          <Animated.View
            entering={FadeIn.duration(600).delay(150)}
            style={styles.headerIcons}
          >
            <TouchableOpacity
              style={styles.headerIconCircle}
              onPress={() => handleNavigation('Notifications')}
            >
              <Image
                source={imagePath.bell}
                style={styles.headerIconImage}
                resizeMode="contain"
              />
              {unreadNotificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {formatNotificationBadgeCount(unreadNotificationCount)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconCircle}
              onPress={() => menuDrawerRef.current?.open()}
            >
              <Image
                source={imagePath.menu}
                style={styles.headerIconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarCircle}
              onPress={() => navigation.navigate('MyProfile')}
            >
              <Image
                source={
                  userDetails?.profile_image
                    ? { uri: userDetails?.profile_image }
                    : imagePath.profileDefault // data?.header?.profile
                }
                style={styles.avatarIcon}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            </TouchableOpacity>
          </Animated.View>
        }
      />

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <Animated.View entering={FadeInDown.duration(500).delay(80).springify().damping(16)}>
            <ChatWidgetBanner
              styles={styles}
              handleNavigation={handleNavigation}
              chatText={chatText}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(160).springify().damping(16)}>
            <HomeNavPills styles={styles} handleNavigation={handleNavigation} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(240).springify().damping(16)}>
            <OutfitOfTheDay
              styles={styles}
              ootdList={ootdList}
              loading={ootdLoading}
              handleNavigation={handleNavigation}
              IMAGEURL={IMAGEURL}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(320).springify().damping(16)}>
            <WardrobeInsights
              styles={styles}
              handleNavigation={handleNavigation}
              totalSpend={totalSpend}
              // wardrobeItems={wardrobeItems}
              Colors={Colors}
              averageClosetValue={averageClosetValue}
              insightData={insightData}
              loading={insightData === null}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(400).springify().damping(16)}>
            <MyWardrobe
              styles={styles}
              data={data}
              handleNavigation={handleNavigation}
              activeTab={activeTab}
              handleTabPress={handleTabPress}
              wardrobeItems={wardrobeItemsToShow}
              loading={insightData === null}
              IMAGEURL={IMAGEURL}
              totalItems={userDetails?.itemsCount || 0} // Added totalItems
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(480).springify().damping(16)}>
            {renderLatestPosts()}
          </Animated.View>
          {/* <BuyOutfits
            styles={styles}
            data={[...(rentItems || []), ...(rentOutfits || [])]}
            handleNavigation={handleNavigation}
            IMAGEURL={IMAGEURL}
          /> */}
        </ScrollView>
      </View>

      <MediaPickerModal
        ref={mediaPickerRef}
        handleSelectedMedia={handleSelectedMedia}
      />

      <VerticalMediaPicker
        ref={verticalPickerRef}
        handleSelectedMedia={handleSelectedMedia}
      />

      <MenuDrawer
        ref={menuDrawerRef}
        userDetails={userDetails}
        onNavigate={screen => navigation.navigate(screen)}
        onMyPostsPress={() => navigation.navigate('PostsList')}
        onToggleTheme={setIsLightTheme}
        isLightTheme={isLightTheme}
      />

      <CommentModal
        visible={isCommentVisible}
        onClose={handleClose}
        comments={comments}
        loadingComments={loadingComments}
        commentText={commentText}
        setCommentText={setCommentText}
        handleSendComment={handleSendComment}
        userDetails={userDetails}
        canComment={
          selectedPost?.createdBy?._id === userDetails?._id ||
          !selectedPost?.turnOffComments
        }
      />

      <ShareModal
        visible={shareModalvisible?.visible}
        postDetail={shareModalvisible?.postDetail}
        onClose={closeShareModal}
      />
    </View>
  );
};

export default HomeScreen;
