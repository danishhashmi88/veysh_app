import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import { imagePath } from '../../../constant/imagePath';
import { hp, wp, toSafeString } from '../../../utils/helper';
// import { Colors } from "../../../constant/colors";
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../constant/fonts';
import { useTheme } from '../../../hooks/useTheme';

const LabelInput = React.forwardRef(({
  editable = true,
  clickable = false,
  style = {},
  secureTextEntry = false,
  keyboardType = 'default',
  errorText = '',
  showToggleIcon = true,
  placeholder = 'Email',
  value = '',
  width = '100%',
  onBlur = () => { },
  title = 'Email',
  onChangeText = () => { },
  showTitle = true,
  required = false,
  onRightIconPress = () => { },
  showRightIcon = false,
  rightIcon = imagePath.email,
  maxLength = 10000,
  tintColor = '',
  marginTop = hp(1.5),
  marginBottom = hp(0),
  phoneInputMarginTop = hp(0),
  inputHeight = hp(6),
  multiline = false,
  centerAlign = true,
  usePassValidation = false,
  type = 'input',
  useLoader = false,
  useWidthInput = false,
  borderRadius = wp(3),
  inputContainerWidth = wp(90),
  titleFont = FontSize.FONT_14,
  inputStyle,
  onSubmitEditing,
  titleStyle,
  showLeftIcon = false,
  leftIcon,
  onFocus = () => {},
}, ref) => {
  const Colors = useTheme();
  const [showPass, setShowPass] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const GlobalStyle = useMemo(() => getGlobalStyles(Colors), [Colors]);
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const safeValue =
    value == null
      ? ''
      : typeof value === 'string'
        ? value
        : typeof value === 'number' && !Number.isNaN(value)
          ? String(value)
          : '';
  const safeErrorText = toSafeString(errorText);

  const renderInput = (
    <View
      style={[
        styles.phoneInputView,
        {
          width: width,
          marginTop: phoneInputMarginTop,
          height: inputHeight,
          alignItems: centerAlign ? 'center' : 'flex-start',
          borderRadius: borderRadius,
        },
        inputStyle,
      ]}
    >
      {showLeftIcon && (
        <Image
          source={leftIcon}
          style={[styles.leftIcon, { opacity: 1 }]}
          resizeMode="contain"
        />
      )}
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={Colors.graytext}
        style={[
          styles.input,
          multiline && {
            paddingTop: hp(1.5),
            textAlignVertical: 'top',
            height: '100%',
          },
        ]}
        onChangeText={inpVal => onChangeText(inpVal)}
        value={safeValue}
        keyboardType={keyboardType}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={showPass}
        editable={editable}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        onFocus={() => {
          setIsFocused(true);
          onFocus();
        }}
        multiline={secureTextEntry ? false : multiline}
        maxLength={maxLength}
        autoCapitalize={
          secureTextEntry || keyboardType === 'email-address'
            ? 'none'
            : 'sentences'
        }
        autoCorrect={!secureTextEntry}
        spellCheck={!secureTextEntry}
        autoComplete={secureTextEntry ? 'off' : 'email'}
        textContentType={secureTextEntry ? 'password' : 'none'}
      />
      {useLoader ? (
        <ActivityIndicator size={20} color={Colors.themeColor} />
      ) : (
        !secureTextEntry &&
        showRightIcon && (
          <Image source={rightIcon} style={[styles.passIcon, { opacity: 1 }]} />
        )
      )}
      {secureTextEntry && showToggleIcon && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Image
            source={!showPass ? imagePath.closeEye : imagePath.eye}
            style={[styles.passIcon, { opacity: 0.5 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View>
      {type === 'input' ? (
        <View
          style={[
            {
              width: inputContainerWidth,
              marginTop: marginTop,
              alignSelf: 'center',
              marginBottom: marginBottom,
            },
            style,
          ]}
        >
          {showTitle && (
            <Text
              style={[styles.inputTitle, { fontSize: titleFont }, titleStyle]}
            >
              {title}
              {required ? <Text style={styles.requiredMark}> *</Text> : null}
            </Text>
          )}
          {renderInput}
          {safeErrorText ? (
            <Text style={GlobalStyle.errorText}>{safeErrorText}</Text>
          ) : null}
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRightIconPress}
          style={[
            {
              width: wp(90),
              marginTop: marginTop,
              alignSelf: 'center',
              marginBottom: marginBottom,
            },
            style,
          ]}
        >
          {showTitle && (
            <Text style={styles.inputTitle}>
              {title}
              {required ? <Text style={styles.requiredMark}> *</Text> : null}
            </Text>
          )}
          <View
            style={[
              styles.phoneInputView,
              {
                width: width,
                marginTop: phoneInputMarginTop,
                height: inputHeight,
                paddingHorizontal: wp(5),
                borderRadius: borderRadius,
              },
            ]}
          >
            <Text
              style={[
                styles.smalltext,
                { color: safeValue ? Colors.blackVar2 : Colors.graytext },
              ]}
            >
              {safeValue || placeholder}
            </Text>
            <Image
              source={rightIcon}
              style={styles.passIcon}
              tintColor={tintColor}
              resizeMode="contain"
            />
          </View>
          {safeErrorText ? (
            <Text style={GlobalStyle.errorText}>{safeErrorText}</Text>
          ) : null}
        </TouchableOpacity>
      )}
    </View>
  );
});

export const getStyles = Colors =>
  StyleSheet.create({
    inputTitle: {
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.blackVar2,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.8),
    },
    requiredMark: {
      color: Colors.red600,
      fontFamily: FontFamily.OutfitMedium,
    },
    phoneInputView: {
      backgroundColor: Colors.background,
      alignSelf: 'center',
      height: hp(6),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(5),
      overflow: 'visible',
    },
    input: {
      flex: 1,
      color: Colors.black,
      fontSize: FontSize.FONT_14,
      textAlignVertical: 'center',
      includeFontPadding: false,
      fontFamily: OutfitFamily.Regular,
    },
    smalltext: {
      flex: 1,
      color: Colors.black,
      fontSize: FontSize.FONT_15,
      fontFamily: OutfitFamily.Regular,
    },
    passIcon: {
      width: 25,
      height: 25,
    },
    leftIcon: {
      width: 20,
      height: 20,
      marginRight: wp(3),
    },
  });

export default LabelInput;
