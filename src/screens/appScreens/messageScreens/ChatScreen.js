import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { wp, hp, getImageUrl } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';
import ImagePreview from '../../../component/common/Image/ImagePreview';
import FullScreenImageModal from '../../../component/common/Modal/FullScreenImageModal';
import styles from './styles';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../../../utils/socket';
import { setActiveChatRoom } from '../../../redux/slices/userSlice';
import {
  getChatMessagesApi,
  clearChatApi,
  uploadChatFileApi,
} from '../../../services/user.service';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../../component/common/Buttons/AppButton';
import Header from '../../../component/common/UI/Header';
import { FontFamily, FontSize } from '../../../constant/fonts';

const ChatScreen = ({ route }) => {
  const { user } = route.params || {};
  const navigation = useNavigation();
  const { userDetails } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const flatListRef = useRef(null);
  const isListeningRef = useRef(false);
  const inputTextRef = useRef('');
  const speechBaseTextRef = useRef('');

  const fetchHistory = async room => {
    try {
      setLoading(true);
      const res = await getChatMessagesApi(room);
      console.log('Chat History API Response:', JSON.stringify(res));
      if (res?.success) {
        const history = res.data.map(msg => ({
          id: msg._id,
          text: (msg.type === 'image' || msg.type === 'outfit') ? (msg.file_url || msg.file_name || msg.message) : msg.message,
          sender: msg.sender_id === userDetails?._id ? 'sent' : 'received',
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: msg.type || 'text',
        }));
        setMessages(history.reverse());
      }
    } catch (error) {
      console.log('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const myId = userDetails?._id;
    const otherId = user?._id;
    if (!myId || !otherId) return;

    const room = [myId, otherId].sort().join('_');
    dispatch(setActiveChatRoom(room));

    const handleIncomingMessage = data => {
      console.log('Incoming Message Socket Data:', JSON.stringify(data));
      if (data && data.sender_id === otherId) {
        const incomingMsg = {
          id: data._id || Date.now().toString(),
          text: (data.type === 'image' || data.type === 'outfit') ? (data.file_url || data.file_name || data.message) : data.message,
          sender: 'received',
          time: new Date(data.createdAt || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: data.type || 'text',
        };
        setMessages(prev => [incomingMsg, ...prev]);
      }
    };

    const setup = async () => {
      try {
        if (!socket.socket) {
          await socket.initializeSocket();
        }
        fetchHistory(room);
        socket.emit('chatJoin', { sender_id: myId, receiver_id: otherId, room });
        socket.on('chatMessage', handleIncomingMessage);
      } catch (error) {
        console.log('Socket setup failed', error);
      }
    };

    setup();

    return () => {
      socket.off('chatMessage', handleIncomingMessage);
      dispatch(setActiveChatRoom(null));
    };
  }, [userDetails?._id, user?._id]);

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  const applySpeechText = spoken => {
    if (!spoken || typeof spoken !== 'string') return;
    const trimmed = spoken.trim();
    if (!trimmed) return;

    // onSpeechResults fires repeatedly with the FULL transcript each time.
    // Always rebuild from the text that existed when listening started.
    const base = speechBaseTextRef.current.trim();
    const next = base ? `${base} ${trimmed}` : trimmed;
    inputTextRef.current = next;
    setInputText(next);
  };

  const stopVoiceListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    } finally {
      isListeningRef.current = false;
      setIsListening(false);
    }
  };

  const startVoiceListening = async () => {
    if (isListeningRef.current) return;

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Microphone permission is required for voice-to-text.',
        );
        return;
      }
    }

    try {
      try {
        await Voice.cancel();
      } catch (_) {}

      speechBaseTextRef.current = inputTextRef.current || '';
      isListeningRef.current = true;
      setIsListening(true);
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
      isListeningRef.current = false;
      setIsListening(false);
      Alert.alert('Voice Error', 'Could not start voice recognition. Please try again.');
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = () => {
      isListeningRef.current = true;
      setIsListening(true);
    };
    Voice.onSpeechEnd = () => {
      isListeningRef.current = false;
      setIsListening(false);
    };
    Voice.onSpeechPartialResults = e => {
      if (e?.value?.[0]) applySpeechText(e.value[0]);
    };
    Voice.onSpeechResults = e => {
      if (e?.value?.[0]) applySpeechText(e.value[0]);
    };
    Voice.onSpeechError = () => {
      isListeningRef.current = false;
      setIsListening(false);
    };

    return () => {
      isListeningRef.current = false;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const toggleListening = async () => {
    if (isListeningRef.current) {
      await stopVoiceListening();
    } else {
      await startVoiceListening();
    }
  };

  useEffect(() => {
    if (route.params?.selectedOutfit) {
      const outfit = route.params.selectedOutfit;
      const outfitImage = (outfit?.images && outfit.images[0]) || '';
      if (outfitImage) {
        sendImageMessage(getImageUrl(outfitImage), 'outfit');
      }
      navigation.setParams({ selectedOutfit: null });
    }
  }, [route.params?.selectedOutfit]);

  const sendImageMessage = async (imagePath, type = 'image') => {
    console.log('sendImageMessage with path:', imagePath, 'type:', type);
    const newMessageId = Date.now().toString();
    const newMessage = {
      id: newMessageId,
      text: imagePath,
      sender: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'image',
    };
    setMessages(prev => [newMessage, ...prev]);

    try {
      const isLocal = imagePath.startsWith('file') || imagePath.startsWith('/') || imagePath.startsWith('content');
      let fileName = imagePath;

      if (isLocal) {
        const formData = new FormData();
        formData.append('file', {
          uri: Platform.OS === 'ios' ? imagePath.replace('file://', '') : imagePath,
          type: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
        });

        console.log('Uploading Chat File FormData:', JSON.stringify({
          uri: Platform.OS === 'ios' ? imagePath.replace('file://', '') : imagePath,
          name: `photo_${Date.now()}.jpg`,
        }));

        const uploadRes = await uploadChatFileApi(formData);
        console.log('Chat File Upload Response:', JSON.stringify(uploadRes));

        if (uploadRes?.success) {
          fileName = uploadRes.data.file_name;
          console.log('Using Server fileName:', fileName);
        } else {
          throw new Error('Upload failed');
        }
      } else {
        fileName = imagePath; // Keep full URL for outfits
        console.log('Using full URL for remote image:', fileName);
      }

      const myId = userDetails?._id;
      const otherId = user?._id;
      const room = [myId, otherId].sort().join('_');

      console.log('Emitting Socket Message (Image):', {
        room,
        file_name: fileName,
        type: 'image',
      });

      socket.emit('chatSendMessage', {
        room,
        sender_id: myId,
        receiver_id: otherId,
        message: '',
        file_name: fileName,
        type: 'image',
      }, res => {
        console.log('Socket Message Acknowledged:', JSON.stringify(res));
        if (!res || !res.ok) console.error('Socket send fail');
      });
    } catch (error) {
      console.error('sendImageMessage error:', error);
      setMessages(prev => prev.filter(m => m.id !== newMessageId));
      Alert.alert('Error', 'Failed to send image.');
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const myId = userDetails?._id;
    const otherId = user?._id;
    if (!myId || !otherId) return;

    if (isListeningRef.current) {
      stopVoiceListening();
    }

    const room = [myId, otherId].sort().join('_');
    const text = inputText.trim();

    socket.emit('chatSendMessage', {
      room,
      sender_id: myId,
      receiver_id: otherId,
      message: text,
      type: 'text',
    }, res => {
      if (res && res.ok) {
        setInputText('');
        const newMessage = {
          id: Date.now().toString(),
          text: text,
          sender: 'sent',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
        };
        setMessages(prev => [newMessage, ...prev]);
      }
    });
  };

  const handleClearChat = async () => {
    setShowMenu(false);
    Alert.alert('Clear Chat', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          const room = [userDetails?._id, user?._id].sort().join('_');
          const res = await clearChatApi({ room });
          if (res?.success) setMessages([]);
        },
      },
    ]);
  };

  const getChatImageUri = text => {
    if (!text) return null;
    let uri;
    if (text.startsWith('file') || text.startsWith('content')) {
      uri = text;
    } else if (text.startsWith('/')) {
      uri = `file://${text}`;
    } else {
      // Use getImageUrl for both filenames and potentially malformed full URLs
      // It handles nested http, trailing slashes, etc.
      uri = getImageUrl(text, 'uploads/chat');
    }
    console.log(`getChatImageUri("${text}") -> ${uri}`);
    return uri;
  };

  const renderMessage = ({ item }) => {
    const isSent = item.sender === 'sent';
    const uri = (item.type === 'image' || item.type === 'outfit') ? getChatImageUri(item.text) : null;

    return (
      <View style={[styles.messageContainer, isSent ? styles.sentContainer : styles.receivedContainer]}>
        {!isSent && (
          <ImagePreview image={user?.image} style={styles.receivedAvatar} />
        )}
        <View style={[styles.bubble, isSent ? styles.sentBubble : styles.receivedBubble, isSent && { backgroundColor: 'transparent', overflow: 'hidden' }]}>
          {isSent && (
            <LinearGradient
              colors={[Colors.gradientPurple1, Colors.gradientPurple2]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          {item.type === 'text' ? (
            <Text style={[styles.chatMessageText, isSent ? styles.sentText : styles.receivedText]}>{item.text}</Text>
          ) : (item.type === 'image' || item.type === 'outfit') ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setFullScreenImage(uri)}
              style={styles.imageMessageContainer}
            >
              <Image
                source={{ uri }}
                style={styles.chatImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : null}
          <Text style={[styles.timeTextChat, isSent ? styles.sentTimeText : styles.receivedTimeText]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  const openCamera = async () => {
    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (status !== PermissionsAndroid.RESULTS.GRANTED && Platform.OS === 'android') return;
    ImagePicker.openCamera({ width: 800, height: 800, cropping: true }).then(image => {
      sendImageMessage(image.path);
      setShowAttachmentMenu(false);
    }).catch(() => { });
  };

  const openGallery = () => {
    ImagePicker.openPicker({ width: 800, height: 800, cropping: true }).then(image => {
      sendImageMessage(image.path);
      setShowAttachmentMenu(false);
    }).catch(() => { });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        centerComponent={
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('UserProfile', { item: user })}>
            <ImagePreview image={user?.image} style={styles.headerAvatar} />
            <Text style={styles.headerName} numberOfLines={1}>{(user?.name?.split(' ')[0]) || 'User'}</Text>
          </TouchableOpacity>
        }
        showRightButton={true}
        onRightButtonPress={() => setShowMenu(true)}
        rightIcon={imagePath.dotsVer}
        rightIconStyle={{ width: wp(5), height: wp(5) }}
        backgroundColor={Colors.white}
      />
      <View style={styles.bodyContainer}>
        {loading && messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.themeColor} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            inverted={true}
            ListFooterComponent={() => <Text style={styles.dateSeparator}>Today</Text>}
          />
        )}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}>
          {showAttachmentMenu && (
            <View style={styles.attachmentMenu}>
              <TouchableOpacity style={styles.attachmentItem} onPress={openCamera}>
                <View style={styles.attachmentIconCircle}><View style={styles.attachmentIconContainer}><Image source={imagePath.camera} style={styles.attachmentIcon} /></View></View>
                <Text style={styles.attachmentText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentItem} onPress={openGallery}>
                <View style={styles.attachmentIconCircle}><View style={styles.attachmentIconContainer}><Image source={imagePath.gallery} style={styles.attachmentIcon} /></View></View>
                <Text style={styles.attachmentText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentItem} onPress={() => { setShowAttachmentMenu(false); navigation.navigate('SelectOutfitScreen', { user }); }}>
                <View style={styles.attachmentIconCircle}><View style={styles.attachmentIconContainer}><Image source={imagePath.outfit} style={styles.attachmentIcon} /></View></View>
                <Text style={styles.attachmentText}>Outfits</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor={Colors.greyDark2}
                value={inputText}
                onChangeText={text => {
                  if (isListeningRef.current) {
                    // Manual edit while listening — stop mic so text doesn't get overwritten/duplicated
                    stopVoiceListening();
                  }
                  inputTextRef.current = text;
                  setInputText(text);
                }}
                multiline
                onFocus={() => setShowAttachmentMenu(false)}
              />
              <TouchableOpacity
                onPress={toggleListening}
                style={styles.inputIconButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <Image
                  source={imagePath.mic}
                  style={[styles.inputIcon, isListening && styles.micIconActive]}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowAttachmentMenu(!showAttachmentMenu); }} style={styles.inputIconButton}><Image source={showAttachmentMenu ? imagePath.cross_black : imagePath.paperClip} style={styles.inputIcon} /></TouchableOpacity>
            </View>
            <AppButton style={{ marginLeft: wp(3) }} onPress={sendMessage} disabled={loading || !inputText.trim()} width={wp(11)} height={wp(11)} borderRadius={wp(5.5)} opacity={1} disabledOpacity={1}>
              <Image source={imagePath.send1} style={styles.sendButton} resizeMode="contain" />
            </AppButton>
          </View>
        </KeyboardAvoidingView>
      </View>
      <FullScreenImageModal
        visible={!!fullScreenImage}
        imageUri={fullScreenImage}
        onClose={() => setFullScreenImage(null)}
      />
      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => {
              if (messages.length !== 0) {
                handleClearChat()
              }else{
                setShowMenu(false)
              }
            }} style={styles.menuItem}><Text style={styles.menuText}>Clear Chat</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ChatScreen;
