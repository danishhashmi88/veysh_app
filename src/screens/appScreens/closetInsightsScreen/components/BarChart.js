import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, G, Text as SvgText } from 'react-native-svg';
import { wp, hp } from '../../../../utils/helper';
import { OutfitFamily } from '../../../../constant/fonts';

const BarChart = ({ data = [], xKey, yKey, color }) => {
    const chartHeight = hp(22);
    const chartWidth = wp(80);
    const labelSpace = wp(5);
    const margin = { top: labelSpace + wp(2), right: 10, bottom: 40, left: 10 };
    const graphHeight = chartHeight - margin.top - margin.bottom;
    const graphWidth = chartWidth - margin.left - margin.right;
    const plotHeight = graphHeight - labelSpace;

    const safeData = Array.isArray(data) ? data : [];

    if (safeData.length === 0) {
        return (
            <View style={[styles.container, { height: chartHeight, justifyContent: 'center' }]}>
                <Text style={{ fontSize: wp(3.8), color: '#71717A', textAlign: 'center', fontFamily: OutfitFamily.Regular }}>No data available</Text>
            </View>
        );
    }

    const maxValue = Math.max(...safeData.map(d => Number(d?.[yKey]) || 0), 5);
    const slotWidth = graphWidth / safeData.length;
    const barWidth = wp(4);

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={chartHeight}>
                <G x={margin.left} y={margin.top}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <Line
                            key={i}
                            x1={0}
                            y1={labelSpace + plotHeight * (1 - p)}
                            x2={graphWidth}
                            y2={labelSpace + plotHeight * (1 - p)}
                            stroke="#F0F0F0"
                            strokeWidth={1}
                            strokeDasharray="4, 4"
                        />
                    ))}

                    {/* Bars */}
                    {safeData.map((item, index) => {
                        const val = Number(item?.[yKey]) || 0;
                        const barHeight = Math.max((val / maxValue) * plotHeight, 0);
                        const x = slotWidth * index + (slotWidth - barWidth) / 2;
                        const y = labelSpace + plotHeight - barHeight;
                        const r = barWidth / 2;
                        const countLabelY = y - wp(1.5);

                        // Path with rounded top corners
                        const barPath = barHeight > 0
                            ? `M ${x},${labelSpace + plotHeight} L ${x},${y + r} Q ${x},${y} ${x + r},${y} Q ${x + barWidth},${y} ${x + barWidth},${y + r} L ${x + barWidth},${labelSpace + plotHeight} Z`
                            : '';

                        return (
                            <G key={index}>
                                {barHeight > 0 && (
                                    <Path
                                        d={barPath}
                                        fill={color || '#4ECDC4'}
                                    />
                                )}
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={barHeight > 0 ? countLabelY : labelSpace + plotHeight - wp(1)}
                                    fontSize={wp(3)}
                                    fill="#333"
                                    textAnchor="middle"
                                    fontFamily={OutfitFamily.Regular}
                                >
                                    {String(val)}
                                </SvgText>
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={labelSpace + plotHeight + wp(6)}
                                    fontSize={wp(3)}
                                    fill="#999"
                                    textAnchor="middle"
                                    fontFamily={OutfitFamily.Regular}
                                >
                                    {String(item?.[xKey] || '')}
                                </SvgText>
                            </G>
                        );
                    })}
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
});

export default BarChart;
