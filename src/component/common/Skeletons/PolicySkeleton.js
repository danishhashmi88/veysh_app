import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constant/colors';
import { wp } from '../../../utils/helper';

const PolicySkeleton = () => {
    return (
        <View style={[styles.skeletonBody]}>
            <SkeletonPlaceholder highlightColor={'#F5F5F5'} backgroundColor={'#E8E8E8'} borderRadius={4}>
                <SkeletonPlaceholder.Item width={wp(60)} height={40} />
                <SkeletonPlaceholder.Item marginTop={30} width={wp(90)} height={80} />
                <SkeletonPlaceholder.Item marginTop={25} width={wp(60)} height={30} />
                <SkeletonPlaceholder.Item marginTop={14} width={wp(90)} height={80} />
                <SkeletonPlaceholder.Item marginTop={25} width={wp(60)} height={30} />
                <SkeletonPlaceholder.Item marginTop={14} width={wp(90)} height={80} />
                <SkeletonPlaceholder.Item marginTop={25} width={wp(60)} height={30} />
                <SkeletonPlaceholder.Item marginTop={14} width={wp(90)} height={80} />
                <SkeletonPlaceholder.Item marginTop={25} width={wp(60)} height={30} />
                <SkeletonPlaceholder.Item marginTop={14} width={wp(90)} height={80} />
            </SkeletonPlaceholder>
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonBody: {
        borderRadius: 10,
        marginTop: 20,
        width: wp(90),
        backgroundColor: '#FFFFFF',
    },
});

export default PolicySkeleton;
