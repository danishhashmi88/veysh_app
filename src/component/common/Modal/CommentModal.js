import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
} from 'react-native';
import React, { useRef } from 'react';
import moment from 'moment';
import { imagePath } from '../../../constant/imagePath';
import ImagePreview from '../Image/ImagePreview';
import { capitalizeFirstLetter } from '../../../constant/functions';
import { hp, wp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize } from '../../../constant/fonts';
import AppButton from '../Buttons/AppButton';

const CommentModal = ({
  visible,
  onClose,
  comments = [],
  loadingComments,
  selectedPost,
  commentText,
  setCommentText,
  handleSendComment,
  userDetails,
  canComment = true,
}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Bottom Sheet wrapper for KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1, justifyContent: 'flex-end' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : hp(2)}
        pointerEvents="box-none"
      >
        <View style={styles.commentModal}>
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={styles.modalHandle} />
          </View>

          <Text style={styles.modalTitle}>Comments</Text>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {loadingComments ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                Loading comments...
              </Text>
            ) : comments?.length > 0 ? (
              comments.map((item, index) => (
                <View key={index} style={styles.commentRow}>
                  <ImagePreview
                    image={item?.user?.profile_image}
                    style={styles.commentAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commentName}>
                      {capitalizeFirstLetter(
                        item?.user?.full_name || item?.user?.name,
                      )}
                    </Text>
                    <Text style={styles.commentText}>{item?.comment}</Text>
                  </View>
                  <Text style={styles.commentTime}>
                    {moment(item.createdAt).fromNow()}
                  </Text>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{
                  color: '#999',
                  fontSize: FontSize.FONT_14,
                  fontFamily: FontFamily.OutfitMedium
                }}>No comments yet</Text>
              </View>
            )}
          </ScrollView>

          {canComment ? (
            <View style={styles.commentInputRow}>
              <ImagePreview
                image={userDetails?.profile_image}
                style={styles.inputAvatar}
              />

              <TextInput
                placeholder="Type your comment..."
                placeholderTextColor={Colors.greyText}
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                onSubmitEditing={handleSendComment}
              />

              <AppButton style={styles.sendButton} onPress={handleSendComment}>
                <Image
                  source={imagePath?.send_icon}
                  style={{ width: wp(6), height: wp(6) }}
                  resizeMode="contain"
                  tintColor={Colors.white}
                />
              </AppButton>
            </View>
          ) : (
            <View style={styles.disabledCommentRow}>
              <Text style={styles.disabledCommentText}>
                Comments are turned off for this post.
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentModal;

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  commentModal: {
    width: '100%',
    height: hp(60),
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Increased bottom padding for iOS notch/safe area
  },

  handleContainer: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },

  modalTitle: {
    fontSize: FontSize.FONT_22,
    fontFamily: FontFamily.Bold,
    marginBottom: 20,
  },

  commentRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },

  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },

  commentName: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    marginBottom: 4,
  },

  commentText: {
    fontSize: FontSize.FONT_13,
    color: Colors.greyVar1,
    fontFamily: FontFamily.OutfitMedium,
  },

  commentTime: {
    fontSize: FontSize.FONT_12,
    color: Colors.greyVar1,
    marginLeft: 6,
    fontFamily: FontFamily.OutfitMedium,
  },

  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    marginBottom: 5,
  },

  inputAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },

  commentInput: {
    flex: 1,
    height: hp(5.5), // Slightly more height for better visibility
    backgroundColor: Colors.backGroundColor1,
    borderRadius: wp(3.5),
    paddingHorizontal: wp(5),
    paddingVertical: 0, // CRITICAL: Fixes text being cut off on Android
    fontSize: FontSize.FONT_13,
    color: Colors.black, // Ensure text is visible
    borderWidth: 1,
    borderColor: Colors.greyBorder,
    fontFamily: FontFamily.OutfitMedium,
  },

  sendButton: {
    marginLeft: wp(3),
    height: wp(10),
    width: wp(10),
    borderRadius: wp(10),
    // backgroundColor: Colors.backGroundColor1,
    // borderWidth: 1,
    // borderColor: Colors.greyBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -wp(3.5),
  },
  disabledCommentRow: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  disabledCommentText: {
    color: '#999',
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
  },
};
