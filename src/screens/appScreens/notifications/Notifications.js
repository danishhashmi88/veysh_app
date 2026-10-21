import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { wp, hp, getImageUrl } from '../../../utils/helper';
import { useNavigation } from '@react-navigation/native';
import {
  getNotificationsListApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from '../../../services/user.service';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import Header from '../../../component/common/UI/Header';
import { Colors } from '../../../constant/colors';
import { IMAGEURL } from '../../../utils/axios';
import moment from 'moment';
import { imagePath } from '../../../constant/imagePath';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../constant/fonts';
import Back from '../../../component/common/Buttons/Back';
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '../../../component/common/Container/Container';
import NoDataText from '../../../component/common/UI/NoDataText';
import {
  getUnreadNotificationCount,
  isNotificationUnread,
  parseNotificationsFromResponse,
} from '../../../utils/notificationUtils';

const NotificationAvatar = ({ imageUri, style }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUri]);

  return (
    <Image
      source={!hasError && imageUri ? { uri: imageUri } : imagePath.avtara}
      style={style}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
};

const Notifications = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotificationsListApi({ page: 1, limit: 50 });
      console.log(
        '🔔 Notifications RAW response:',
        JSON.stringify(res, null, 2),
      );

      if (res?.success !== false) {
        const notifs = parseNotificationsFromResponse(res);

        console.log('🔔 Parsed notifications count (deduped):', notifs.length);
        setNotifications(notifs);
      } else {
        console.log('🔔 Notifications API failed:', res?.message);
        setError(res?.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.log(
        'Error fetching notifications:',
        err?.response?.data || err?.message || err,
      );
      setError('Could not connect to notification service.');
    } finally {
      setLoading(false);
    }
  };

  // Group notifications by date
  const groupNotifications = notifs => {
    const grouped = {};
    if (!Array.isArray(notifs)) return grouped;

    notifs.forEach(notif => {
      const date = moment(notif.createdAt || notif.created_at || new Date());
      let key = date.format('Do MMM');

      if (date.isSame(moment(), 'day')) {
        key = 'Today';
      } else if (date.isSame(moment().subtract(1, 'days'), 'day')) {
        key = 'Yesterday';
      }

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(notif);
    });

    return Object.keys(grouped).map(key => ({
      title: key,
      data: grouped[key],
    }));
  };

  const sections = groupNotifications(notifications);

  const hasUnreadNotifications = notifications.some(isNotificationUnread);
  const showMarkAllRead = notifications.length > 0;

  const handleMarkAllRead = async () => {
    if (!hasUnreadNotifications || markingAllRead) return;

    try {
      setMarkingAllRead(true);
      const res = await markAllNotificationsReadApi();

      if (res?.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true, is_read: true, isRead: true })),
        );
        showSuccessToast(res?.message || 'All notifications marked as read');
      } else {
        showDangerToast(res?.message || 'Failed to mark notifications as read');
      }
    } catch (err) {
      showDangerToast(
        err?.response?.data?.message ||
          'Could not mark notifications as read.',
      );
    } finally {
      setMarkingAllRead(false);
    }
  };

  const markNotificationAsRead = async notificationId => {
    setNotifications(prev =>
      prev.map(n =>
        (n._id || n.id) === notificationId
          ? { ...n, read: true, is_read: true, isRead: true }
          : n,
      ),
    );

    try {
      await markNotificationReadApi(notificationId);
    } catch (err) {
      console.log(
        'Failed to mark notification as read:',
        err?.response?.data || err?.message || err,
      );
    }
  };

  const handleNotificationPress = item => {
    const notificationId = item._id || item.id;
    const isUnread = isNotificationUnread(item);

    if (isUnread && notificationId) {
      markNotificationAsRead(notificationId);
    }

    const type = (item.type || item.notification_type || '').toLowerCase();
    const data = item.data || {};
    const postId = data.postId || data.post_id || item.postId;
    const outfitId = data.outfitId || data.outfit_id || item.outfitId;
    const itemId = data.itemId || data.item_id || item.itemId;
    const userId =
      data.userId ||
      data.user_id ||
      item.actorUserId?._id ||
      item.senderId?._id;

    if (type.includes('follow') && userId) {
      navigation.navigate('UserProfile', { item: { _id: userId } });
      return;
    }

    if (type.includes('message')) {
      const actor = item.actorUserId || item.senderId || item.fromUser || {};
      const senderName =
        actor.full_name || actor.first_name || actor.name || 'User';
      const profileImg =
        actor.profile_image || actor.profile_img || actor.avatar;
      const imageUri = getImageUrl(profileImg, 'uploads/users');

      navigation.navigate('ChatScreen', {
        user: {
          _id: actor._id || actor.id,
          name: senderName,
          image: imageUri,
        },
      });
      return;
    }

    if (type.includes('like') || type.includes('comment')) {
      if (type.includes('outfit') && outfitId) {
        navigation.navigate('OutfitDetail', { outfitId });
        return;
      }
      if (type.includes('item') && itemId) {
        navigation.navigate('ClosetDetails', { item: { _id: itemId } });
        return;
      }
      if (postId) {
        navigation.navigate('SocialCommunityScreen', { postId });
        return;
      }
      if (outfitId) {
        navigation.navigate('OutfitDetail', { outfitId });
        return;
      }
      if (itemId) {
        navigation.navigate('ClosetDetails', { item: { _id: itemId } });
      }
    }
  };

  const renderItem = ({ item }) => {
    console.log('Rendering notification item:', JSON.stringify(item, null, 2));
    const actor = item.actorUserId || item.senderId || item.fromUser || {};
    const relativeTime = item.createdAt || item.created_at
      ? moment(item.createdAt || item.created_at).fromNow()
      : 'just now';

    const senderName =
      actor.full_name ||
      actor.first_name ||
      actor.name ||
      'Someone';

    // Profile image may be a full URL or just a filename
    const profileImg = actor.profile_image || actor.profile_img || actor.avatar;
    const imageUri = getImageUrl(profileImg, 'uploads/users');
      
    const isUnread = isNotificationUnread(item);
    const messageText =
      item.message ||
      item.body ||
      item.title ||
      item.text ||
      'New notification received';

    return (
      <TouchableOpacity
        style={styles.notificationItem}
        activeOpacity={0.7}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.iconContainer}>
          <NotificationAvatar imageUri={imageUri} style={styles.avatar} />
        </View>
        <View style={styles.textContainer}>
          {/* <Text style={styles.senderName}>{senderName}</Text> */}
          <Text style={styles.messageText}>{messageText}</Text>
          <Text style={styles.timeText}>{relativeTime}</Text>
        </View>
        {isUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <Container
      iosNotchColors={[
        Colors.backGroundColor1,
        Colors.backGroundColor1,
        Colors.zink100,
      ]}
    >
      <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <Header
          showLeftButton={true}
          onLeftButtonPress={() => navigation.goBack()}
          title="Notifications"
          headerTextStyle={{
            fontSize: FontSize.FONT_26,
            fontFamily: FontFamily.Bold,
            color: Colors.blackVar2,
          }}
          backgroundColor={Colors.white}
          rightComponent={
            showMarkAllRead ? (
              <TouchableOpacity
                onPress={handleMarkAllRead}
                disabled={markingAllRead || !hasUnreadNotifications}
                hitSlop={10}
              >
                {markingAllRead ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.gradientPurple1}
                  />
                ) : (
                  <Text
                    style={[
                      styles.markAllReadText,
                      !hasUnreadNotifications && styles.markAllReadTextDisabled,
                    ]}
                  >
                    Mark all read
                  </Text>
                )}
              </TouchableOpacity>
            ) : null
          }
        />

        {/* Content */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.gradientPurple1} />
            </View>
          ) : sections.length === 0 ? (
            <NoDataText
              source={imagePath.bell}
              title={'No notifications found'}
              subTitle={'You don’t have any notifications yet.'}
            />
          ) : (
            <FlatList
              data={sections}
              keyExtractor={item => item.title}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                  {item.data.map((notif, idx) => (
                    <View key={notif._id || idx}>
                      {renderItem({ item: notif })}
                    </View>
                  ))}
                </View>
              )}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '',
  },
  backButton: {
    marginRight: wp(4),
  },
  headerTitle: {
    // fontSize: FontSize.FONT_18,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
  },
  emptyText: {
    fontSize: FontSize.FONT_18,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.graytext,
    marginBottom: hp(1),
  },
  errorText: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.red,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: hp(4),
  },
  section: {
    marginBottom: hp(1),
  },
  sectionTitle: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.graytext,
    marginLeft: wp(5),
    marginVertical: hp(1.5),
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.backGroundColor1, // Slightly differentiated if unread
  },
  iconContainer: {
    marginRight: wp(4),
  },
  avatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: 22,
    backgroundColor: Colors.bgGrey,
  },
  textContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backGroundColor1,
    paddingBottom: hp(1),
    backgroundColor: Colors.backGroundColor1,
  },
  messageText: {
    fontSize: FontSize.FONT_14,
    color: Colors.black,
    // fontWeight: FontWeight.FONT_400,
    fontFamily: OutfitFamily.Regular,
    marginBottom: 4,
  },
  senderName: {
    fontSize: FontSize.FONT_16,
    color: Colors.black,
    // fontWeight: FontWeight.FONT_600,
    fontFamily: FontFamily.OutfitMedium,
    marginBottom: 2,
  },
  timeText: {
    fontSize: FontSize.FONT_12,
    color: Colors.lightGrey,
    // fontWeight: FontWeight.FONT_400,
    fontFamily: FontFamily.OutfitMedium,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.themeColor,
    marginLeft: 8,
    alignSelf: 'center',
  },
  markAllReadText: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.themeColor,
  },
  markAllReadTextDisabled: {
    color: Colors.lightGrey,
    opacity: 0.6,
  },
});

export default Notifications;
