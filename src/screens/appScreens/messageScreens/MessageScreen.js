import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Image,
  TextInput,
} from 'react-native';
import { wp, hp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import styles from './styles';
import { imagePath } from '../../../constant/imagePath';
import ImagePreview from '../../../component/common/Image/ImagePreview';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../../../component/common/UI/Header';
import { getChatListApi, searchUsersApi } from '../../../services/user.service';
import CustomLoader from '../../../component/common/Loader/CustomLoader';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../../../utils/socket';
import LinearGradient from 'react-native-linear-gradient';
import { FontFamily, FontSize } from '../../../constant/fonts';
import {
  setConversationUnread,
  clearConversationUnread,
  clearAllUnreads,
} from '../../../redux/slices/userSlice';
import NoDataText from '../../../component/common/UI/NoDataText';

const MessageScreen = () => {
  const navigation = useNavigation();
  const [chatList, setChatList] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);

  // In-app notification banner state
  const [notifBanner, setNotifBanner] = React.useState(null); // { title, message, redirect_to }
  const bannerAnim = useRef(new Animated.Value(-100)).current; // slides from top
  const bannerTimeout = useRef(null);

  const { userDetails, unreadConversations, activeChatRoom } = useSelector(
    state => state.user,
  );
  const dispatch = useDispatch();

  // ─── Notification Room Join + notificationReceive listener ───────────────
  React.useEffect(() => {
    let isMounted = true;

    const myId = userDetails?._id;
    if (!myId) return;

    const joinNotifRoom = () => {
      if (!socket.socket || !socket.socket.connected) return;
      socket.emit(
        'chatJoin',
        {
          sender_id: String(myId),
          receiver_id: String(myId),
          room: String(myId),
        },
        res => {
          console.log(
            '[NotifRoom] Joined notification room for user:',
            myId,
            'Result:',
            res,
          );
        },
      );
    };

    const handleConnect = () => {
      console.log(
        '[NotifSetup] Socket connected event fired. Sending chatJoin.',
      );
      joinNotifRoom();
    };

    const handleNotification = data => {
      console.log('[NotifReceive] Raw data received:', data);
      if (data && data.type === 'unread_chat_message') {
        showBanner(data);
        fetchChatList(true); // Silent refresh
      }
    };

    const handleChatMessage = data => {
      console.log(
        `[MessageScreen] New chat. myId: ${myId}, sender_id: ${data?.sender_id}`,
      );

      if (data?.sender_id && String(data.sender_id) !== String(myId)) {
        // DON'T show banner or mark unread if we are currently looking at this chat!
        if (data.room && data.room !== activeChatRoom) {
          console.log('[MessageScreen] Banner shown & marking unread in Redux');
          dispatch(setConversationUnread(data.room));

          const displayMsg =
            data.type === 'image'
              ? '📷 Photo'
              : data.type === 'outfit'
                ? '👗 Outfit'
                : data.message || 'You received a new message.';

          showBanner({
            title: 'New Message',
            message: displayMsg,
            redirect_to: `?to=${data.sender_id}&room=${data.room}`,
          });
        } else {
          console.log(
            '[MessageScreen] Skipping banner/unread because room is active or missing',
          );
        }
      }

      // --- Optimistic UI Update ---
      if (data.room) {
        setChatList(prevList => {
          const newList = [...prevList];
          const index = newList.findIndex(item => item.room === data.room);

          if (index !== -1) {
            // Update existing conversation and move to top
            const updatedItem = {
              ...newList[index],
              last_message: {
                ...newList[index].last_message,
                message: data.message,
                type: data.type, // Store type
                createdAt: new Date().toISOString(),
              },
            };
            newList.splice(index, 1);
            newList.unshift(updatedItem);
          }
          return newList;
        });
      }

      fetchChatList(true); // Silent refresh to sync with server
    };

    const setupNotificationSocket = async () => {
      try {
        // Force initialize if not available
        if (!socket.socket) {
          try {
            await socket.initializeSocket();
          } catch (e) {
            console.log('[NotifSetup] Socket init failed', e);
          }
        }

        if (!isMounted || !socket.socket) return;

        // 1. Join immediately if already connected
        if (socket.socket.connected) {
          console.log(
            '[NotifSetup] Socket already connected, joining room directly.',
          );
          joinNotifRoom();
        }

        // 2. ALWAYS listen for 'connect' (and reconnects) to join the room
        socket.on('connect', handleConnect);

        // 3. Listen for any incoming notifications
        socket.on('notificationReceive', handleNotification);

        // 4. Listen for chat messages to auto-refresh list
        socket.on('chatMessage', handleChatMessage);
      } catch (err) {
        console.log('[NotifSetup] Error:', err);
      }
    };

    setupNotificationSocket();

    return () => {
      isMounted = false;
      // Clean up specific listeners
      socket.off('connect', handleConnect);
      socket.off('notificationReceive', handleNotification);
      socket.off('chatMessage', handleChatMessage);
    };
  }, [userDetails?._id]);

  // ─── Show animated banner ─────────────────────────────────────────────────
  const showBanner = data => {
    setNotifBanner(data);

    // Clear any previous auto-dismiss timer
    if (bannerTimeout.current) clearTimeout(bannerTimeout.current);

    // Slide in
    Animated.spring(bannerAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    // Auto-dismiss after 3.5 seconds
    bannerTimeout.current = setTimeout(() => {
      dismissBanner();
    }, 3500);
  };

  const dismissBanner = () => {
    Animated.timing(bannerAnim, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setNotifBanner(null));
  };

  const handleBannerTap = () => {
    if (!notifBanner) return;
    dismissBanner();
    // Navigate to the sender's chat; redirect_to contains query params like ?to=...&room=...
    const redirect = notifBanner.redirect_to || '';
    const toMatch = redirect.match(/[?&]to=([^&]*)/);
    const roomMatch = redirect.match(/[?&]room=([^&]*)/);
    const otherId = toMatch ? toMatch[1] : null;
    const room = roomMatch ? roomMatch[1] : null;
    if (otherId) {
      navigation.navigate('ChatScreen', {
        user: { _id: otherId },
        room,
      });
    }
  };

  // ─── Chat list ────────────────────────────────────────────────────────────
  useFocusEffect(
    React.useCallback(() => {
      fetchChatList();
    }, []),
  );

  React.useEffect(() => {
    const query = searchText.trim();
    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchSearchUsers(query);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  const fetchSearchUsers = async query => {
    try {
      setSearchLoading(true);
      const res = await searchUsersApi(query);
      if (res?.success) {
        const users = res?.data?.users || res?.data?.list || res?.data || [];
        const myId = String(userDetails?._id || '');
        setSearchResults(
          Array.isArray(users)
            ? users.filter(user => String(user._id) !== myId)
            : [],
        );
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.log('Error searching chat users:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const getUserDisplayName = user =>
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.name ||
    'User';

  const mapSearchUserToChatItem = user => ({
    room: `search_${user._id}`,
    other_user_id: user._id,
    other_user: {
      name: getUserDisplayName(user),
      profile_image: user.profile_image || user.profile_img,
    },
    last_message: null,
    isSearchResult: true,
  });

  const isSearching = searchText.trim().length > 0;
  const displayList = isSearching
    ? searchResults.map(mapSearchUserToChatItem)
    : chatList;

  const fetchChatList = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await getChatListApi({ page: 1, limit: 100 });
      console.log('Chat list response size:', res?.data?.list?.length);
      if (res?.success) {
        const list = res?.data?.list || [];
        setChatList(list);

        // Join all conversation rooms so we receive real-time messages for them
        if (socket.socket && socket.socket.connected) {
          list.forEach(item => {
            socket.emit('chatJoin', {
              sender_id: String(userDetails?._id),
              receiver_id: String(item.other_user_id),
              room: item.room,
            });
          });
        }
      }
    } catch (error) {
      console.log('Error fetching chat list:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const otherUser = item?.other_user;
    const lastMsg = item?.last_message;
    const unreadCount = item.unreadCount || item.unread_count || 0;
    const isUnread = unreadCount > 0 || !!unreadConversations[item.room];
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => {
          // Clear the unread status for this room in Redux
          if (unreadConversations[item.room]) {
            dispatch(clearConversationUnread(item.room));
          }

          navigation.navigate('ChatScreen', {
            user: {
              _id: item.other_user_id,
              name: otherUser?.name,
              image: otherUser?.profile_image,
            },
          });
        }}
      >
        <View style={styles.avatarContainer}>
          <ImagePreview
            image={otherUser?.profile_image}
            style={styles.avatar}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.nameText, isUnread && styles.unreadNameText]}>
              {otherUser?.name}
            </Text>
            <Text style={[styles.timeText, isUnread && styles.unreadTimeText]}>
              {lastMsg?.createdAt
                ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : ''}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text
              style={[styles.messageText, isUnread && styles.unreadLastMsgText]}
              numberOfLines={1}
            >
              {item.isSearchResult
                ? 'Tap to start chat'
                : lastMsg?.type === 'image'
                  ? 'Photo'
                  : lastMsg?.type === 'outfit'
                    ? 'Outfit'
                    : lastMsg?.message || ''}
            </Text>
            {isUnread && (
              <View style={styles.unreadBadge}>
                {/* Show count if from API, otherwise just bullet if local fallback */}
                {unreadCount > 0 ? (
                  <Text style={styles.unreadCountText}>{unreadCount}</Text>
                ) : (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: Colors.white,
                    }}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
 <Header
  variant="search"
  backgroundColor={Colors.white}
  title="Messages"
  headerTextStyle={{
    fontSize: FontSize.FONT_26,
    fontFamily: FontFamily.Bold,
  }}
  searchValue={searchText}
  onSearchChange={setSearchText}
  searchPlaceholder="Search users…"
/>

      <View style={styles.bodyContainer}>
        {loading || searchLoading ? (
          <CustomLoader size="large" />
        ) : (
          <FlatList
            data={displayList}
            renderItem={renderItem}
            keyExtractor={item => item.room || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <NoDataText
                source={imagePath.message}
                title={
                  isSearching ? 'No users found' : 'No messages yet'
                }
                subTitle={
                  isSearching
                    ? 'Try searching with a different name.'
                    : 'You don’t have any messages yet.'
                }
              />
              // <View
              //   style={{
              //     flex: 1,
              //     alignItems: 'center',
              //     justifyContent: 'center',
              //   }}
              // >
              //   <Image
              //     source={imagePath.message}
              //     style={{
              //       width: wp(15),
              //       height: wp(15),
              //       tintColor: Colors.grey,
              //       marginBottom: hp(2),
              //     }}
              //     resizeMode="contain"
              //   />
              //   <Text style={{ color: Colors.grey, fontSize: 16 }}>
              //     {searchText ? 'No conversations found' : 'No messages yet'}
              //   </Text>
              // </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('ChatScreen')}
        >
          <LinearGradient
            colors={[Colors.gradientPurple1, Colors.gradientPurple2]}
            style={styles.fabGradient}
          >
            <Text style={styles.plusIcon}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;
