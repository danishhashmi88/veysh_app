import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../../constant/colors';
import { FontFamily, FontSize, FontWeight } from '../../../../constant/fonts';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 24,
    tintColor: Colors?.themeColor
  },
  title: {
    fontSize: FontSize.FONT_26,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    // fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
    fontFamily: FontFamily.OutfitMedium,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    width: width,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    width: '45%',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: FontWeight.FONT_600,
  },
});

export default styles;
