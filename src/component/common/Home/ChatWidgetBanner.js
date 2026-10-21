import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../../../utils/helper';
import { imagePath } from '../../../constant/imagePath';

const ChatWidgetBanner = ({ styles, handleNavigation, chatText }) => {
  const [inputText, setInputText] = useState('');
  const pulse = useSharedValue(0);

  useEffect(() => {
    // Continuous "breathing" pulse to keep drawing the eye to the CTA.
    // Yoyo repeat (reverse = true) + sine easing = perfectly smooth, no stutter.
    pulse.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [pulse]);

  const ctaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.65 + pulse.value * 0.35,
    transform: [{ scale: 1 + pulse.value * 0.06 }],
  }));

  const handleSend = () => {
    const finalMessage = inputText.trim() || chatText;
    console.log("finalMessage", finalMessage)
    handleNavigation('AiHomeScreen', { initialMessage: finalMessage });
    setInputText('');
  };

  return (
    <Animated.View style={[styles.baeBanner, ctaAnimatedStyle]}>
      <View style={styles.baeGradient}>
        <View style={styles.baeBadge}>
          <Image
            source={imagePath.bae}
            style={{ height: hp(3.3), width: wp(13) }}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.baeTextContainer, { flex: 1 }]}>
          <TextInput
            style={[styles.baeMainText, { paddingVertical: 0 }]}
            placeholder={chatText || 'What should I wear to the party tonight?'}
            placeholderTextColor={StyleSheet.flatten(styles.baeMainText)?.color}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>
        <TouchableOpacity style={styles.baeActionButton} onPress={handleSend}>
          <LinearGradient
            colors={['#F116A5', '#7100D7']}
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: wp(10),
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Image source={imagePath.rightarrow} style={styles.baeActionIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ChatWidgetBanner;
