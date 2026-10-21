import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { StyleSheet, View } from 'react-native';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import { useTheme } from '../../../hooks/useTheme';
import { wp } from '../../../utils/helper';
import { Colors as StaticColors } from '../../../constant/colors';

const FaqSkeleton = () => {
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  return (
    <View style={[GlobalStyle.shadowBox, styles.skeletonBody]}>
      <SkeletonPlaceholder
        highlightColor={Colors.themeColor}
        backgroundColor={Colors.lightThemeColor}
        borderRadius={4}
      >
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item width={wp(60)} height={30} />
          <SkeletonPlaceholder.Item width={25} height={25} borderRadius={100} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

const getStyles = DynamicColors =>
  StyleSheet.create({
    skeletonBody: {
      paddingHorizontal: 14,
      paddingVertical: 20,
      borderRadius: 12,
      backgroundColor: DynamicColors?.white || StaticColors.white,
      marginTop: 10,
      width: wp(90),
      alignSelf: 'center',
    },
  });

export default FaqSkeleton;
