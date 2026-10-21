import { StyleSheet } from 'react-native';
// import { Colors } from '../../../../constant/colors';
import { hp, wp } from '../../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../../constant/fonts';

export const getStyles = (Colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    width: wp(90),
    alignSelf: 'center',
  },
  imageView: {
    width: wp(20),
    height: wp(20),
    backgroundColor: '#F5F5F5', // Use a milder light grey
    marginBottom: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(10), // Perfect circle
  },
  icon: {
    width: '55%',
    height: '55%',
    tintColor: Colors?.themeColor
  }
});
