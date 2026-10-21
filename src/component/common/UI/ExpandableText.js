import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontFamily, FontSize, GaramondFamily } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';

const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const splitLines = text.split('\n');
    setLines(splitLines);
    if (splitLines.length > 5) {
      setShowToggle(true);
    }
  }, [text]);

  const displayedText = isExpanded ? lines : lines.slice(0, 5);

  return (
    <View>
      <Text style={styles.text}>
        {displayedText.join('\n')}
      </Text>

      {showToggle && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.toggle}>
            {isExpanded ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    subAddr: {
        fontSize: FontSize.FONT_14,
        color: Colors.secondaryDarkBlack,
        fontFamily: GaramondFamily.Bold,
    },
    toggle: {
        marginTop: 4,
        color: Colors.themeColor,
        fontFamily: GaramondFamily.Bold,
    },
});

export default ExpandableText;
