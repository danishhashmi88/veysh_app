import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,

  TouchableOpacity,
  StatusBar,
  ImageBackground,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestPosts } from '../../../redux/thunks/socialCommunityThunk';
import { addCommentPost, likePost } from '../../../redux/thunks/postsThunk';
import { hp, wp, normalizeCreatedBy, onShareNative } from '../../../utils/helper';
import { AUTH_TOKEN_KEY, getData } from '../../../utils/storage';
import { imagePath } from '../../../constant/imagePath';
import {
  getCommentPostapi,
  getLikelistapi,
} from '../../../services/auth.service';
import CommentModal from '../../../component/common/Modal/CommentModal';
import LikesModal from '../../../component/common/Modal/LikesModal';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { BlurView } from '@danielsaraldi/react-native-blur-view';
import ImageCarousel from '../../../component/common/Modal/ImageCarousel';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePreview from '../../../component/common/Image/ImagePreview';
import { blockUserapi } from '../../../services/user.service';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { addToLookbookApi } from '../../../services/user.service';
import Header from '../../../component/common/UI/Header';
import { IMAGEURL } from '../../../utils/axios';
import { Colors } from '../../../constant/colors';
import AppButton from '../../../component/common/Buttons/AppButton';

// import { likePost } from '../../../redux/thunks/postsThunk';
// import { hp, wp } from '../../../utils/helper';

// const { height } = Dimensions.get('window');

// Assets

const profileImg = require('../../../assets/images/Rishita.png');
const postImg = require('../../../assets/images/PostImage.png');
const likeIcon = require('../../../assets/images/heart.png');
const commentIcon = require('../../../assets/images/message_circle.png');
const shareIcon = require('../../../assets/images/share_.png');
const bookmarkIcon = require('../../../assets/images/lookbookHome.png');
const moreIcon = require('../../../assets/images/dotss.png');
const blockIcon = require('../../../assets/images/ban1.png');
const reportIcon = require('../../../assets/images/alertTriangle.png');

