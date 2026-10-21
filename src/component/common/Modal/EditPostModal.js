import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';
import { wp } from '../../../utils/helper';
import { FontFamily, FontSize } from '../../../constant/fonts';

const EditPostModal = ({ visible, onClose, onEdit, onDelete, postDetail }) => {
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
              onEdit(postDetail);
            }}
          >
            <View style={styles.iconWrapper}>
              <Image source={imagePath.edit_pen} style={styles.imageIcon} />
            </View>
            <Text style={styles.actionText}>Edit Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              onClose();
              onDelete(postDetail);
            }}
          >
            <View style={styles.iconWrapper}>
              <Image source={imagePath.del} style={styles.deleteIcon} />
            </View>
            <Text style={[styles.actionText]}>Delete Post</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default EditPostModal;
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
    paddingVertical: 15,
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
    width: wp(6.2),
    height: wp(6.3),
    tintColor: Colors?.primaryBlue,
  },
  deleteIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
    tintColor: Colors?.primaryBlue,
  },
});
