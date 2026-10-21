import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FontSize, FontWeight, OutfitFamily } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';
import AppButton from '../Buttons/AppButton';

const DISCLOSURE_POINTS = [
  'Your profile details used for styling (such as gender, body type, hair color, complexion, and measurements if provided)',
  'Up to 20 closet items as text metadata (item name, category, colors, fabric, occasion, season) — not item photos',
  'Up to 5 saved outfits (name and occasion)',
  'Your question or request text when you chat with Bae',
  'For automated daily outfit suggestions: gender, today’s date, and closet item metadata (name/category)',
];

const AiDataConsentModal = ({ visible, onAccept, onDecline }) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDecline}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>AI styling & data sharing</Text>
          <Text style={styles.subtitle}>
            Bae uses a third-party AI service to create outfit and styling
            suggestions. Please review and consent before continuing.
          </Text>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.sectionLabel}>Who receives your data</Text>
            <Text style={styles.body}>
              OpenAI (api.openai.com), via our secure servers, only for styling
              and outfit suggestions.
            </Text>

            <Text style={styles.sectionLabel}>What data is shared</Text>
            {DISCLOSURE_POINTS.map(point => (
              <View key={point} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}

            <Text style={styles.footerNote}>
              Closet photos are not sent to OpenAI in styling chat. You can stop
              using Bae anytime. Details are also described in our Privacy
              Policy.
            </Text>
          </ScrollView>

          <View style={styles.buttonColumn}>
            <AppButton
              title="Agree & continue"
              onPress={onAccept}
              width={wp(90)}
              marginBottom={hp(1.2)}
            />
            <TouchableOpacity
              style={styles.declineButton}
              onPress={onDecline}
              activeOpacity={0.8}
            >
              <Text style={styles.declineText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContainer: {
      width: wp(100),
      maxHeight: hp(88),
      backgroundColor: Colors.white,
      borderTopLeftRadius: wp(8),
      borderTopRightRadius: wp(8),
      paddingHorizontal: wp(5),
      paddingTop: hp(3),
      paddingBottom: hp(4),
    },
    title: {
      fontFamily: OutfitFamily.SemiBold,
      fontSize: FontSize.FONT_18,
      fontWeight: FontWeight.FONT_700,
      color: Colors.blackVar2 || Colors.black,
      marginBottom: hp(1),
    },
    subtitle: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_13,
      color: Colors.graytext || Colors.grey,
      lineHeight: 20,
      marginBottom: hp(1.5),
    },
    scroll: {
      maxHeight: hp(48),
      marginBottom: hp(1.5),
    },
    sectionLabel: {
      fontFamily: OutfitFamily.Medium,
      fontSize: FontSize.FONT_14,
      fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2 || Colors.black,
      marginTop: hp(1),
      marginBottom: hp(0.6),
    },
    body: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_13,
      color: Colors.blackVar2 || Colors.black,
      lineHeight: 20,
      marginBottom: hp(0.5),
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: hp(0.8),
      paddingRight: wp(1),
    },
    bullet: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_13,
      color: Colors.blackVar2 || Colors.black,
      marginRight: wp(2),
      lineHeight: 20,
    },
    bulletText: {
      flex: 1,
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_13,
      color: Colors.blackVar2 || Colors.black,
      lineHeight: 20,
    },
    footerNote: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_12,
      color: Colors.graytext || Colors.grey,
      lineHeight: 18,
      marginTop: hp(1),
      marginBottom: hp(1),
    },
    buttonColumn: {
      alignItems: 'center',
    },
    declineButton: {
      paddingVertical: hp(1.2),
      alignItems: 'center',
      width: wp(90),
    },
    declineText: {
      fontFamily: OutfitFamily.Medium,
      fontSize: FontSize.FONT_14,
      color: Colors.graytext || Colors.grey,
      fontWeight: FontWeight.FONT_600,
    },
  });

export default AiDataConsentModal;