const SocialPostItem = React.memo(
  ({
    item,
    windowHeight,
    windowWidth,
    toggleLike,
    toggleSave,
    setSelectedPost,
    fetchComments,
    setIsCommentVisible,
    setShowOptions,
    profileImg,
    likeIcon,
    commentIcon,
    shareIcon,
    bookmarkIcon,
    moreIcon,
    isParentVisible,
    onShareNative,
    navigation,
    onLikeLongPress,
    userId,
  }) => {
    const author = normalizeCreatedBy(item?.createdBy);
    const isOwner = userId && String(author?._id) === String(userId);
    const showLikesCount = isOwner || !item?.hideLikes;
    const showCommentsCount = isOwner || !item?.hideComments;
    const canComment = isOwner || !item?.turnOffComments;
    const isLikedByUser =
      item?.isLiked === true ||
      item?.liked === true ||
      (userId && item?.likes?.some(id => String(id) === String(userId)));

    return (
      <View
        style={{
          height: windowHeight,
          width: windowWidth,
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: windowHeight,
            width: windowWidth,
            overflow: 'hidden',
            backgroundColor: Colors.black,
          }}
        >
          <ImageCarousel
            images={item.images || []}
            videos={item.videos || []}
            thumbnail={item.thumbnail}
            height={windowHeight}
            width={windowWidth}
            showDots={true}
            isParentVisible={isParentVisible}
            socialCommunity={true}
          />

          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
            locations={[0, 0.6, 1]}
            style={styles.gradient}
            pointerEvents="box-none"
          >
            <View style={styles.contentContainer}>
              {/* LEFT */}
              <View style={styles.leftColumn}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserProfile', {
                      item: author,
                    });
                  }}
                  style={styles.userInfoRow}
                >
                  <ImagePreview
                    image={author?.profile_image}
                    style={styles.profileImage}
                  />
                  <Text style={styles.userName}>
                    {author?.username || 'Anonymous'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.caption}>{item.caption}</Text>
                {item.tags && item.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {item.tags.map((tag, i) => (
                      <View key={i} style={styles.tagBadge}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.timeText}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.rightColumn}>
                <TouchableOpacity
                  style={[styles.actionButton, { marginBottom: 16 }]}
                  onPress={() => toggleLike(item._id)}
                  onLongPress={() => onLikeLongPress && onLikeLongPress(item)}
                  delayLongPress={800}
                >
                  <View style={styles.iconCircle}>
                    <BlurView
                      style={[styles.blurView, { zIndex: 0 }]}
                      blurType="dark"
                      blurAmount={20}
                      reducedTransparencyFallbackColor="transparent"
                    />
                    <Image
                      source={isLikedByUser ? imagePath.heartRed : likeIcon}
                      style={[
                        styles.icon,
                        {
                          tintColor: isLikedByUser ? null : Colors.white,
                        },
                      ]}
                    />
                  </View>
                  {showLikesCount && (
                    <Text style={styles.actionText}>{item.likesCount}</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { marginBottom: 16 }]}
                  onPress={() => {
                    setSelectedPost(item);
                    fetchComments(item._id);
                    setIsCommentVisible(true);
                  }}
                >
                  <View style={styles.iconCircle}>
                    <BlurView
                      style={[styles.blurView, { zIndex: 0 }]}
                      blurType="dark"
                      blurAmount={20}
                      reducedTransparencyFallbackColor="transparent"
                    />
                    <Image
                      source={commentIcon}
                      style={[styles.icon, { tintColor: Colors.white }]}
                    />
                  </View>
                  {showCommentsCount && (
                    <Text style={styles.actionText}>{item.commentsCount}</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { marginBottom: 16 }]}
                  onPress={() => onShareNative(item)}
                >
                  <View style={styles.iconCircle}>
                    <BlurView
                      style={[styles.blurView, { zIndex: 0 }]}
                      blurType="dark"
                      blurAmount={20}
                      reducedTransparencyFallbackColor="transparent"
                    />
                    <Image
                      source={shareIcon}
                      style={[styles.icon, { tintColor: Colors.white }]}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { marginBottom: 16 }]}
                  onPress={() => toggleSave(item)}
                >
                  <View style={styles.iconCircle}>
                    <BlurView
                      style={[styles.blurView, { zIndex: 0 }]}
                      blurType="dark"
                      blurAmount={20}
                      reducedTransparencyFallbackColor="transparent"
                    />
                    <Image
                      source={bookmarkIcon}
                      style={[
                        styles.icon,
                        {
                          tintColor:
                            item.isSaved || item.isInLookbook || item.isLookbook
                              ? Colors.themeColor
                              : Colors.white,
                        },
                        (item.isSaved || item.isInLookbook || item.isLookbook) && styles.savedIcon,
                      ]}
                    />
                  </View>
                </TouchableOpacity>

                {!isOwner && (
                  <TouchableOpacity
                    style={[styles.actionButton]}
                    onPress={() => {
                      setShowOptions(true);
                      setSelectedPost(item);
                    }}
                  >
                    <View style={styles.iconCircle}>
                      <BlurView
                        style={[styles.blurView, { zIndex: 0 }]}
                        blurType="dark"
                        blurAmount={20}
                        reducedTransparencyFallbackColor="transparent"
                      />
                      <Image
                        source={moreIcon}
                        style={[styles.icon, { tintColor: Colors.white }]}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  },
);

