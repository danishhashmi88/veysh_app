import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { Animated, TextInput, StyleSheet, Easing } from 'react-native';

const JiggleInput = forwardRef((props, ref) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState('');
  const [isError, setIsError] = useState(false);

  useImperativeHandle(ref, () => ({
    shake,
    getValue: () => text,
  }));

  const shake = () => {
    setIsError(true);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6, duration: 100, easing: Easing.bounce, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 100, easing: Easing.bounce, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 100, easing: Easing.bounce, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 100, easing: Easing.bounce, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, easing: Easing.bounce, useNativeDriver: true }),
    ]).start();
  };

  const handleTextChange = (val) => {
    if (isError && val.trim()) {
      setIsError(false);
    }
    setText(val);
    props.onChangeText?.(val);
  };

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      <TextInput
        {...props}
        value={text}
        onChangeText={handleTextChange}
        style={[
          styles.input,
          props.style,
          isError && styles.errorBorder,
        ]}
        placeholderTextColor={props.placeholderTextColor || '#999'}
      />
    </Animated.View>
  );
});

export default JiggleInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    height:60
  },
  errorBorder: {
    borderColor: 'red',
  },
});
