import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { wp, hp } from '../../../../utils/helper';
import { OutfitFamily } from '../../../../constant/fonts';
import { CHART_PALETTE } from '../../../../constant/colors';

const SEGMENT_GAP = 4;

const DonutChart = ({ data = [], colors = CHART_PALETTE }) => {
    const size = wp(44);
    const strokeWidth = wp(7);
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const safeData = Array.isArray(data) ? data : [];
    const total = safeData.reduce((acc, curr) => acc + (Number(curr?.count) || 0), 0);

    const segments = useMemo(() => {
        let currentOffset = 0;

        return safeData.map((item, index) => {
            const count = Number(item?.count) || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const rawDashLength = (count / total) * circumference;
            const dashLength = Math.max(rawDashLength - SEGMENT_GAP, 0);
            const offset = currentOffset;
            currentOffset += rawDashLength;

            return {
                index,
                count,
                percentage,
                name: item?.categoryTitle || item?.name || 'Other',
                dashLength,
                offset,
                color: colors[index % colors.length] || '#ccc',
            };
        });
    }, [safeData, total, circumference, colors]);

    const sortedLegend = useMemo(
        () => [...segments].sort((a, b) => b.count - a.count),
        [segments],
    );

    if (safeData.length === 0 || total === 0) {
        return (
            <View style={[styles.container, styles.emptyState]}>
                <Text style={styles.emptyText}>No data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.chartWrapper, { width: size, height: size }]}>
                <Svg width={size} height={size}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#F0F1F5"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <G rotation="-90" origin={`${center}, ${center}`}>
                        {segments.map(segment => (
                            <Circle
                                key={`segment-${segment.index}`}
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segment.dashLength} ${circumference}`}
                                strokeDashoffset={-segment.offset}
                                fill="transparent"
                                strokeLinecap="round"
                            />
                        ))}
                    </G>
                </Svg>

                <View style={styles.centerHub} pointerEvents="none">
                    <Text style={styles.centerTotal}>{total}</Text>
                    <Text style={styles.centerLabel}>Total Items</Text>
                </View>
            </View>

            <View style={styles.legendList}>
                {sortedLegend.map(segment => (
                    <View key={`legend-${segment.index}`} style={styles.legendRow}>
                        <View style={styles.legendTopRow}>
                            <View style={styles.legendLeft}>
                                <View
                                    style={[styles.colorDot, { backgroundColor: segment.color }]}
                                />
                                <Text style={styles.legendName} numberOfLines={1}>
                                    {segment.name}
                                </Text>
                            </View>
                            <View style={styles.legendRight}>
                                <Text style={styles.legendCount}>{segment.count}</Text>
                                <Text style={styles.legendPercent}>
                                    {segment.percentage.toFixed(0)}%
                                </Text>
                            </View>
                        </View>
                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${segment.percentage}%`,
                                        backgroundColor: segment.color,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    emptyState: {
        height: wp(35),
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: wp(3.8),
        color: '#71717A',
        textAlign: 'center',
        fontFamily: OutfitFamily.Regular,
    },
    chartWrapper: {
        position: 'relative',
        alignSelf: 'center',
        marginBottom: hp(2.5),
    },
    centerHub: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerTotal: {
        fontSize: wp(8),
        color: '#1A1A1A',
        fontFamily: OutfitFamily.Bold,
        lineHeight: wp(9),
    },
    centerLabel: {
        fontSize: wp(3),
        color: '#71717A',
        fontFamily: OutfitFamily.Regular,
        marginTop: hp(0.2),
    },
    legendList: {
        width: '100%',
        paddingHorizontal: wp(1),
    },
    legendRow: {
        marginBottom: hp(1.6),
    },
    legendTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(0.6),
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: wp(3),
    },
    colorDot: {
        width: wp(2.8),
        height: wp(2.8),
        borderRadius: wp(1.4),
        marginRight: wp(2.5),
    },
    legendName: {
        flex: 1,
        fontSize: wp(3.6),
        color: '#333',
        fontFamily: OutfitFamily.Medium,
    },
    legendRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    legendCount: {
        fontSize: wp(3.6),
        color: '#1A1A1A',
        fontFamily: OutfitFamily.Bold,
        minWidth: wp(4),
        textAlign: 'right',
    },
    legendPercent: {
        fontSize: wp(3.2),
        color: '#71717A',
        fontFamily: OutfitFamily.Regular,
        minWidth: wp(8),
        textAlign: 'right',
    },
    progressTrack: {
        height: hp(0.55),
        backgroundColor: '#F0F1F5',
        borderRadius: hp(0.3),
        overflow: 'hidden',
        marginLeft: wp(5.3),
    },
    progressFill: {
        height: '100%',
        borderRadius: hp(0.3),
        minWidth: 2,
    },
});

export default DonutChart;
