/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Image } from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, GaramondFamily } from '../../../constant/fonts';
import { setData, VISITED_ASSOCIATE_JOB } from '../../../utils/storage';
import { useDispatch } from 'react-redux';
import { setShowJobTutorial } from '../../../redux/slices/rootLoaderSlice';

const { width } = Dimensions.get('window');

const TutorialOverlay = ({ onFinish }) => {
  const dispatch = useDispatch();
  const translateX = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(0);

  useEffect(() => {
    animateLeft();
  }, []);

  const animateLeft = () => {
    translateX.setValue(0);
    Animated.timing(translateX, {
      toValue: -width * 0.3,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setStep(1);
        animateRight();
      }, 300);
    });
  };

  const animateRight = () => {
    translateX.setValue(0);
    Animated.timing(translateX, {
      toValue: width * 0.3,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(async() => {
        await setData(VISITED_ASSOCIATE_JOB,'visited');
        dispatch(setShowJobTutorial(false));
        onFinish?.();
      }, 300);
    });
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.textBox}>
        {step === 0 && <Text style={styles.text}>Swipe left to Reject</Text>}
        {step === 1 && <Text style={styles.text}> Swipe right to Accept</Text>}
      </View>

      <Animated.View style={[styles.finger, { transform: [{ translateX }] }]}>
        <Image
          source={imagePath.finger}
          style={{ width: 40, height: 40, resizeMode: 'contain', tintColor:Colors.white }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    gap:20,
  },
  textBox: {
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: FontSize.FONT_18,
    marginVertical: 8,
    fontFamily: GaramondFamily.Bold,
    letterSpacing:1,
  },
  finger: {
  },
});

export default TutorialOverlay;
