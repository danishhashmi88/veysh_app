import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  PanResponder,
} from 'react-native';
import React, { useRef } from 'react';
import ImagePreview from '../Image/ImagePreview';
import { capitalizeFirstLetter } from '../../../constant/functions';
import { hp, wp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize } from '../../../constant/fonts';

const LikesModal = ({ visible, onClose, likes = [], loadingLikes }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
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
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.bottomSheetContainer}>
        <View style={styles.likesModal}>
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={styles.modalHandle} />
          </View>

          <Text style={styles.modalTitle}>Likes</Text>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {loadingLikes ? (
              <Text style={styles.infoText}>Loading likes...</Text>
            ) : likes?.length > 0 ? (
              likes.map((item, index) => {
                const user = item?.user || item; // Handle both nested and flat structure
                return (
                  <View key={index} style={styles.userRow}>
                    <ImagePreview
                      image={user?.profile_image}
                      style={styles.userAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.userName}>
                        {capitalizeFirstLetter(
                          user?.full_name || user?.name || 'Unknown User',
                        )}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No likes yet</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LikesModal;

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  likesModal: {
    width: '100%',
    height: hp(50),
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  handleContainer: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHandle: {
    width: wp(10),
    height: wp(1),
    backgroundColor: Colors.greyBorder,
    borderRadius: 3,
  },
  modalTitle: {
    fontSize: FontSize.FONT_18,
    fontFamily: FontFamily.OutfitMedium,
    marginBottom: hp(2),
    color: '#000',
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    marginBottom: hp(2),
    alignItems: 'center',
  },
  userAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    marginRight: wp(3),
  },
  userName: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_15,
    color: Colors.black,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.greyText,
    fontFamily: FontFamily.OutfitRegular,
    fontSize: FontSize.FONT_14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp(10),
  },
  emptyText: {
    color: Colors.greyText,
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitRegular,
  },
};
