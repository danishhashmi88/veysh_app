import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { getGlobalStyles } from '../../GlobalStyles/GlobalStyles';
import { getStyles } from './styles';
import { imagePath } from '../../constant/imagePath';
import { useTheme } from '../../hooks/useTheme';

const FaqItem = ({ title = '', detail = '' }) => {
  const [showDetail, setShowDetail] = useState(false);
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  return (
    <View style={[styles.faqItem, GlobalStyle.shadowBox]}>
      <TouchableOpacity
        onPress={() => setShowDetail(!showDetail)}
        style={[styles.row]}
      >
        <Text style={styles.listTitle}>{title?.trim()}</Text>
        <Image
          source={imagePath.mini_arrow}
          resizeMode={'contain'}
          style={[styles.arrow(showDetail ? '0deg' : '180deg')]}
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
