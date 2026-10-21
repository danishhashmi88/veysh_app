import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Back from '../../../component/common/Buttons/Back';
import { wp } from '../../../utils/helper';

import { useTheme } from '../../../hooks/useTheme';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import { imagePath } from '../../../constant/imagePath';
import { Colors } from '../../../constant/colors';

const AIChat = ({ route, navigation }) => {
  const Colors = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Back style={{ backgroundColor: Colors.bgGrey }} headerTitle={'Bae'} />

      <View style={styles.inputContainer}>
        <LabelInput
          title="Price"
          placeholder="Enter Price"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Image
            source={imagePath.messIcon}
            style={{ width: '55%', height: '55%' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AIChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  sendButton: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(0.5),
    borderWidth: 1,
  },
});
