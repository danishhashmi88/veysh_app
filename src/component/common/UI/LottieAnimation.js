import React from 'react';
import LottieView from 'lottie-react-native';
import { lottiePath } from '../../../constant/lottiePath';
import {wp} from '../../../utils/helper'

export default function LottieAnimation({animationJson = lottiePath.maintainance, height = wp(70), width = wp(70)}) {
  return (
    <LottieView
        source={animationJson}
        autoPlay={true}
        loop={true}
        style={{width:width,height:height}}
    />
  );
}