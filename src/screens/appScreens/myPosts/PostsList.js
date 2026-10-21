import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './styles';
import { hp, wp } from '../../../utils/helper';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../component/common/UI/Header';
import {
  deletePostApi,
  getCommentPostapi,
  getPostsApi,
  likePostapi,
} from '../../../services/auth.service';
import { addToLookbookApi } from '../../../services/user.service';
import { getData, AUTH_TOKEN_KEY } from '../../../utils/storage';
import { useEffect } from 'react';
import { setPosts } from '../../../redux/slices/postsSlice';
import EditPostModal from '../../../component/common/Modal/EditPostModal';
import moment from 'moment';
import Back from '../../../component/common/Buttons/Back';
import {
  addCommentPost,
  getPostlist,
  likePost,
} from '../../../redux/thunks/postsThunk';
import ImageCarousel from '../../../component/common/Modal/ImageCarousel';
import { showSuccessToast, showDangerToast } from '../../../utils/toast';
import ImagePreview from '../../../component/common/Image/ImagePreview';
import { FontSize, FontFamily } from '../../../constant/fonts';
import {
  capitalizeFirstLetter,
  getPostTime,
} from '../../../constant/functions';
import ShareModal from '../../../component/common/Modal/ShareModal';
import PostsListView from '../../../component/common/UI/PostListView';
import CommentModal from '../../../component/common/Modal/CommentModal';
import AppButton from '../../../component/common/Buttons/AppButton';
import { OutfitFamily } from '../../../constant/fonts';
const PostsList = ({ route }) => {
  const { postId, postData } = route?.params || {};
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [modalState, setModalState] = useState({
    visible: false,
    postDetail: '',
  });
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const PostsList = useSelector(state => state.posts);
  const loading = useSelector(state => state.posts.loading);
  const success = useSelector(state => state.posts.success);
  const verticalPickerRef = useRef(null);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [shareModalvisible, setSharemodalvisible] = useState({
    visible: false,
    postDetail: '',
  });
  console.log("PostsList", PostsList)
  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(getPostlist()); // 👈 replace with your action
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchPosts = async () => {
    try {
      dispatch(getPostlist(''));
    } catch (error) {
      console.log('Error fetching posts', error);
    }
  };

  const deletePost = async id => {
    try {
      const token = await getData(AUTH_TOKEN_KEY);
      if (token) {
        const res = await deletePostApi(id, token);
        if (res?.success == true) {
          fetchPosts();
        }
      }
    } catch (error) {
      console.log('Error fetching posts', error);
    } finally {
      showSuccessToast('Post deleted successfully.');
    }
  };

  const onDeletepress = val => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Delete', onPress: () => deletePost(val?._id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
  const onEditpress = val => {
    navigation.navigate('CreatePosts', { data: val });
  };

  const closeModal = () => {
    setModalState({
      visible: false,
      postDetail: '',
    });
  };
  const closeShareModal = () => {
    setSharemodalvisible({
      visible: false,
      postDetail: '',
    });
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
      const formData = new FormData();
      formData.append('type', 'post');
      formData.append('post_id', post?._id || '');
      formData.append('isLookbook', post?.isLookBook ? false : true);
      const res = await addToLookbookApi(formData);
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

  const fetchComments = async postId => {
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
      await fetchComments(selectedPost?._id);
      setCommentText(''); // clear input
    } catch (error) {
      console.log('Comment post failed:', error);
    } finally {
      await fetchPosts();
    }
  };

  const handleClose = () => {
    setIsCommentVisible(false);
    setSelectedPost(null);
    setComments([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="My Posts"
        headerTextStyle={{
          fontFamily: FontFamily.Bold,
          fontSize: FontSize.FONT_26,
          color: Colors.blackVar2,
        }}
        backgroundColor={Colors.white}
      />
      {loading && PostsList?.postsList?.length === 0 && !postData ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      ) : (
        <PostsListView
          posts={
            postData
              ? [postData]
              : postId
                ? [...(PostsList?.postsList || [])].filter(p => p._id === postId)
                : [...(PostsList?.postsList || [])].reverse()
          }
          userId={userDetails?._id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onBookmark={post => handleBookmark(post)}
          onLike={post => toggleLike(post._id)}
          onComment={post => {
            setSelectedPost(post);
            fetchComments(post._id);
            setIsCommentVisible(true);
          }}
          onShare={post =>
            setSharemodalvisible({
              visible: true,
              postDetail: post,
            })
          }
          onMorePress={post =>
            setModalState({
              visible: true,
              postDetail: post,
            })
          }
          style={styles}
          onUserpress={post => {
            navigation.navigate('UserProfile', { item: post?.createdBy });
          }}
        />
      )}
      <EditPostModal
        visible={modalState?.visible}
        postDetail={modalState?.postDetail}
        onClose={closeModal}
        onEdit={onEditpress}
        onDelete={onDeletepress}
      />
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
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('CreatePosts')}
        >
          <Image
            source={imagePath.plusbuttom}
            style={styles.fabImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostsList;
