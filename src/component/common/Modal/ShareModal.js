import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Share,
} from 'react-native';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';
import { buildSharePostUrl, wp } from '../../../utils/helper';
import { FontFamily, FontSize } from '../../../constant/fonts';

const ShareModal = ({ visible, onClose, postDetail }) => {
  const onShare = async data => {
    try {
      const shareUrl = buildSharePostUrl(data?._id);
      const messageText = `Check this out on Veysh!`;
      const shareMessage = `${messageText}\n\n${shareUrl}`;

      await Share.share({
        message: shareMessage,
        url: shareUrl,
      });
    } catch (error) {
      if (error?.message !== 'User did not share') {
        console.log('Share error:', error);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              onClose();
              setTimeout(() => {
                onShare(postDetail);
              }, 400);
            }}
          >
            <View style={styles.iconWrapper}>
              <Image source={imagePath.plus_icon} style={styles.deleteIcon} />
            </View>
            <Text style={[styles.actionText]}>Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ShareModal;
const styles = StyleSheet.create({
  iconWrapper: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.cardBg,
    margin: 10,
    borderRadius: 12,
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
  },
  actionText: {
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily?.OutfitRegular,
    color: '#000',
    paddingLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 20,
  },
  imageIcon: {
    width: wp(7),
    height: wp(7),
    tintColor: Colors?.primaryBlue,
  },
  deleteIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
    tintColor: Colors?.primaryBlue,
  },
});
