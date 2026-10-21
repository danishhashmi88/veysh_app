import { StyleSheet, Platform, StatusBar } from "react-native";
import { Colors } from "../../../constant/colors";
import { hp, wp } from "../../../utils/helper";
import { FontSize, FontWeight, FontFamily, OutfitFamily } from "../../../constant/fonts";

export const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: Colors.white
  },
  headerView: {
    gap: hp(1),
    alignSelf: 'center'
  },
  title: {
    fontSize: FontSize.FONT_20,
    fontWeight: FontWeight.FONT_700,
    color: Colors.black,
  },
  description: {
    color: Colors.zink500,
    fontSize: FontSize.FONT_14,
    width: wp(90),
  },
  inner: {
    flex: 1,
    paddingHorizontal: wp(6),
  },
  innerItem: {
    gap: hp(2),
    marginTop: hp(2)
  },
  helpCard: {
    backgroundColor: Colors.white,
    padding: wp(6),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#F1F1FB', // Light gray/blue border
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  helpTitle: {
    fontFamily: FontFamily.Bold,
    fontSize: FontSize.FONT_24,
    color: Colors.blackVar2,
    marginBottom: hp(0.5),
  },
  helpSubText: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_13,
    color: '#667085', // grayish text
    textAlign: 'center',
    lineHeight: hp(2.2),
  },
});
