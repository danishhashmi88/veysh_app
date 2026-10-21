import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize } from '../../../constant/fonts';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import ImageCarousel from './ImageCarousel';
import ImagePreview from '../Image/ImagePreview';
import { capitalizeFirstLetter } from '../../../constant/functions';

const PostPreviewContent = ({ onClose, postData, userDetails }) => {
  const themeColors = useTheme();
  const insets = useSafeAreaInsets();

  const previewImages = Array.isArray(postData?.images) ? postData.images : [];
  const previewVideos = Array.isArray(postData?.videos)
    ? postData.videos.map(v => (typeof v === 'object' ? v.path || v.uri : v)).filter(Boolean)
    : [];
  const previewThumbnails = Array.isArray(postData?.videos)
    ? postData.videos.map(v => (typeof v === 'object' ? v.thumbnail : null))
    : [];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.white }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={themeColors.white}
      />
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === 'ios'
                ? Math.max(insets.top, hp(1))
                : hp(2),
          },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Image
            source={imagePath.arrow_left}
            style={[styles.backIcon, { tintColor: themeColors.black }]}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.black }]}>
          Post Preview
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.postCard, { backgroundColor: themeColors.white }]}>
          <View style={styles.postHeader}>
            <ImagePreview
              image={userDetails?.profile_image}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: themeColors.blackVar3 }]}>
                {capitalizeFirstLetter(userDetails?.full_name || 'Your Name')}
              </Text>
              <Text style={[styles.location, { color: themeColors.lightGrey }]}>
                {postData.location || 'Location'}
              </Text>
            </View>
          </View>

          <ImageCarousel
            images={previewImages}
            videos={previewVideos}
            thumbnail={previewThumbnails}
            height={hp(45)}
            width={wp(94)}
            isParentVisible={true}
            useScrollView
          />

          <View style={styles.postActions}>
            <View style={styles.row}>
              <Image source={imagePath.heart} style={[styles.actionIcon, { tintColor: themeColors.blackVar3 }]} />
              <Image source={imagePath.commentoval} style={[styles.actionIcon, { tintColor: themeColors.blackVar3, marginLeft: wp(4) }]} />
              <Image source={imagePath.Share} style={[styles.actionIcon, { tintColor: themeColors.blackVar3, marginLeft: wp(4) }]} />
            </View>
            <Image source={imagePath.lookbookHome} style={[styles.actionIcon, { tintColor: themeColors.blackVar3 }]} />
          </View>

          <View style={styles.postContent}>
            <Text style={[styles.caption, { color: themeColors.blackVar3 }]}>
              {postData.caption || 'No caption'}
            </Text>
            <View style={styles.tagsContainer}>
              {postData.tags?.map((tag, index) => (
                <Text key={index} style={[styles.tagText, { color: themeColors.mediumPurple }]}>
                  #{tag}{' '}
                </Text>
              ))}
              {postData.mentions?.map((mention, index) => (
                <Text key={index} style={[styles.tagText, { color: themeColors.themeColor }]}>
                  @{mention.username || mention}{' '}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <SafeAreaView edges={['bottom']} />
    </View>
  );
};

const PostPreviewModal = ({
  visible,
  onClose,
  postData,
  userDetails,
}) => {
  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <PostPreviewContent
          onClose={onClose}
          postData={postData}
          userDetails={userDetails}
        />
      </SafeAreaProvider>
    </Modal>
  );
};

export default PostPreviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: wp(1),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: FontSize.FONT_20,
    fontFamily: FontFamily.Bold,
    marginLeft: wp(5),
  },
  scrollContent: {
    paddingBottom: hp(5),
  },
  postCard: {
    marginTop: hp(2),
    marginHorizontal: wp(3),
    borderRadius: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    paddingBottom: hp(2),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#eee',
  },
  userInfo: {
    marginLeft: wp(3),
  },
  userName: {
    fontSize: FontSize.FONT_15,
    fontFamily: FontFamily.OutfitMedium,
  },
  location: {
    fontSize: FontSize.FONT_12,
    fontFamily: FontFamily.OutfitRegular,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: wp(5.5),
    height: wp(5.5),
    resizeMode: 'contain',
  },
  postContent: {
    paddingHorizontal: wp(4),
  },
  caption: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitRegular,
    lineHeight: hp(2.2),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(0.5),
  },
  tagText: {
    fontSize: FontSize.FONT_13,
    fontFamily: FontFamily.OutfitMedium,
  },
});
