import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    Modal,
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight, GaramondFamily } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../Buttons/AppButton';
import { Calendar } from 'react-native-calendars';

const CalenderModal = forwardRef(({
    onPress = () => { },
    minDate,
    maxDate,
    currentDate
}, ref) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [visible, setVisible] = useState(false);
    const backgroundAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    const openModal = () => {
        setVisible(true);
        Animated.parallel([
            Animated.timing(backgroundAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeModal = () => {
        Animated.parallel([
            Animated.timing(backgroundAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false);
        });
    };

    useImperativeHandle(ref, () => ({
        open: openModal,
        close: closeModal,
    }));

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={closeModal}
        >
            <Animated.View style={[styles.outerModal, {
                backgroundColor: backgroundAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'],
                }),
            }]}>
                <Animated.View style={[styles.innerModal, {
                    transform: [{
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: [0, 300],
                        }),
                    }],
                }]}>
                    <View style={styles.topView}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>Duplicate Event</Text>
                            <Text style={styles.subtitle}>Select a date to duplicate the event.</Text>
                        </View>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Image source={imagePath.cross_} resizeMode="contain" style={styles.cross} />
                        </TouchableOpacity>
                    </View>

                    <Calendar
                        style={styles.calenderBody}
                        theme={{
                            backgroundColor: Colors.white,
                            calendarBackground: Colors.white,
                            textSectionTitleColor: '#9CA3AF',
                            selectedDayBackgroundColor: '#A855F7',
                            selectedDayTextColor: Colors.white,
                            todayTextColor: '#A855F7',
                            dayTextColor: Colors.black,
                            arrowColor: '#A855F7',
                            textMonthFontWeight: FontWeight.FONT_600,
                            textMonthFontSize: FontSize.FONT_16,
                            textDayHeaderFontSize: 12,
                            'stylesheet.calendar.header': {
                                header: {
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                },
                                monthText: {
                                    fontSize: FontSize.FONT_16,
                                    fontWeight: FontWeight.FONT_600,
                                    color: Colors.black,
                                },
                                arrow: {
                                    padding: 10,
                                },
                            },
                        }}
                        hideExtraDays={true}
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: '#A855F7' },
                        }}
                        minDate={minDate}
                        maxDate={maxDate}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={closeModal}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, !selectedDate && styles.disabledButton]}
                            disabled={!selectedDate}
                            onPress={() => {
                                if (selectedDate) {
                                    onPress(selectedDate);
                                }
                                closeModal();
                            }}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    innerModal: {
        width: wp(100),
        backgroundColor: Colors.white,
        borderTopLeftRadius: wp(4),
        borderTopRightRadius: wp(4),
        gap: hp(2),
        paddingVertical: hp(3),
    },
    outerModal: {
        flex: 1,
        backgroundColor: Colors.black_55_pee,
        justifyContent: 'flex-end',
    },
    cross: {
        width: wp(6),
        height: wp(6),
    },
    title: {
        fontSize: FontSize.FONT_18,
        fontFamily: GaramondFamily.Regular,
        color: Colors.black,
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: FontSize.FONT_14,
        color: Colors.graytext,
    },
    topView: {
        width: wp(90),
        alignSelf: 'center',
        marginBottom: hp(1),
    },
    closeButtonAbsolute: {
        position: 'absolute',
        top: hp(2),
        right: wp(5),
        zIndex: 10,
        padding: wp(2),
    },
    calenderBody: {
        width: wp(90),
        alignSelf: 'center',
        paddingBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: wp(90),
        alignSelf: 'center',
        gap: wp(3),
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingVertical: hp(2),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: Colors.white,
        fontSize: FontSize.FONT_16,
        fontFamily: GaramondFamily.Regular,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#A855F7',
        paddingVertical: hp(2),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#D1D5DB',
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: FontSize.FONT_16,
        fontFamily: "CormorantGaramond-Regular",
    },
});

export default CalenderModal;
