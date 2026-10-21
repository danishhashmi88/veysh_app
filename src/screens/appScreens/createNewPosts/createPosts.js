import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './styles';
import {
  hp,
  wp,
  getImageUrl,
  getImageMimeType,
  remoteImageToUploadFile,
} from '../../../utils/helper';
import { IMAGEURL } from '../../../utils/axios';
import { useTheme } from '../../../hooks/useTheme';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../../../component/common/UI/Header';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import { imagePath } from '../../../constant/imagePath';
import PostSwitch from '../../../component/Settings/PostSwitch';
import {
  createPostApi,
  editPostApi,
  getPostsApi,
} from '../../../services/auth.service';
import { getFollowersApi } from '../../../services/user.service';
import { AUTH_TOKEN_KEY, getData } from '../../../utils/storage';
import { showMessage } from 'react-native-flash-message';
import AppButton from '../../../component/common/Buttons/AppButton';
import { setPosts } from '../../../redux/slices/postsSlice';
import { getPostlist } from '../../../redux/thunks/postsThunk';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import Video from 'react-native-video';
import { FontSize, FontFamily, OutfitFamily } from '../../../constant/fonts';
import FullScreenImageModal from '../../../component/common/Modal/FullScreenImageModal';
import PostPreviewModal from '../../../component/common/Modal/PostPreviewModal';

