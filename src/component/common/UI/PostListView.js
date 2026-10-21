import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { hp, normalizeCreatedBy, onShareNative, wp } from '../../../utils/helper';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';
import {
  capitalizeFirstLetter,
  getPostTime,
} from '../../../constant/functions';
import { imagePath } from '../../../constant/imagePath';
import ImageCarousel from '../Modal/ImageCarousel';
import ImagePreview from '../Image/ImagePreview';
import { useTheme } from '../../../hooks/useTheme';
import NoDataText from './NoDataText';

const AnimatedLikeButton = ({
  isLiked,
  onPress,
  onLongPress,
  delayLongPress,
  themeColors,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pop = () => {
    scale.value = withSequence(
      withTiming(1.35, { duration: 130 }),
      withSpring(1, { damping: 8, stiffness: 260, mass: 0.5 }),
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        pop();
        onPress && onPress();
      }}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      style={styles.iconButton}
    >
      <Animated.Image
        source={isLiked ? imagePath.heartRed : imagePath.heart}
        style={[
          styles.actionIcon,
          animatedStyle,
          { tintColor: isLiked ? null : themeColors.blackVar3 },
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const PostsListView = ({
  posts = [],
  refreshing = false,
  onRefresh,
  onLike,
  onComment,
  onShare,
  onMorePress,
  onBookmark,
  onLikeLongPress,
  style,
  onUserpress,
  latestPost = false,
  contentStyle,
  scrollEnabled = true,
  userId,
  onPressPost,
}) => {
  const themeColors = useTheme();

  const renderPostItem = ({ item: post }) => {
    // Check isLiked flag strictly from API, fallback to likes array if flag is incorrect
    const isLikedByUser =
      post?.isLiked === true ||
      post?.liked === true ||
      (post?.isLiked !== false &&
        post?.liked !== false &&
        userId &&
        post?.likes?.some(id => String(id) === String(userId)));

    const author = normalizeCreatedBy(post?.createdBy);
    const isOwner = userId && String(author?._id) === String(userId);
    const showLikesCount = isOwner || !post?.hideLikes;
    const showCommentsCount = isOwner || !post?.hideComments;
    const canComment = isOwner || !post?.turnOffComments;
    const authorName =
      author?.full_name || author?.name || author?.username || '';

    return (
      <View
        style={[
          styles.postCardview,
          { backgroundColor: themeColors.background },
          latestPost && style.postCard,
        ]}
      >
        <View style={styles.postHeader}>
          <TouchableOpacity
            onPress={() => {
              onUserpress(post);
            }}
          >
            <ImagePreview
              style={styles.postAvatar}
              image={author?.profile_image}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: wp(3) }}>
            <TouchableOpacity
              onPress={() => {
                onUserpress(post);
              }}
            >
              <Text style={[styles.postUser, { color: themeColors.blackVar3 }]}>
                {capitalizeFirstLetter(authorName)}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.postTime, { color: themeColors.lightGrey }]}>
              {getPostTime(post.createdAt)}
            </Text>
          </View>

          {!latestPost && (
            <TouchableOpacity onPress={() => onMorePress(post)}>
              <Image
                source={imagePath.dotsVer}
                style={[styles.moreIcon, { tintColor: themeColors.blackVar3 }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        <ImageCarousel
          images={post?.images || []}
          videos={post?.videos || []}
          thumbnail={post?.thumbnail}
          onPress={() => onPressPost && onPressPost(post)}
        />

        <View style={styles.postActions}>
          <View style={styles.row}>
            <View style={styles.actionPill}>
              <AnimatedLikeButton
                isLiked={isLikedByUser}
                onPress={() => onLike(post)}
                onLongPress={() => onLikeLongPress && onLikeLongPress(post)}
                delayLongPress={800}
                themeColors={themeColors}
              />
              {showLikesCount && (
                <Text
                  style={[styles.actionText, { color: themeColors.blackVar3 }]}
                >
                  {post?.likesCount}
                </Text>
              )}
            </View>

            <View style={styles.actionPill}>
              <TouchableOpacity
                onPress={() => {
                  onComment(post);
                }}
                style={styles.iconButton}
              >
                <Image
                  source={imagePath.commentoval}
                  style={[styles.actionIcon, { tintColor: themeColors.blackVar3 }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {showCommentsCount && (
                <Text
                  style={[styles.actionText, { color: themeColors.blackVar3 }]}
                >
                  {post.commentsCount}
                </Text>
              )}
            </View>

            <View style={styles.actionPill}>
              <TouchableOpacity
                onPress={() => onShareNative(post)}
                style={styles.iconButton}
              >
                <Image
                  source={imagePath.Share}
                  style={[styles.actionIcon, { tintColor: themeColors.blackVar3 }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.actionPill, { marginRight: 0 }]}>
            <TouchableOpacity
              onPress={() => onBookmark && onBookmark(post)}
              style={styles.iconButton}
            >
              <Image
                source={imagePath.lookbookHome}
                style={[
                  styles.actionIcon,
                  {
                    tintColor:
                      post?.isSaved ||
                        post?.isInLookbook ||
                        post?.is_saved ||
                        post?.isLookBook
                        ? themeColors.themeColor
                        : themeColors.blackVar3,
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.textTitle}>
          <Text style={[styles.postTitle, { color: themeColors.blackVar3 }]}>
            {post.caption}
          </Text>

          <View style={styles.postWrap}>
            {post.tags?.map((tag, index) => (
              <Text
                key={index}
                style={[styles.postTags, { color: themeColors.mediumPurple }]}
              >
                #{tag + ' '}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderPostItem}
      keyExtractor={item => item._id}
      extraData={[posts, themeColors]}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        style?.scrollContent,
        contentStyle,
        (!posts || posts.length === 0) && {
          flexGrow: 1,
          justifyContent: 'center',
        },
      ]}
      ListEmptyComponent={() => (
        <NoDataText
          source={imagePath.newpost}
          title={'No post available'}
          subTitle={'There are no posts available right now please create a new Post.'}
        />
        // <View style={styles.emptyContainer}>
        //   <Text style={styles.emptyTitle}>No Post Available</Text>
        //   <Text style={styles.emptyText}>
        //     There are no posts available right now please create a new Post.
        //   </Text>
        // </View>
      )}
    />
  );
};

export default PostsListView;

const styles = StyleSheet.create({
  postCardview: {
    marginBottom: hp(2.5),
    backgroundColor: Colors.white,
    borderRadius: wp(4), // Reduced from wp(4) for a sleeper look
    paddingBottom: hp(1.5), // Space at bottom
    // Add shadow if it's meant to look like a floating card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    marginTop: hp(1.5),
    paddingHorizontal: wp(3), // Inner padding
  },
  postAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(100),
  },
  postUser: {
    fontSize: FontSize.FONT_15,
    color: Colors.blackVar3,
    fontFamily: FontFamily.OutfitMedium,
    // marginBottom: hp(0.2), // Slight spacing between name and time
  },
  postTime: {
    fontSize: FontSize.FONT_11,
    color: Colors.graytext,
    fontFamily: FontFamily.OutfitMedium,
    marginBottom: hp(0.5),
    fontWeight: FontWeight.FONT_400,
    // Time moved under the name in the new design
  },
  moreIcon: { width: wp(5), height: wp(5), tintColor: Colors.blackVar3 }, // Adjusted for design
  postMainImage: {
    width: '100%', // Full width image in the new design
    height: hp(35),
    // borderRadius: wp(-10),
    // removed border radius as it spans edge to edge in the middle
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3), // Padding for actions
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { width: wp(5.5), height: wp(5.5) }, // Slightly larger icons
  actionText: {
    fontSize: FontSize.FONT_13,
    color: Colors.blackVar3,
    marginLeft: wp(1.5),
    fontFamily: FontFamily.OutfitMedium,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(4), // More spacing between action items
    // Removed the background pill styling to match design (transparent icons with text)
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    paddingHorizontal: wp(3), // Align text with the rest of the content
  },
  postTitle: {
    fontSize: FontSize.FONT_14,
    color: Colors.blackVar3,
    fontFamily: FontFamily.OutfitRegular,
    marginBottom: hp(0.5),
  },
  postTags: {
    fontSize: FontSize.FONT_12,
    color: Colors.mediumPurple, // Purple tags based on design
    fontFamily: FontFamily.OutfitRegular,
  },
  postWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FontSize.FONT_22,
    fontFamily: OutfitFamily.Medium,
    color: Colors.blackVar3,
  },
  emptyText: {
    fontSize: FontSize.FONT_13,
    color: '#777',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 30,
    fontFamily: OutfitFamily.Regular,
  },
});
