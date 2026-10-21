import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { wp, hp } from '../../../../utils/helper';
import { OutfitFamily } from '../../../../constant/fonts';

const LineChart = ({ data = [], xKey, yKey, color }) => {
    const chartHeight = hp(22);
    const chartWidth = wp(80);
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const graphHeight = chartHeight - margin.top - margin.bottom;
    const graphWidth = chartWidth - margin.left - margin.right;

    const safeData = Array.isArray(data) ? data : [];

    if (safeData.length === 0) {
        return (
            <View style={[styles.container, { height: chartHeight, justifyContent: 'center' }]}>
                <Text style={{ fontSize: wp(3.8), color: '#71717A', textAlign: 'center', fontFamily: OutfitFamily.Regular }}>No data available</Text>
            </View>
        );
    }

    const maxValue = Math.max(...safeData.map(d => Number(d?.[yKey]) || 0), 5);
    const divisor = safeData.length > 1 ? safeData.length - 1 : 1;
    const points = safeData.map((item, index) => {
        const x = (index / divisor) * graphWidth;
        const val = Number(item?.[yKey]) || 0;
        const y = graphHeight - (val / maxValue) * graphHeight;
        return {
            x: isFinite(x) ? x : 0,
            y: isFinite(y) ? y : graphHeight,
        };
    });

    let pathD = '';
    if (points.length > 0) {
        pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }
    }

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={chartHeight}>
                <G x={margin.left} y={margin.top}>
                    {/* Grid lines */}
                    {[0, 0.5, 1].map((p, i) => (
                        <Line
                            key={i}
                            x1={0}
                            y1={graphHeight * (1 - p)}
                            x2={graphWidth}
                            y2={graphHeight * (1 - p)}
                            stroke="#F0F0F0"
                            strokeWidth={1}
                            strokeDasharray="4, 4"
                        />
                    ))}

                    {/* Path */}
                    {pathD.length > 0 && (
                        <Path
                            d={pathD}
                            fill="none"
                            stroke={color || '#FF9F1C'}
                            strokeWidth={3}
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Points */}
                    {points.map((p, i) => (
                        <G key={i}>
                            <Circle
                                cx={p.x}
                                cy={p.y}
                                r={4}
                                fill="white"
                                stroke={color || '#FF9F1C'}
                                strokeWidth={2}
                            />
                            <SvgText
                                x={p.x}
                                y={p.y - wp(3)}
                                fontSize={wp(2.8)}
                                fill="#555"
                                textAnchor="middle"
                                fontFamily={OutfitFamily.Regular}
                            >
                                {Number(safeData[i]?.[yKey] || 0)}
                            </SvgText>
                            <SvgText
                                x={p.x}
                                y={graphHeight + wp(6)}
                                fontSize={wp(3)}
                                fill="#999"
                                textAnchor="middle"
                                fontFamily={OutfitFamily.Regular}
                            >
                                {String(safeData[i]?.[xKey] || '')}
                            </SvgText>
                        </G>
                    ))}
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

export default LineChart;
