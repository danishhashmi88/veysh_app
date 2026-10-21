/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    Animated,
    Dimensions,
    Pressable,
    Text,
} from 'react-native';
import { Colors } from '../../../constant/colors';
import { FontSize, FontWeight } from '../../../constant/fonts';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';

const GlobalStyle = getGlobalStyles(Colors);


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH * 0.9;
const THUMB_SIZE = 20;
const SLIDER_HEIGHT = 8;

const CustomSlider = ({
    value = 1,
    onValueChange,
    minimumValue = 1,
    maximumValue = 11,
    customstyle = {},
    title = 'Distance to serve',
    valueText = 'mile',
    showAllValues = true,
}) => {
    const totalSteps = maximumValue - minimumValue;
    const [sliderValue, setSliderValue] = useState(value);

    const stepWidth = (SLIDER_WIDTH - THUMB_SIZE) / totalSteps;
    const panX = useRef(new Animated.Value(0)).current;
    const initialTouchX = useRef(0);
    const trackRef = useRef(null);

    const getXForValue = (val) => (val - minimumValue) * stepWidth;
    const getValueForX = (x) =>
        Math.round(x / stepWidth) + minimumValue;

    useEffect(() => {
        const initialX = getXForValue(value);
        panX.setValue(initialX);
        setSliderValue(value);
    }, [value, minimumValue, maximumValue]);

    const snapToNearestStep = (x) => {
        let clampedX = Math.max(0, Math.min(x, SLIDER_WIDTH - THUMB_SIZE));
        let snappedValue = getValueForX(clampedX);
        let finalX = getXForValue(snappedValue);

        Animated.timing(panX, {
            toValue: finalX,
            duration: 100,
            useNativeDriver: false,
        }).start();

        if (snappedValue !== sliderValue) {
            setSliderValue(snappedValue);
            onValueChange?.(snappedValue);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                panX.stopAnimation((val) => {
                    initialTouchX.current = val;
                });
            },
            onPanResponderMove: (_, gestureState) => {
                let newX = initialTouchX.current + gestureState.dx;
                let clampedX = Math.max(0, Math.min(newX, SLIDER_WIDTH - THUMB_SIZE));
                panX.setValue(clampedX);

                const value = getValueForX(clampedX);
                setSliderValue(value);
                // onValueChange?.(value);
            },
            onPanResponderRelease: (_, gestureState) => {
                let newX = initialTouchX.current + gestureState.dx;
                snapToNearestStep(newX);
            },
        })
    ).current;

    const handleTrackPress = (event) => {
        trackRef.current?.measure((fx, fy, width, height, px, py) => {
            const touchX = event.nativeEvent.pageX - px;
            snapToNearestStep(touchX);
        });
    };

    const fillWidth = panX.interpolate({
        inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        extrapolate: 'clamp',
    });

    const thumbTranslateX = panX.interpolate({
        inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
        extrapolate: 'clamp',
    });

    return (
        <View>
            <View style={styles.distanceTextView}>
                <Text style={styles.sliderTitle}>{title}</Text>
                {
                    showAllValues ?
                        <Text style={styles.sliderValue}>{sliderValue} {sliderValue === 1 ? valueText : `${valueText}s`}</Text> :
                        <Text style={styles.sliderValue}>{sliderValue <= 10 ? sliderValue : '10+'} {sliderValue === 1 ? valueText : `${valueText}s`}</Text>
                }
            </View>
            <Pressable onPress={handleTrackPress}>
                <View style={[styles.container, customstyle]} ref={trackRef}>
                    <View style={styles.track} />
                    <Animated.View
                        style={[
                            styles.trackFilled,
                            {
                                width: fillWidth,
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            GlobalStyle.shadowBox,
                            styles.thumb,
                            {
                                transform: [{ translateX: thumbTranslateX }],
                            },
                        ]}
                        {...panResponder.panHandlers}
                    />
                </View>
            </Pressable>
        </View>
    );
};
// const CustomSlider = ({
//     value = 1,
//     onValueChange,
//     minimumValue = 1,
//     maximumValue = 11,
//     customstyle = {}
// }) => {
//     const range = maximumValue - minimumValue;
//     const [sliderValue, setSliderValue] = useState(value);

