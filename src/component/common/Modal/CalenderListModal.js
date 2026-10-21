import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import CustomCalendar from '../../../component/common/Calendar/CustomCalendar';

import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, GaramondFamily } from '../../../constant/fonts';
import AppButton from '../Buttons/AppButton';

const CalendarListModal = forwardRef(
  ({ onPress = () => { }, minDate, maxDate, markedDates }, ref) => {
    const [visible, setVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const bgAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    const open = () => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const close = () => {
      Animated.parallel([
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    };

    useImperativeHandle(ref, () => ({ open, close }));

    return (
      <Modal transparent visible={visible} animationType="fade">
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: bgAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.container,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, 300],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.title}>Select Date</Text>

            <CustomCalendar
              minDate={minDate}
              maxDate={maxDate}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              markedDates={markedDates}
            />

            <AppButton
              title="Submit"
              width={wp(90)}
              disabled={!selectedDate}
              onPress={() => {
                onPress(selectedDate);
                close();
              }}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
);

export default CalendarListModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.FONT_18,
    fontFamily: GaramondFamily.Regular,
    marginBottom: hp(2),
  },

});
