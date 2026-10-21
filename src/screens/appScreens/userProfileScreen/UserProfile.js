import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import { getStyles } from './styles';
import Back from '../../../component/common/Buttons/Back';
import {
  blockUserapi,
  followUserapi,
  getUserInformation,
  unFollowUserapi,
  addToLookbookApi,
} from '../../../services/user.service';
import ImagePreview from '../../../component/common/Image/ImagePreview';
import { capitalizeFirstLetter } from '../../../constant/functions';
import { hp, wp, normalizeCreatedBy, toSafeString } from '../../../utils/helper';
import { addCommentPost, likePost } from '../../../redux/thunks/postsThunk';
import ShareModal from '../../../component/common/Modal/ShareModal';
import CommentModal from '../../../component/common/Modal/CommentModal';
import PostActionModal from '../../../component/common/Modal/PostActionModal';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import socket from '../../../utils/socket';
import { IMAGEURL } from '../../../utils/axios';
import { imagePath } from '../../../constant/imagePath';
import FullScreenImageModal from '../../../component/common/Modal/FullScreenImageModal';

const UserProfile = () => {
  const Usertabs = ['Posts', 'Outfits', 'Items'];
  const typeMap = {
    Posts: 'post',
    Outfits: 'outfit',
    Items: 'items',
  };

  const route = useRoute();
  const { item: routeItem } = route.params || {};
  const profileUser = normalizeCreatedBy(routeItem);
  const profileUserId = profileUser?._id;
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);

  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState(Usertabs[0]);
  const [shareModalvisible, setSharemodalvisible] = useState({
    visible: false,
    postDetail: '',
  });
  const [userDetail, setUserdetail] = useState({
    name: '',
    image: '',
    bio: '',
  });
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    postsCount: 0,
    outfitsCount: 0,
    itemsCount: 0,
  });
  const [postData, setPostdata] = useState([]);
  const [outfitsData, setOutfitsdata] = useState([]);
  const [itemsData, setItemsdata] = useState([]);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOutfitsHidden, setIsOutfitsHidden] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  console.log("Postdata is", postData)
  useEffect(() => {
    if (profileUserId) {
      fetchUsedetail();
    }
  }, [activeTab, profileUserId]);

  const closeShareModal = () =>
    setSharemodalvisible({ visible: false, postDetail: '' });

  const fetchUsedetail = async () => {
    if (!profileUserId) {
      console.log('UserProfile: missing profile user id', routeItem);
      return;
    }
    try {
      const res = await getUserInformation({
        user_id: profileUserId,
        type: typeMap[activeTab] || 'post',
      });
      const userData = res?.data?.user || res?.data;
      if (res?.success && userData) {
        setUserdetail({
          name: userData?.full_name,
          image: userData?.profile_image,
          bio: userData?.bio,
        });
        setStats({
          followers: userData?.followers,
          following: userData?.following,
          postsCount: userData?.postsCount || 0,
          outfitsCount: userData?.outfitsCount || 0,
          itemsCount: userData?.itemsCount || 0,
        });
        const isMe = String(userDetails?._id) === String(profileUserId);
        const following = userData?.followers_users?.some(
          u => String(u?._id) === String(userDetails?._id),
        );
        setIsFollowing(following);

        // Privacy Logic for Outfits
        const privacy =
          userData?.closetPrivacy ||
          userData?.privacy_settings?.closetPrivacy ||
          'PUBLIC';
        let hidden = false;
        if (!isMe) {
          if (privacy === 'ONLY_ME') {
            hidden = true;
          } else if (privacy === 'STYLIST_ONLY' && !following) {
            hidden = true;
          }
        }
        setIsOutfitsHidden(hidden);

        if (activeTab === 'Posts') {
          setPostdata(Array.isArray(userData?.posts) ? userData.posts : []);
        } else if (activeTab === 'Outfits') {
          if (hidden) {
            setOutfitsdata([]);
          } else {
            setOutfitsdata(
              Array.isArray(userData?.outfits) ? userData.outfits : [],
            );
          }
        } else if (activeTab === 'Items') {
          if (hidden) {
            setItemsdata([]);
          } else {
            setItemsdata(
              Array.isArray(userData?.items) ? userData.items : [],
            );
          }
        }
      }
    } catch (e) {
      console.log('Error fetching user detail', e);
    }
  };

  const handleClose = () => {
    setIsCommentVisible(false);
    setSelectedPost(null);
    setComments([]);
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await dispatch(
        addCommentPost({ postId: selectedPost?._id, comment: commentText }),
      ).unwrap();
      setIsCommentVisible(false);
      setCommentText('');
    } catch (e) {
      console.log('Comment failed:', e);
    } finally {
      await fetchUsedetail();
    }
  };

  const toggleLike = async id => {
    try {
      await dispatch(likePost(id)).unwrap();
      await fetchUsedetail();
    } catch (e) {
      console.log('Error liking post', e);
    }
  };

  const handleBookmark = async post => {
    try {
      const fd = new FormData();
      fd.append('type', 'post');
      fd.append('post_id', post?._id || '');
      fd.append('isLookbook', post?.isLookBook ? false : true);
      const res = await addToLookbookApi(fd);
      res?.success
        ? showSuccessToast(
          res?.message?.replace('Item', 'Post') || 'Post added',
        )
        : showDangerToast(res?.message || 'Failed');
    } catch {
      showDangerToast('Something went wrong');
    }
  };

  const onBlockpress = async () => {
    try {
      const res = await blockUserapi({ user_id: selectedPost?.createdBy?._id });
      res?.success
        ? showSuccessToast(res?.message)
        : showDangerToast(res?.message);
    } catch (e) {
      console.log('Error blocking', e);
    } finally {
      setShowOptions(false);
      setSelectedPost(null);
      await fetchUsedetail();
    }
  };

  const OnFollowpress = async type => {
    try {
      const payload = { user_id: profileUserId };
      type === 'follow'
        ? await followUserapi(payload)
        : await unFollowUserapi(payload);
    } catch (e) {
      console.log('Follow error', e);
    } finally {
      await fetchUsedetail();
    }
  };

  const handleMessage = async () => {
    const myId = userDetails?._id;
    const otherId = profileUserId;
    if (!myId || !otherId) return;
    const room = [myId, otherId].sort().join('_');
    try {
      if (!socket.socket) await socket.initializeSocket();
      socket.on('connect', () => {
        socket.emit('chatJoin', {
          sender_id: myId,
          receiver_id: otherId,
          room,
        });
      });
      if (socket.socket?.connected) {
        socket.emit('chatJoin', {
          sender_id: myId,
          receiver_id: otherId,
          room,
        });
      }
    } catch (e) {
      console.log('Socket error', e);
    }
    navigation.navigate('ChatScreen', {
      user: {
        _id: profileUserId,
        name: userDetail?.name || profileUser?.username,
        image: userDetail?.image || profileUser?.profile_image,
      },
    });
  };

  // ── URL builder ──────────────────────────
  const buildUri = (src, isItem = false) => {
    if (!src) return '';
    let clean = String(src).trim().replace(/\\/g, '/');
    if (isItem && !clean.toLowerCase().startsWith('http') && !clean.includes('uploads/items')) {
      const match = clean.match(/([^/]+)$/);
      if (match?.[0]) clean = `${IMAGEURL}uploads/items/${match[0]}`;
    }
    let uri = clean.toLowerCase().startsWith('http')
      ? clean
      : `${IMAGEURL}${clean}`;
    uri = uri.replace(/([^:])\/\/+/g, '$1/');
    return encodeURI(uri);
  };

  // ── Active data ───────────────────────────
  const getActiveData = () => {
    if (activeTab === 'Posts') return postData || [];
    if (activeTab === 'Outfits') return outfitsData || [];
    if (activeTab === 'Items') return itemsData || [];
    return [];
  };

  // ── Grid cell renderer ────────────────────
  const renderGridItem = ({ item: gi }) => {
    // console.log("hi", gi)
    if (activeTab === 'Posts') {
      const uri = buildUri(gi?.thumbnail || gi?.images?.[0] || gi?.image);
      return (
        <TouchableOpacity
          style={styles.postGridCard}
          activeOpacity={0.85}
          onPress={() => {
            const author = {
              _id: profileUserId,
              full_name: userDetail?.name,
              name: userDetail?.name,
              profile_image: userDetail?.image,
              username: profileUser?.username,
            };
            const enrichedPosts = (postData || []).map(p => {
              const images = Array.isArray(p?.images) && p.images.length > 0
                ? p.images
                : [p?.thumbnail || p?.image].filter(Boolean);
              return {
                ...p,
                images,
                createdBy: normalizeCreatedBy(p?.createdBy) || author,
              };
            });
            const tappedId = gi?._id || gi?.id;

            navigation.navigate('SocialCommunityScreen', {
              postId: tappedId,
              profilePosts: enrichedPosts,
            });
          }}
        >
          <ImagePreview
            image={uri}
            style={styles.postGridImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
    const isItem = activeTab === 'Items';
    const uri = buildUri(gi?.image || gi?.images?.[0], isItem);
    const price = gi?.price ?? gi?.mrp ?? gi?.selling_price ?? '0';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate(activeTab === 'Outfits' ? 'OutfitDetail' : 'ClosetDetails',
            activeTab === 'Outfits' ? { outfitId: gi._id } : { item: gi })
        }
      >
        <ImagePreview image={uri} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {gi?.name || gi?.title ? (
              (gi?.name || gi?.title).length > 25
                ? (gi?.name || gi?.title).substring(0, 30) + '...'
                : (gi?.name || gi?.title)
            ) : 'Untitled'}
          </Text>
          {/* <Text style={styles.cardPrice}>₹{price}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // ── Profile header (scrolls with content) ─
  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      {/* Avatar */}
      <View style={styles.container2}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          activeOpacity={0.85}
          onPress={() => userDetail?.image && setFullScreenImage(
            userDetail.image.toLowerCase().startsWith('http')
              ? userDetail.image
              : `${IMAGEURL}${userDetail.image}`
          )}
        >
          <ImagePreview image={userDetail?.image} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.name}>
          {capitalizeFirstLetter(userDetail?.name)}
        </Text>
        {!!toSafeString(userDetail?.bio) && (
          <Text style={styles.description}>{toSafeString(userDetail?.bio)}</Text>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.postsCount || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.outfitsCount || 0}</Text>
            <Text style={styles.statLabel}>Outfits</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.itemsCount || 0}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Follow / Message */}
      {profileUserId && String(profileUserId) !== String(userDetails?._id) && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => OnFollowpress(isFollowing ? 'unfollow' : 'follow')}
          >
            <Text style={styles.followText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={handleMessage}
          >
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {Usertabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, isActive && styles.activeTabBtn]}
            >
              <Text style={isActive ? styles.activeTabText : styles.tabText}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ── Empty state ───────────────────────────
  const ListEmpty = () => {
    const isPrivate = (activeTab === 'Outfits' || activeTab === 'Items') && isOutfitsHidden;
    const icon = activeTab === 'Outfits' ? imagePath.outfit : activeTab === 'Items' ? imagePath.closet : imagePath.newpost;

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.ootdEmptyIconContainer}>
          <Image source={isPrivate ? icon : imagePath.newpost} style={styles.emptuyIcon} />
        </View>
        <Text style={styles.emptyTitle}>
          {isPrivate ? 'Account is private' : 'No Data Found'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isPrivate
            ? `Follow this user to view their ${activeTab.toLowerCase()}`
            : `No ${activeTab.toLowerCase()} available right now.`}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, width: '100%', backgroundColor: Colors.white }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.white }}
        edges={['top', 'left', 'right']}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View
          style={{
            width: '100%',
            backgroundColor: Colors.white,
            paddingHorizontal: wp(5),
            paddingBottom: hp(1),
            borderBottomWidth: 1,
            borderBottomColor: Colors.borderNoButton,
            marginBottom: hp(1.5),
          }}
        >
          <View
            style={{
              marginTop:
                Platform.OS === 'android'
                  ? hp(2)
                  : Platform.OS === 'ios'
                    ? hp(1)
                    : hp(2),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Back
              style={{
                alignSelf: 'flex-start',
                backgroundColor: Colors.bgGrey,
              }}
              isOnBackPress={true}
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>

        {/* Fixed profile section — does NOT scroll */}
        <ProfileHeader />

        {/* Scrollable content — red background */}
        <FlatList
          key={activeTab}
          data={getActiveData()}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          style={styles.contentList}
          renderItem={renderGridItem}
          keyExtractor={(it, idx) => it?._id || idx.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmpty}
        />

        {/* Modals */}
        <ShareModal
          visible={shareModalvisible?.visible}
          postDetail={shareModalvisible?.postDetail}
          onClose={closeShareModal}
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
        <PostActionModal
          showOptions={showOptions}
          setShowOptions={setShowOptions}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          onBlockpress={onBlockpress}
        />
        <FullScreenImageModal
          visible={!!fullScreenImage}
          imageUri={fullScreenImage}
          onClose={() => setFullScreenImage(null)}
        />
      </SafeAreaView>
    </View>
  );
};

export default UserProfile;
