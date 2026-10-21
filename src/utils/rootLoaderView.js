import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import { Colors } from '../constant/colors';

const RootLoaderView = props => {
  const rootLoadingState = useSelector(state => state.rootLoader.rootLoadingState);

  return rootLoadingState ? (
    <View style={styles.container}>
      <ActivityIndicator
        size={'large'}
        color={Colors.themeColor}
      />
      {/* <LottieAnimation animationJson={lottiePath.loader} width={wp(20)} height={wp(20)} /> */}
    </View>
  ) : (
    <View />
  );
};

export default RootLoaderView;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#00000055',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
});