//     const panX = useRef(new Animated.Value(0)).current;
//     const initialTouchX = useRef(0);
//     const trackRef = useRef(null);

//     const getXForValue = (val) => ((val - minimumValue) / range) * SLIDER_WIDTH;
//     const getValueForX = (x) => Math.round((x / SLIDER_WIDTH) * range + minimumValue);

//     useEffect(() => {
//         const initialX = getXForValue(value);
//         panX.setValue(initialX);
//         setSliderValue(value);
//     }, [value, minimumValue, maximumValue]);

//     const updateSliderAtX = (x) => {
//         let newX = Math.max(0, Math.min(SLIDER_WIDTH, x));
//         const newVal = getValueForX(newX);
//         panX.setValue(newX);
//         setSliderValue(newVal);
//         onValueChange?.(newVal);
//     };

//     const panResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onPanResponderGrant: () => {
//                 panX.stopAnimation((val) => {
//                     initialTouchX.current = val;
//                 });
//             },
//             onPanResponderMove: (_, gestureState) => {
//                 let newX = initialTouchX.current + gestureState.dx;
//                 if(newX > 0){
//                     console.log(newX,'newX');
//                     updateSliderAtX(newX);
//                 }
//             },
//             onPanResponderRelease: () => {
//                 panX.flattenOffset();
//             },
//         })
//     ).current;

//     const fillWidth = panX.interpolate({
//         inputRange: [0, SLIDER_WIDTH],
//         outputRange: [0, SLIDER_WIDTH],
//         extrapolate: 'clamp',
//     });

//     const thumbTranslateX = panX.interpolate({
//         inputRange: [0, SLIDER_WIDTH],
//         outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
//         extrapolate: 'clamp',
//     });

//     const handleTrackPress = (event) => {
//         trackRef.current?.measure((fx, fy, width, height, px, py) => {
//             const touchX = event.nativeEvent.pageX - px;
//             updateSliderAtX(touchX);
//         });
//     };

//     return (
//         <Pressable onPress={handleTrackPress}>
//             <View style={[styles.container, customstyle]} ref={trackRef}>
//                 <View style={styles.track} />
//                 <Animated.View
//                     style={[
//                         styles.trackFilled,
//                         {
//                             width: fillWidth,
//                         },
//                     ]}
//                 />
//                 <Animated.View
//                     style={[
//                         GlobalStyle.shadowBox,
//                         styles.thumb,
//                         {
//                             transform: [{ translateX: thumbTranslateX }],
//                         },
//                     ]}
//                     {...panResponder.panHandlers}
//                 />
//             </View>
//         </Pressable>
//     );
// };

const styles = StyleSheet.create({
    container: {
        width: SLIDER_WIDTH,
        // height: THUMB_SIZE * 1.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        marginBottom: 10,
        marginTop: 8
    },
    track: {
        height: SLIDER_HEIGHT - 1.5,
        borderRadius: SLIDER_HEIGHT / 2,
        backgroundColor: Colors.black,
        width: '100%',
        position: 'absolute',
    },
    trackFilled: {
        height: SLIDER_HEIGHT - 1.5,
        borderTopLeftRadius: SLIDER_HEIGHT / 2,
        borderBottomLeftRadius: SLIDER_HEIGHT / 2,
        backgroundColor: Colors.black,
        position: 'absolute',
    },
    thumb: {
        position: 'absolute',
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: Colors.black,
        borderWidth: 3,
        borderColor: 'white',
        // left: -10,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    distanceTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SLIDER_WIDTH,
        paddingBottom: 10,
    },
    sliderTitle: {
        fontSize: FontSize.FONT_16,
        fontWeight: FontWeight.FONT_700,
        color: Colors.black,
    },
    sliderValue: {
        fontSize: FontSize.FONT_12,
        fontWeight: FontWeight.FONT_400,
        color: Colors.black,
    },
});

export default CustomSlider;