const CreatePosts = ({ route }) => {
  let PostData = route?.params?.data;
  const sharePrefill = route?.params?.prefillFromShare;
  const isShareFlow = !!sharePrefill?.fromShare;
  const { tokenAndId } = useSelector(state => state.user);
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [tagError, setTagError] = useState('');
  const [tags, setTags] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [likecomments, setLikecomments] = useState({
    like: false,
    comment: false,
    comment_off: false,
    followers_only: false,
  });
  console.log("likecomment", likecomments)
  const [followersList, setFollowersList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [closetImageUrls, setClosetImageUrls] = useState([]);
  const [selectedOutfitId, setSelectedOutfitId] = useState(null);
  const [selectedClosetItems, setSelectedClosetItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({ uri: '', type: 'image' });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { userDetails } = useSelector(state => state.user);
  const { outfitsList } = useSelector(state => state.outfits);
  const { itemsList } = useSelector(state => state.items);

  const allPostImages = [...images, ...closetImageUrls];

  useEffect(() => {
    const initialData = PostData || sharePrefill;
    if (!initialData) return;

    setCaption(initialData?.caption || '');
    setTags(initialData?.tags || []);
    setLocation(initialData?.location || '');
    setLikecomments({
      like: initialData?.hideLikes ?? false,
      comment: initialData?.hideComments ?? false,
      comment_off: initialData?.turnOffComments ?? false,
      followers_only:
        initialData?.followersOnly ??
        initialData?.followers_only ??
        false,
    });

    if (Array.isArray(initialData?.tagged_users)) {
      setMentions(
        initialData.tagged_users
          .filter(u => u && u._id)
          .map(u => ({
            _id: u._id,
            username: u.username || u.full_name || 'User',
          })),
      );
    }

    if (sharePrefill?.outfit_id) {
      setSelectedOutfitId(sharePrefill.outfit_id);
      setSelectedClosetItems([]);
    } else if (sharePrefill?.item_id) {
      setSelectedClosetItems([{ id: sharePrefill.item_id }]);
      setSelectedOutfitId(null);
    }

    if (Array.isArray(initialData?.images) && initialData.images.length > 0) {
      const imagesWithBaseUrl = initialData.images.map(img =>
        typeof img === 'string' && img.startsWith('http')
          ? img
          : getImageUrl(img),
      );

      if (sharePrefill?.fromShare) {
        setClosetImageUrls(imagesWithBaseUrl);
      } else {
        setImages(imagesWithBaseUrl);
      }
    }

    if (Array.isArray(initialData?.videos) && initialData.videos.length > 0) {
      const videosWithBaseUrl = initialData.videos.map((video, idx) => ({
        path: `${video}`,
        thumbnail: Array.isArray(initialData.thumbnail)
          ? initialData.thumbnail[idx]
          : idx === 0
            ? initialData.thumbnail
            : null,
        isRemote: true,
      }));
      setVideos(videosWithBaseUrl);
    }
  }, [PostData, sharePrefill]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await getFollowersApi();
        if (res?.success) {
          setFollowersList(res?.data?.followers || []);
        }
      } catch (error) {
        console.log('Error fetching followers', error);
      }
    };
    fetchFollowers();
  }, []);

  const showImageOptions = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Camera', onPress: onCamera },
      { text: 'Gallery', onPress: onGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const addTag = isMention => {
    const input = isMention ? mentionInput : tagInput;
    const trimmedVal = input.trim();
    if (!trimmedVal) return;

    const list = isMention ? mentions : tags;
    const setList = isMention ? setMentions : setTags;

    const isDuplicate = list.some(item => {
      const itemVal = isMention ? item.username : item;
      return itemVal.toLowerCase() === trimmedVal.toLowerCase();
    });
    if (isDuplicate) {
      setTagError(
        `You have already added this ${isMention ? 'person' : 'tag'}.`,
      );
      return;
    }
    const newItem = isMention
      ? { _id: null, username: trimmedVal }
      : trimmedVal;
    setList([...list, newItem]);
    if (isMention) {
      setMentionInput('');
      setShowDropdown(false);
    } else {
      setTagInput('');
    }
    setTagError('');
  };

  const selectMention = user => {
    if (!user || !user._id) return;
    const isDuplicate = mentions.some(item => item._id === user._id);
    if (isDuplicate) {
      setTagError('You have already added this person.');
      return;
    }
    setMentions([...mentions, { _id: user._id, username: user.username }]);
    setMentionInput('');
    setShowDropdown(false);
    setTagError('');
  };

  const removeTag = (indexToRemove, isMention) => {
    if (isMention) {
      setMentions(mentions.filter((_, index) => index !== indexToRemove));
    } else {
      setTags(tags.filter((_, index) => index !== indexToRemove));
    }
  };

  const onCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'any',
    })
      .then(media => {
        console.log('media is', media);
        if (media.mime.startsWith('image')) {
          setImages(prev => [...prev, media.path]);
        } else if (media.mime.startsWith('video')) {
          setVideos(prev => [...prev, media]);
        }
      })
      .catch(e => console.log('Camera Error:', e));
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'any',
    })
      .then(media => {
        const newImages = [];
        const newVideos = [];

        media.forEach(item => {
          if (item.mime.startsWith('image')) {
            newImages.push(item.path);
          } else if (item.mime.startsWith('video')) {
            newVideos.push(item);
          }
        });

        setImages(prev => [...prev, ...newImages]);
        setVideos(prev => [...prev, ...newVideos]);
      })
      .catch(e => console.log('Gallery Error:', e));
  };

  const removePhoto = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  const removeVideo = index => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handlelike = val => {
    setLikecomments(prev => ({ ...prev, like: val }));
  };

  const handlecomment = val => {
    setLikecomments(prev => ({ ...prev, comment: val }));
  };

  const handlecomment_off = val => {
    setLikecomments(prev => ({ ...prev, comment_off: val }));
  };

  const handlefollowers_only = val => {
    setLikecomments(prev => ({ ...prev, followers_only: val }));
  };

  const clearClosetSelection = () => {
    setSelectedOutfitId(null);
    setSelectedClosetItems([]);
    setClosetImageUrls([]);
  };

  const applyOutfitSelection = (outfitId, outfitImage) => {
    const outfit = outfitsList?.find(o => o._id === outfitId);
    const imagePaths = [];
    if (outfit?.image) imagePaths.push(outfit.image);
    if (Array.isArray(outfit?.images)) imagePaths.push(...outfit.images);
    if (imagePaths.length === 0 && outfitImage) imagePaths.push(outfitImage);

    const uniqueUrls = [
      ...new Set(imagePaths.map(path => getImageUrl(path)).filter(Boolean)),
    ];

    setSelectedOutfitId(outfitId);
    setSelectedClosetItems([]);
    setClosetImageUrls(uniqueUrls);

    if (!caption.trim() && outfit?.name) {
      setCaption(outfit.name);
    }
  };

  const applyItemSelection = selectedItems => {
    const items = (selectedItems || []).map(selected => {
      const itemData = itemsList?.find(i => i._id === selected.id);
      return {
        id: selected.id,
        image: selected.image || itemData?.images?.[0] || itemData?.image,
        name: itemData?.name || itemData?.title,
      };
    });

    const uniqueUrls = [
      ...new Set(
        items.map(item => getImageUrl(item.image)).filter(Boolean),
      ),
    ];

    setSelectedOutfitId(null);
    setSelectedClosetItems(items);
    setClosetImageUrls(uniqueUrls);

    if (!caption.trim() && items.length === 1 && items[0].name) {
      setCaption(items[0].name);
    }
  };

  const handleOutfitSelect = () => {
    navigation.navigate('ItemHomes', {
      onSelect: data => {
        if (data?.type === 'Outfit' && data.selectedOutfit) {
          applyOutfitSelection(data.selectedOutfit, data.selectedOutfitImage);
        }
      },
      type: 'Outfit',
      initialSelectedIds: selectedOutfitId ? [selectedOutfitId] : [],
    });
  };

  const handleItemSelect = () => {
    navigation.navigate('ItemHomes', {
      onSelect: data => {
        if (data?.type === 'item') {
          applyItemSelection(data.selectedItems || []);
        }
      },
      type: 'item',
      initialSelectedIds: selectedClosetItems.map(item => item.id),
    });
  };

  const handlePostBtn = async () => {
    if (allPostImages.length === 0 && videos.length === 0) {
      showDangerToast('Please add at least one image or video');
      return;
    }
    // if (!caption || !location) {
    //   showDangerToast('Caption and location are required');
    //   return;
    // }

    setIsLoading(true);

    try {
      const apiFormData = new FormData();
      apiFormData.append('caption', caption);

      // Array fields must be JSON.stringify as per backend (only if not empty)
      if (tags && tags.length > 0) {
        apiFormData.append('tags', JSON.stringify(tags));
      }

      if (mentions && mentions.length > 0) {
        const mentionIds = mentions
          .map(m => (typeof m === 'object' ? m?._id : m))
          .filter(Boolean);
        apiFormData.append('tagged_users', JSON.stringify(mentionIds));
      }

      apiFormData.append('collaborate', false);
      apiFormData.append('location', location);
      apiFormData.append('hideComments', !!likecomments?.comment);
      apiFormData.append('turnOffComments', !!likecomments?.comment_off);
      apiFormData.append('hideLikes', !!likecomments?.like);
      apiFormData.append('followersOnly', !!likecomments?.followers_only);

      if (selectedOutfitId) {
        apiFormData.append('outfit_id', selectedOutfitId);
      }

      if (selectedClosetItems.length > 0) {
        const itemIds = selectedClosetItems.map(item => item.id).filter(Boolean);
        if (itemIds.length === 1) {
          apiFormData.append('item_id', itemIds[0]);
        } else if (itemIds.length > 1) {
          apiFormData.append('item_id', JSON.stringify(itemIds));
        }
      }

      const isEdit = !!PostData;

      if (isEdit) {
        apiFormData.append('o_id', PostData._id);
      }

      const remoteImages = allPostImages.filter(
        img => typeof img === 'string' && img.startsWith('http'),
      );

      const localImages = allPostImages.filter(
        img => typeof img === 'string' && !img.startsWith('http'),
      );

      if (isEdit && remoteImages.length > 0) {
        const existingImages = remoteImages.map(url =>
          url.replace(IMAGEURL, '').replace(/^\//, ''),
        );
        apiFormData.append('existing_images', JSON.stringify(existingImages));
      }

      if (!isEdit && remoteImages.length > 0) {
        for (const url of remoteImages) {
          try {
            const file = await remoteImageToUploadFile(url);
            apiFormData.append('images', file);
          } catch (downloadError) {
            console.log('Remote image download failed, using direct uri', downloadError);
            const name =
              url.split('/').pop()?.split('?')[0] || `image_${Date.now()}.jpg`;
            apiFormData.append('images', {
              uri: url,
              name,
              type: getImageMimeType(name),
            });
          }
        }
      }

      localImages.forEach(uri => {
        const name = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(name);

        let uriToUpload = uri;
        if (
          !uriToUpload.startsWith('file://') &&
          !uriToUpload.startsWith('content://')
        ) {
          uriToUpload = `file://${uriToUpload}`;
        }

        apiFormData.append('images', {
          uri: uriToUpload,
          name,
          type: match ? `image/${match[1]}` : 'image/jpeg',
        });
      });

      videos.forEach(video => {
        console.log('hi shubham');
        if (!video?.path) return;
        if (video.path.startsWith('http')) return;

        const name = video.path.split('/').pop();
        const match = /\.(\w+)$/.exec(name);
        const ext = match?.[1]?.toLowerCase();

        let mimeType = 'video/mp4';

        if (ext === 'mov') mimeType = 'video/quicktime';
        else if (ext === 'mp4') mimeType = 'video/mp4';
        else if (ext === 'mkv') mimeType = 'video/x-matroska';
        else if (ext === 'avi') mimeType = 'video/x-msvideo';

        let videoUri = video.path;
        if (
          !videoUri.startsWith('file://') &&
          !videoUri.startsWith('content://')
        ) {
          videoUri = `file://${videoUri}`;
        }

        apiFormData.append('videos', {
          uri: videoUri,
          name,
          type: video.mime || mimeType,
        });
      });
      const response = isEdit
        ? await editPostApi(apiFormData)
        : await createPostApi(apiFormData);
      console.log(response,'response');
      
      if (response?.success === true) {
        const isPremiumMessage = response?.message
          ?.toLowerCase()
          .includes('premium subscription');

        if (isPremiumMessage) {
          showDangerToast(
            response?.message || 'Subscription limit reached. Please upgrade.',
          );
          setIsLoading(false);
          return;
        }

        showSuccessToast(
          response?.message ||
            (isEdit ? 'Post updated successfully' : 'Post created successfully'),
        );
        dispatch(getPostlist(''));
        setIsLoading(false);
        navigation.goBack();
      } else {
        setIsLoading(false);
        showDangerToast(response?.message || 'Failed to save post');
      }
    } catch (error) {
      console.log('Create/Edit Post Error', error);
      setIsLoading(false);
      const errorMsg = error?.response?.data?.message || 'Failed to save post';
      showDangerToast(errorMsg);
    }
  };

  const filteredFollowers = mentionInput.trim()
    ? followersList.filter(
      f =>
        f.username
          ?.toLowerCase()
          .includes(mentionInput.toLowerCase().trim()) ||
        f.name?.toLowerCase().includes(mentionInput.toLowerCase().trim()),
    )
    : [];

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
        title={PostData ? 'Edit Post' : isShareFlow ? 'Share to Social' : 'Create Post'}
        headerTextStyle={{
          fontFamily: FontFamily.Bold,
          fontSize: FontSize.FONT_26,
          color: Colors.blackVar2,
        }}
        backgroundColor={Colors.white}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Image/Video</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={showImageOptions}>
              <View style={styles.iconWrapper}>
                <Image
                  source={imagePath.uploadIcon || imagePath.ic_upload}
                  style={styles.uploadMainIcon}
                  tintColor={Colors.primaryBlue}
                />
              </View>
              <Text style={styles.uploadText}>Upload Image/Video</Text>
              <Text style={styles.uploadText}>
                Upload multiple images or videos
              </Text>
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoRow}
            >
              {Array.isArray(images) &&
                images.length > 0 &&
                images.map((photo, index) => (
                  <TouchableOpacity
                    key={`img-${index}`}
                    style={styles.thumbnailWrapper}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedMedia({ uri: photo, type: 'image' });
                      setIsModalVisible(true);
                    }}
                  >
                    <Image source={{ uri: photo }} style={styles.thumbnail} />

                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() => removePhoto(index)}
                    >
                      <Text style={{ color: Colors.white, fontSize: 10 }}>✕</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              {Array.isArray(videos) &&
                videos.length > 0 &&
                videos.map((video, index) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={`vid-${index}`}
                    style={[
                      styles.thumbnailWrapper,
                      { borderRadius: 10, overflow: 'hidden' },
                    ]}
                    onPress={() => {
                      setSelectedMedia({ uri: video.path, type: 'video' });
                      setIsModalVisible(true);
                    }}
                  >
                    <View pointerEvents="none">
                      <Video
                        source={{ uri: video.path }}
                        style={styles.thumbnail}
                        paused={false}
                        muted={true}
                        repeat={true}
                        resizeMode="cover"
                        poster={video.thumbnail ? getImageUrl(video.thumbnail) : null}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() => removeVideo(index)}
                    >
                      <Text style={{ color: Colors.white, fontSize: 10 }}>✕</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Add from Closet</Text>
            <Text style={[styles.uploadText, { marginBottom: hp(1.5) }]}>
              Share a saved item or outfit from your closet
            </Text>
            <View style={styles.selectionLinkContainer}>
              <TouchableOpacity
                style={[
                  styles.selectionCard,
                  selectedOutfitId && styles.activeSelectionCard,
                ]}
                onPress={handleOutfitSelect}
              >
                <View style={styles.selectionIconBg}>
                  <Image
                    source={imagePath.outfit || imagePath.closet}
                    style={styles.selectionIcon}
                  />
                </View>
                <Text style={styles.selectionLabel}>My Outfits</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.selectionCard,
                  selectedClosetItems.length > 0 && styles.activeSelectionCard,
                ]}
                onPress={handleItemSelect}
              >
                <View style={styles.selectionIconBg}>
                  <Image
                    source={imagePath.outfitPlanner || imagePath.closet}
                    style={styles.selectionIcon}
                  />
                </View>
                <Text style={styles.selectionLabel}>My Items</Text>
              </TouchableOpacity>
            </View>

            {closetImageUrls.length > 0 && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>
                  Selected {selectedOutfitId ? 'Outfit' : 'Item(s)'}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.selectedItemsScroll}
                >
                  {closetImageUrls.map((photo, index) => (
                    <TouchableOpacity
                      key={`closet-img-${index}`}
                      style={styles.previewCard}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedMedia({ uri: photo, type: 'image' });
                        setIsModalVisible(true);
                      }}
                    >
                      <Image source={{ uri: photo }} style={styles.previewImage} />
                      {index === 0 && (
                        <TouchableOpacity
                          style={styles.removePreview}
                          onPress={clearClosetSelection}
                        >
                          <Text style={{ color: Colors.white, fontSize: 10 }}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <LabelInput
            title="Caption"
            placeholder="Enter Caption"
            value={caption}
            onChangeText={setCaption}
          />
          <LabelInput
            title="Add Location (optional)"
            placeholder="Enter Location"
            value={location}
            onChangeText={setLocation}
            required={false}
          />
          <LabelInput
            title="Tags"
            placeholder="Enter Tags"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => addTag(false)}
            maxLength={15}
          />
          <View
            style={[
              styles.chipContainer,
              {
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: hp(0.5),
                marginBottom: hp(1),
              },
            ]}
          >
            {tags?.map((tag, index) => (
              <View key={`tag-${index}`} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(index, false)}>
                  <Text style={styles.tagClose}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>


          <LabelInput
            title="Mention People"
            placeholder="Search User"
            value={mentionInput}
            onChangeText={text => {
              setMentionInput(text);
              setShowDropdown(true);
            }}
            onSubmitEditing={() => addTag(true)}
            maxLength={100}
            leftIcon={imagePath.searchImage}
            showLeftIcon={true}
          />
          {showDropdown &&
            mentionInput.trim().length > 0 &&
            filteredFollowers.length > 0 && (
              <View style={styles.dropdownContainer}>
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {filteredFollowers.map((user, index) => (
                    <TouchableOpacity
                      key={`follower-${index}`}
                      style={styles.dropdownItem}
                      onPress={() => selectMention(user)}
                    >
                      <Image
                        source={{
                          uri: user.profile_image || imagePath.placeholder,
                        }}
                        style={styles.dropdownImage}
                      />
                      <View>
                        <Text style={styles.dropdownName}>{user.name}</Text>
                        <Text style={styles.dropdownUsername}>
                          @{user.username}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          <View
            style={[
              styles.chipContainer,
              {
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: hp(0.5),
                marginBottom: hp(1),
              },
            ]}
          >
            {mentions?.map((item, index) => (
              <View key={`mention-${index}`} style={styles.tagChip}>
                <Text style={styles.tagText}>
                  {typeof item === 'object' ? item.username : item}
                </Text>
                <TouchableOpacity onPress={() => removeTag(index, true)}>
                  <Text style={styles.tagClose}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {tagError ? <Text style={styles.errorText}>{tagError}</Text> : null}
          {/* <TouchableOpacity
          style={styles.arrowcontainer}
          activeOpacity={0.7}
          // onPress={onPress}
        >
          <View style={styles.left}>
            <Text style={styles.title}>Collaborate with Stylist</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.arrowcontainer, { marginTop: 20 }]}
          activeOpacity={0.7}
          // onPress={onPress}
        >
          <View style={styles.left}>
            <Text style={styles.title}>Collaborate with User</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity> */}

          <PostSwitch
            label="Hide likes"
            value={likecomments.like}
            onValueChange={handlelike}
          />
          <PostSwitch
            label="Hide comments"
            value={likecomments.comment}
            onValueChange={handlecomment}
          />
          <PostSwitch
            label="Turn off comments"
            value={likecomments.comment_off}
            onValueChange={handlecomment_off}
          />
          <PostSwitch
            label="Followers Only"
            value={likecomments.followers_only}
            onValueChange={handlefollowers_only}
          />
          <AppButton
            marginTop={hp(4)}
            title="Preview"
            backgroundColor={Colors.white}
            textColor={Colors.themeColor || Colors.primary}
            borderWidth={1}
            borderColor={Colors.themeColor || Colors.primary}
            onPress={() => setShowPreviewModal(true)}
          />
          <AppButton
            marginTop={hp(2)}
            loading={isLoading}
            title={PostData ? 'Update Post' : 'Post'}
            onPress={handlePostBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <FullScreenImageModal
        visible={isModalVisible}
        imageUri={selectedMedia.uri}
        mediaType={selectedMedia.type}
        onClose={() => setIsModalVisible(false)}
      />

      <PostPreviewModal
        visible={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        postData={{
          caption,
          location,
          tags,
          mentions,
          images: allPostImages,
          videos,
        }}
        userDetails={userDetails}
      />
    </View>
  );
};

export default CreatePosts;
