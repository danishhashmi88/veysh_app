import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { imagePath } from '../../../constant/imagePath';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import { hp } from '../../../utils/helper';
import { getStyles } from './styles';
import { useTheme } from '../../../hooks/useTheme';

const FaqItem = ({ title = '', detail = '' }) => {
  const [showDetail, setShowDetail] = useState(false);
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  return (
    <View
      style={[
        styles.faqItem,
        {
          backgroundColor: showDetail ? Colors.zink100 : Colors.white,
          paddingVertical: showDetail ? hp(1) : 0,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => setShowDetail(!showDetail)}
        style={[styles.row, { paddingVertical: showDetail ? hp(0.5) : hp(2) }]}
      >
        <Text style={styles.listTitle}>{title?.trim()}</Text>
        <Image
          source={imagePath.arrow_down}
          resizeMode={'contain'}
          style={[styles.arrow(showDetail ? '180deg' : '0deg')]}
        />
      </TouchableOpacity>
      {showDetail && detail !== null && (
        <View style={styles.answereBox}>
          <Text style={styles.faqText}>{detail?.trim()}</Text>
        </View>
      )}
    </View>
  );
};

export default FaqItem;
