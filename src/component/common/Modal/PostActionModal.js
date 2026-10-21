import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../Buttons/AppButton';
import { FontFamily, FontSize } from '../../../constant/fonts';

const PostActionModal = ({
  showOptions,
  setShowOptions,
  selectedPost,
  setSelectedPost,
  onBlockpress,
}) => {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  // Reset confirm modal when main closes
  useEffect(() => {
    if (!showOptions) {
      setShowBlockConfirm(false);
    }
  }, [showOptions]);

  return (
    <>
      {/* TOP MODAL */}
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
          <TouchableOpacity>
            <View style={styles.actionModalbox}>
              <Image
                source={imagePath?.reportIcon}
                style={styles.commentAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetText}>Report</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowOptions(false);
              setTimeout(() => {
                setShowBlockConfirm(true);
              }, 400);
            }}
          >
            <View style={styles.actionModalbox}>
              <Image
                source={imagePath?.blockIcon}
                style={styles.commentAvatar}
              />
              <Text style={[styles.sheetText, styles.blockText]}>Block</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* CONFIRM BLOCK MODAL */}
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
              <AppButton
                style={styles.noBtn}
                onPress={() => {
                  setShowBlockConfirm(false);
                }}
              >
                <Text style={styles.noText}>No</Text>
              </AppButton>

              <AppButton
                style={styles.yesBtn}
                onPress={() => {
                  setShowBlockConfirm(false);
                  setTimeout(() => {
                    onBlockpress();
                  }, 400);
                }}
              >
                <Text style={styles.yesText}>Yes, Block</Text>
              </AppButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PostActionModal;

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingBottom: 20,
  },

  sheetItem: {
    paddingVertical: 16,
    alignItems: 'center',
  },

  sheetText: {
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily?.OutfitRegular,
    color: '#000',
  },

  blockText: {
    color: '000',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  actionModalbox: {
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    height: 60,
    marginTop: 10,
    borderRadius: 10,
    paddingLeft: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Essential to clip the BlurView
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },

  blockIcon: {
    marginBottom: 10,
  },

  blockTitle: {
    fontSize: 18,
    // fontWeight: '600',
    marginTop: 10,
    fontStyle: 'semi-bold',
  },

  blockSub: {
    // fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'regular',
  },

  blockActions: {
    flexDirection: 'row',
    marginTop: 15,
  },

  noBtn: {
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#000',
    marginRight: 10,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  yesBtn: {
    paddingVertical: 10,
    // paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: '#7B5CFA',
    width: '40%',
    alignItems: 'center',
  },

  noText: {
    color: '#fff',
  },

  yesText: {
    color: '#fff',
  },
});
