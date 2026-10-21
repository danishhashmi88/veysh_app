import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { imagePath } from '../../../../constant/imagePath';
import styles from './styles';
import { Colors } from '../../../../constant/colors';
import AppButton from '../../../../component/common/Buttons/AppButton';

const AddClosetFinalScreen = ({ navigation, route }) => {
  const { itemId, itemName } = route.params || {};

  const handleViewCloset = () => {
    // Navigate to the Closet tab or Home.
    // Assuming 'MyCloset' or similar exists, or simply popToTop to return to root
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={styles.container}>
        <Image
          source={imagePath.green_big_tick}
          style={styles.icon}
          resizeMode="contain"
        />

        <Text style={styles.title}>Item Added!</Text>

        <Text style={styles.subtitle}>
          Your item "{itemName || 'Unknown Item'}" has been added to your closet.
        </Text>

        <View style={styles.buttonContainer}>
          <AppButton
            style={styles.button}
            onPress={() =>
              navigation.navigate('MainTab', {
                screen: 'Home',
                params: { openAddModal: true },
              })
            }
            activeOpacity={0.8}
            title="Add Item"
          />
          <AppButton
            style={styles.button}
            onPress={() => navigation.navigate('MainTab', { screen: 'MyCloset' })}
            activeOpacity={0.8}
            title="View My Closet"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddClosetFinalScreen;
