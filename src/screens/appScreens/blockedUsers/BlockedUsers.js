import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontFamily } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';
import Header from '../../../component/common/UI/Header';
import {
  getBlockedUsersApi,
  unblockUserapi,
} from '../../../services/user.service';
import { showToast, showDangerToast } from '../../../utils/toast';
import styles from './styles';
import NoDataText from '../../../component/common/UI/NoDataText';

const BlockedUsers = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const res = await getBlockedUsersApi();
      if (res?.data?.success || res?.success) {
        setUsers(res.data?.data?.blockedUsers || res?.data?.blockedUsers || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async userId => {
    try {
      const res = await unblockUserapi({ block_id: userId, user_id: userId });
      if (res?.data?.success || res?.success) {
        showToast('User unblocked successfully');
        setUsers(users.filter(u => u._id !== userId));
      } else {
        showDangerToast(
          res?.data?.message || res?.message || 'Failed to unblock user',
        );
      }
    } catch (error) {
      console.error(error);
      showDangerToast('Error unblocking user');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image
        source={
          item.profile_image ? { uri: item.profile_image } : imagePath.profile
        }
        style={styles.profileImage}
        defaultSource={imagePath.profile}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.full_name || item.first_name || item.name}
        </Text>
        <Text style={styles.userHandle} numberOfLines={1}>
          @{item.username}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.unblockBtn}
        onPress={() => handleUnblock(item._id)}
      >
        <Text style={styles.unblockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Blocked Users"
        headerTextStyle={{
          fontFamily: FontFamily.Bold,
          fontSize: FontSize.FONT_26,
          color: Colors.blackVar2,
        }}
        backgroundColor={Colors.white}
      />

      {loading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size="large" color={Colors.themeColor} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            users?.length === 0 && { flexGrow: 1, justifyContent: 'center' }
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={

            <NoDataText
              source={imagePath.block_user}
              title={'No blocked users found'}
            />
          }
        />
      )}
    </View>
  );
};

export default BlockedUsers;
