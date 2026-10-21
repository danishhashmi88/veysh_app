import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontWeight } from '../../../constant/fonts';

const CustomCalendar = ({
    selectedDate,
    onDateSelect,
    minDate,
    maxDate,
    markedDates,
}) => {
    const _markedDates = {
        ...markedDates,
        [selectedDate]: {
            ...(markedDates?.[selectedDate] || {}),
            selected: true,
            selectedColor: Colors.themeColor,
        },
    };

    return (
        <Calendar
            firstDay={1}
            minDate={minDate}
            maxDate={maxDate}
            hideExtraDays
            enableSwipeMonths
            onDayPress={(day) => onDateSelect && onDateSelect(day.dateString)}
            markedDates={_markedDates}
            renderHeader={(date) => (
                <Text style={styles.monthText}>{date.toString('MMMM yyyy')}</Text>
            )}
            theme={{
                calendarBackground: Colors.white,
                textSectionTitleColor: '#9CA3AF',
                dayTextColor: Colors.black,
                todayTextColor: Colors.themeColor,
                arrowColor: Colors.themeColor,
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textMonthFontWeight: FontWeight.FONT_600,
            }}
            style={styles.calendar}
            dayComponent={({ date, state }) => {
                const marking = _markedDates[date.dateString];
                const image = marking?.image;

                return (
                    <View style={styles.dayCell}>
                        <View style={styles.dayContent}>
                            <Text
                                style={[
                                    styles.dayText,
                                    state === 'disabled' && { color: '#D1D5DB' },
                                    selectedDate === date.dateString && styles.activeDayText,
                                ]}
                            >
                                {date.day}
                            </Text>
                            {image && (
                                <Image source={image} style={styles.dayImage} resizeMode="contain" />
                            )}
                        </View>
                    </View>
                );
            }}
        />
    );
};

export default CustomCalendar;

const styles = StyleSheet.create({
    calendar: {
        width: wp(90),
        marginBottom: hp(2),
    },
    monthText: {
        fontSize: 16,
        fontWeight: FontWeight.FONT_600,
        marginBottom: hp(1),
        color: Colors.black,
    },
    dayCell: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 14,
        color: Colors.black,
    },
    activeDayText: {
        color: Colors.themeColor,
        fontWeight: FontWeight.FONT_700,
    },
    dayContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayImage: {
        width: 20,
        height: 20,
        marginTop: 2,
    },
});