const SocialCommunity = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { postId, profilePosts, initialPost } = route.params || {};
  const { userDetails } = useSelector(state => state.user);
  const flatListRef = useRef(null);
  const currentScrollIndexRef = useRef(0);
  const hasScrolledToInitialPostRef = useRef(false);
  const pendingScrollRestoreRef = useRef(null);
  const { postsList, loading, error, totalRecords } = useSelector(
    state => state.socialCommunity,
  );
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const screenHeight = Dimensions.get('screen').height;
  const ITEM_HEIGHT = Platform.OS === 'ios' ? screenHeight : windowHeight;
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [visiblePostIndex, setVisiblePostIndex] = useState(0);
  const [isLikesVisible, setIsLikesVisible] = useState(false);
  const [likes, setLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [overridePosts, setOverridePosts] = useState(null);

  const isViewingProfilePosts = Array.isArray(overridePosts);
  const displayPosts = isViewingProfilePosts ? overridePosts : postsList;

  const isSelectedPostOwner =
    userDetails?._id &&
    String(normalizeCreatedBy(selectedPost?.createdBy)?._id) ===
      String(userDetails._id);

  const onViewableItemsChangedMain = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index ?? 0;
      currentScrollIndexRef.current = index;
      setVisiblePostIndex(index);
    }
  }).current;

  const viewabilityConfigMain = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    hasScrolledToInitialPostRef.current = false;

    if (Array.isArray(profilePosts) && profilePosts.length > 0) {
      setOverridePosts(profilePosts);
      return;
    }

    if (initialPost?._id || initialPost?.id) {
      setOverridePosts([initialPost]);
      return;
    }

    setOverridePosts(null);
  }, [postId, profilePosts, initialPost]);

  useEffect(() => {
    // Profile/post deep-links supply their own list — don't replace with latest feed
    if (Array.isArray(profilePosts) && profilePosts.length > 0) return;
    if (initialPost?._id || initialPost?.id) return;

    const payload = {
      page: 1,
      per_page: 10,
    };
    dispatch(getLatestPosts(payload));
    setPage(1);
  }, [dispatch, profilePosts, initialPost]);

  const loadMorePosts = () => {
    if (isViewingProfilePosts) return;
    if (!loading && !loadingMore && postsList.length < totalRecords) {
      setLoadingMore(true);
      const nextPage = page + 1;
      const payload = {
        page: nextPage,
        per_page: 10,
      };
      dispatch(getLatestPosts(payload)).then(() => {
        setPage(nextPage);
        setLoadingMore(false);
      }).catch(() => {
        setLoadingMore(false);
      });
    }
  };

  useEffect(() => {
    if (
      postId &&
      displayPosts.length > 0 &&
      !hasScrolledToInitialPostRef.current
    ) {
      const index = displayPosts.findIndex(
        p => String(p?._id || p?.id) === String(postId),
      );
      if (index !== -1) {
        hasScrolledToInitialPostRef.current = true;
        currentScrollIndexRef.current = index;
        setVisiblePostIndex(index);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
        }, 100);
      }
    }
  }, [postId, displayPosts]);

  useEffect(() => {
    const restoreIndex = pendingScrollRestoreRef.current;
    if (restoreIndex == null || displayPosts.length === 0) return;

    pendingScrollRestoreRef.current = null;
    const safeIndex = Math.min(restoreIndex, displayPosts.length - 1);
    currentScrollIndexRef.current = safeIndex;
    setVisiblePostIndex(safeIndex);

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index: safeIndex,
        animated: false,
      });
    });
  }, [displayPosts]);

  const fetchComments = React.useCallback(async postId => {
    try {
      setLoadingComments(true);
      const token = await getData(AUTH_TOKEN_KEY);
      const values = {
        page: 1,
        limit: 10,
      };
      if (token) {
        const res = await getCommentPostapi(postId, values);
        if (res?.success) {
          setComments(res?.data?.comments || []);
        }
      }
    } catch (error) {
      console.log('Error fetching comments', error);
    } finally {
      setLoadingComments(false);
    }
  }, []);

  const handleClose = React.useCallback(() => {
    setIsCommentVisible(false);
    setIsLikesVisible(false);
    setSelectedPost(null);
    setComments([]);
    setLikes([]);
  }, []);

  const fetchLikes = React.useCallback(async postId => {
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
  }, []);

  const onBlockpress = async () => {
    const data = {
      page: 1,
      per_page: 10,
    };
    try {
      const payload = {
        user_id: normalizeCreatedBy(selectedPost?.createdBy)?._id,
      };
      console.log('payload is', payload);
      const res = await blockUserapi(payload);
      console.log('res', res);
      if (res?.success) {
        showSuccessToast(res?.message);
        setShowBlockConfirm(false);
        setSelectedPost(null);
      } else {
        showDangerToast(res?.message);
        setShowBlockConfirm(false);
        setSelectedPost(null);
      }
    } catch (error) {
      console.log('Error fetching comments', error);
    } finally {
      dispatch(getLatestPosts(data));
    }
  };

  const toggleLike = React.useCallback(
    async id => {
      pendingScrollRestoreRef.current = currentScrollIndexRef.current;
      try {
        const result = await dispatch(likePost(id)).unwrap();
        setOverridePosts(prev => {
          if (!Array.isArray(prev)) return prev;
          return prev.map(post => {
            if (String(post?._id || post?.id) !== String(id)) return post;
            const nextLiked =
              result?.isLiked ?? !(post?.isLiked || post?.liked);
            return {
              ...post,
              isLiked: nextLiked,
              liked: nextLiked,
              likesCount:
                result?.likesCount ??
                Math.max(
                  0,
                  (post?.likesCount || 0) + (nextLiked ? 1 : -1),
                ),
            };
          });
        });
      } catch (error) {
        pendingScrollRestoreRef.current = null;
        console.error('Error liking post:', error);
      }
    },
    [dispatch],
  );

  const handleSendComment = React.useCallback(async () => {
    if (!commentText.trim()) return;
    try {
      await dispatch(
        addCommentPost({
          postId: selectedPost?._id,
          comment: commentText,
        }),
      ).unwrap();
      await fetchComments(selectedPost?._id);
      setCommentText(''); // clear input
    } catch (error) {
      console.log('Comment post failed:', error);
    } finally {
      const payload = {
        page: 1,
        per_page: 10,
      };
      await dispatch(getLatestPosts(payload));
    }
  }, [dispatch, commentText, selectedPost?._id, fetchComments]);

  const toggleSave = React.useCallback(async post => {
    try {
      const isInLookbook = post?.isInLookbook || post?.isSaved || post?.isLookbook;
      const formData = new FormData();
      formData.append('type', 'post');
      formData.append('post_id', post?._id || '');
      formData.append('isLookbook', !isInLookbook);

      const res = await addToLookbookApi(formData);
      if (res?.success) {
        showSuccessToast(
          res?.message?.replace('Item', 'Post') ||
          (isInLookbook ? 'Post removed from lookbook' : 'Post added to lookbook'),
        );
        const payload = {
          page: 1,
          per_page: 10,
        };
        dispatch(getLatestPosts(payload));
      } else {
        showDangerToast(res?.message || `Failed to ${isInLookbook ? 'remove' : 'add'} post to lookbook`);
      }
    } catch (error) {
      console.log('Error saving post:', error);
      showDangerToast('Something went wrong');
    }
  }, [dispatch]);

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <SocialPostItem
        item={item}
        windowHeight={ITEM_HEIGHT}
        windowWidth={windowWidth}
        toggleLike={toggleLike}
        toggleSave={toggleSave}
        setSelectedPost={setSelectedPost}
        fetchComments={fetchComments}
        setIsCommentVisible={setIsCommentVisible}
        onShareNative={onShareNative}
        setShowOptions={setShowOptions}
        profileImg={profileImg}
        likeIcon={likeIcon}
        commentIcon={commentIcon}
        shareIcon={shareIcon}
        bookmarkIcon={bookmarkIcon}
        moreIcon={moreIcon}
        isParentVisible={visiblePostIndex === index}
        navigation={navigation}
        userId={userDetails?._id}
        onLikeLongPress={post => {
          setSelectedPost(post);
          fetchLikes(post._id);
          setIsLikesVisible(true);
        }}
      />
    ),
    [
      windowHeight,
      windowWidth,
      profileImg,
      likeIcon,
      commentIcon,
      shareIcon,
      bookmarkIcon,
      moreIcon,
      visiblePostIndex,
      onShareNative,
      toggleLike,
      toggleSave,
      fetchComments,
      navigation,
      fetchLikes,
      ITEM_HEIGHT,
      userDetails,
    ],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      {route.name !== 'SocialCommunity' && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <View style={styles.iconCircle}>
            <BlurView
              style={[styles.blurView, { zIndex: 0 }]}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="transparent"
            />
            <Image
              source={imagePath.arrow_left}
              style={[styles.icon, { tintColor: Colors.white }]}
            />
          </View>
        </TouchableOpacity>
      )}
      {/* 
      <TouchableOpacity
        onPress={() => navigation.navigate('SearchUser')}
        style={styles.searchButtonContainer}
      >
        <View style={styles.iconCircle}>
          <BlurView
            style={[styles.blurView, { zIndex: 0 }]}
            blurType="light"
            blurAmount={20}
            reducedTransparencyFallbackColor="transparent"
          />
          <Image
            source={imagePath.search}
            style={[styles.icon, { tintColor: Colors.white }]}
          />
        </View>
      </TouchableOpacity> */}

      {loading && displayPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      ) : error && displayPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={{ color: Colors.white }}>Error: {error}</Text>
        </View>
      ) : (
        <View style={{ height: ITEM_HEIGHT, overflow: 'hidden' }}>
          <FlatList
            ref={flatListRef}
            data={displayPosts}
            keyExtractor={item => String(item._id || item.id)}
            renderItem={renderItem}
            extraData={visiblePostIndex}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="start"
            windowSize={3}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            removeClippedSubviews={false}
            onViewableItemsChanged={onViewableItemsChangedMain}
            viewabilityConfig={viewabilityConfigMain}
            scrollEventThrottle={16}
            directionalLockEnabled={true}
            nestedScrollEnabled={true}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loadingMore ? (
                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={Colors.white} />
                </View>
              ) : null
            }
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>
      )}
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
          normalizeCreatedBy(selectedPost?.createdBy)?._id === userDetails?._id ||
          !selectedPost?.turnOffComments
        }
      />

      <LikesModal
        visible={isLikesVisible}
        onClose={handleClose}
        likes={likes}
        loadingLikes={loadingLikes}
      />

      <Modal visible={showOptions} transparent animationType="slide">
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowOptions(false);
            setSelectedPost(null);
          }}
        />

        <View style={styles.bottomSheet}>
          {!isSelectedPostOwner && (
            <>
              <TouchableOpacity
                onPress={() => {
                  setShowOptions(false);
                  navigation.navigate('ReportPostScreen', {
                    postId: selectedPost?._id,
                  });
                }}
              >
                <View style={styles.actionModalbox}>
                  <Image source={reportIcon} style={styles.commentAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sheetText}>Report</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowOptions(false);
                  setShowBlockConfirm(true);
                }}
              >
                <View style={styles.actionModalbox}>
                  <Image source={blockIcon} style={styles.commentAvatar} />
                  <Text style={[styles.sheetText, styles.blockText]}>Block</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      <Modal visible={showBlockConfirm} transparent animationType="fade">
        <View style={styles.centerOverlay}>
          <View style={styles.blockModal}>
            <View style={styles.blockIcon}>
              <Image
                source={require('../../../assets/images/blockImage.png')}
              />
            </View>

            <Text style={styles.blockTitle}>Block User</Text>
            <Text style={styles.blockSub}>
              Are you sure you want to block this user?
            </Text>

            <View style={styles.blockActions}>
              <TouchableOpacity
                style={styles.noBtn}
                onPress={() => {
                  setShowBlockConfirm(false);
                  setSelectedPost(null);
                }}
              >
                <Text style={styles.noText}>No</Text>
              </TouchableOpacity>

              <AppButton style={styles.yesBtn} onPress={onBlockpress} title="Yes, Block" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SocialCommunity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: hp(45),
    justifyContent: 'flex-end',
    // paddingBottom: hp(1),
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2),
  },
  leftColumn: {
    flex: 1,
    paddingRight: wp(10),
  },
  rightColumn: {
    width: wp(15),
    alignItems: 'center',
    // paddingBottom: 10,
    paddingLeft: wp(7),
    marginBottom: hp(1.2),
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    marginRight: wp(2),
  },
  userName: {
    color: Colors.white,
    fontSize: FontSize.FONT_20,
    fontFamily: FontFamily.OutfitMedium,
  },
  caption: {
    color: Colors.white,
    fontSize: FontSize.FONT_14,
    marginBottom: hp(1.2),
    fontFamily: FontFamily.OutfitMedium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp(1),
  },
  tagBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    borderRadius: wp(1),
    marginRight: wp(1),
    marginBottom: wp(1),
  },
  tagText: {
    color: Colors.white,
    fontSize: FontSize.FONT_12,
  },
  timeText: {
    color: Colors.greyBorder,
    fontSize: FontSize.FONT_12,
    fontFamily: FontFamily.OutfitRegular,
    marginBottom: hp(1),
  },
  actionButton: {
    alignItems: 'center',
  },
  icon: {
    width: wp(5),
    height: wp(5),
  },
  likedIcon: {
    tintColor: Colors.red,
  },
  savedIcon: {
    tintColor: Colors.themeColor,
  },
  actionText: {
    color: Colors.white,
    fontSize: FontSize.FONT_12,
    marginTop: hp(0.1),
    fontFamily: FontFamily.OutfitMedium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  commentModal: {
    position: 'absolute',
    bottom: hp(9),
    width: '100%',
    height: '60%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingHorizontal: wp(5),
    paddingTop: wp(2),
  },

  modalHandle: {
    width: wp(10),
    height: wp(1),
    backgroundColor: '#ccc',
    borderRadius: wp(1),
    alignSelf: 'center',
    marginBottom: wp(2),
  },

  modalTitle: {
    fontSize: FontSize.FONT_18,
    color: Colors.black,
    fontFamily: FontFamily.OutfitMedium,
    marginBottom: wp(5),
  },

  commentRow: {
    flexDirection: 'row',
    marginBottom: wp(2),
    alignItems: 'center',
  },

  commentAvatar: {
    width: wp(6),
    height: wp(6),
    // borderRadius: wp(9),
    marginRight: wp(2),
  },

  commentName: {
    fontSize: FontSize.FONT_13,
    color: Colors.black,
    fontFamily: FontFamily.OutfitMedium,
    marginBottom: wp(1),
  },

  commentText: {
    fontSize: FontSize.FONT_13,
    color: Colors.black,
    fontFamily: FontFamily.OutfitRegular,
  },

  commentTime: {
    fontSize: FontSize.FONT_11,
    color: Colors.black,
    fontFamily: FontFamily.OutfitMedium,
  },

  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    // borderTopWidth: 1,
    // borderTopColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: 10,
  },

  inputAvatar: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(9),
    marginRight: wp(2),
  },

  commentInput: {
    flex: 1,
    height: wp(10),
    backgroundColor: 'red',
    borderRadius: wp(5),
    paddingHorizontal: wp(5),
    fontSize: FontSize.FONT_13,
    color: '#71717A',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    fontFamily: FontFamily.OutfitRegular,
  },

  sendButton: {
    marginLeft: wp(2),
  },

  sendIcon: {
    fontSize: 18,
    color: Colors.themeColor, // purple like your image
  },

  sendBtn: {
    fontSize: 18,
    color: Colors.themeColor,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  optionsModal: {
    position: 'absolute',
    bottom: hp(9),
    left: wp(5),
    right: wp(5),
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    paddingVertical: hp(1),
  },

  optionItem: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },

  optionText: {
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.OutfitMedium,
  },

  centerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  blockModal: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    padding: wp(5),
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },

  blockIcon: {
    marginBottom: hp(1),
  },

  blockTitle: {
    fontSize: FontSize.FONT_18,
    // fontWeight: '600',
    marginTop: hp(1),
    fontFamily: FontFamily.OutfitMedium,
  },

  blockSub: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    marginVertical: hp(1),
    fontFamily: FontFamily.OutfitMedium,
  },

  blockActions: {
    flexDirection: 'row',
    marginTop: hp(2),
  },

  noBtn: {
    paddingVertical: hp(1),
    // paddingHorizontal: 20,
    borderRadius: wp(3),
    backgroundColor: Colors.backGroundColor1,
    marginRight: wp(2),
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.greyBorder,
  },

  yesBtn: {
    paddingVertical: hp(1),
    // paddingHorizontal: 25,
    borderRadius: wp(3),
    backgroundColor: Colors.themeColor,
    width: '48%',
    alignItems: 'center',
  },

  noText: {
    color: Colors.black,
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.OutfitMedium,
  },

  yesText: {
    color: Colors.white,
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.OutfitMedium,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  bottomSheet: {
    position: 'absolute',
    bottom: hp(0),
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingVertical: hp(1),
    paddingBottom: Platform.OS === 'ios' ? hp(3) : hp(1),
  },

  sheetItem: {
    paddingVertical: hp(1),
    alignItems: 'center',
  },

  sheetText: {
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },

  // blockText: {
  //   color: '000',
  // },

  divider: {
    height: 1,
    backgroundColor: Colors.greyBorder,
    marginHorizontal: wp(5),
  },
  actionModalbox: {
    backgroundColor: Colors.greyDark,
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    height: hp(6),
    marginTop: hp(1),
    borderRadius: wp(5),
    paddingLeft: wp(5),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(9),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden', // Essential to clip the BlurView
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(7) : hp(6),
    left: wp(5),
    zIndex: 100,
  },
  backButtonStyle: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(7) : hp(6),
    right: wp(3),
    zIndex: 100,
  },
});
