import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/useTheme';
import { useEffect } from 'react';
import { getStyles } from './style';
import { imagePath } from '../../../constant/imagePath';
import Header from '../../../component/common/UI/Header';
import { askQuestionApi, saveSuggestedOutfitApi, getChatHistoryApi, getOutfitsListApi, getDefaultQuestionsApi } from '../../../services/user.service';
import { saveAiLog } from '../../../utils/aiLogger';
import { hasAiDataConsent, setAiDataConsent } from '../../../utils/aiConsent';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { Colors as ColorsConst } from '../../../constant/colors';
import AppButton from '../../../component/common/Buttons/AppButton';
import ScaleButton from '../../../component/common/animations/ScaleButton';
import TypingIndicator from '../../../component/common/animations/TypingIndicator';
import { ChatSkeleton } from '../../../component/common/animations/HomeSkeletons';
import AiDataConsentModal from '../../../component/common/Modal/AiDataConsentModal';

const mockMessages = [
  //   {
  //     id: '1',
  //     text: 'Hi! I need an outfit for a casual office day.',
  //     sender: 'user',
  //     timestamp: '10:30 pm',
  //   },
  //   {
  //     id: '2',
  //     text: 'Got it 👍 Do you prefer something relaxed or more polished today?',
  //     sender: 'ai',
  //     timestamp: '10:30 pm',
  //   },
  //   {
  //     id: '3',
  //     text: 'Polished but comfortable.',
  //     sender: 'user',
  //     timestamp: '10:30 pm',
  //   },
  //   {
  //     id: '4',
  //     text: 'Perfect. I suggest a light blue shirt, dark chinos, and white loafers from your closet. You can layer with the beige blazer if it gets cool.',
  //     sender: 'ai',
  //     timestamp: '10:30 pm',
  //   },
  //   {
  //     id: '5',
  //     text: 'Sounds good.',
  //     sender: 'user',
  //     timestamp: '10:30 pm',
  //   },
];


const AiHomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log("routess", route)
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const { tokenAndId, userDetails } = useSelector(state => state.user);
  const currentUserId =
    tokenAndId?.userId || userDetails?._id || userDetails?.id || null;
  const [inputText, setInputText] = useState('');
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-0',
      text: "Hi! I'm Bae, your personal AI closet assistant. How can I help you style your day today?",
      sender: 'ai',
      timestamp: new Date()
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        .toLowerCase(),
    },
  ]);
  console.log("message si", messages)
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [savedOutfitsNames, setSavedOutfitsNames] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'What should I wear today?',
    'Style my blue jeans',
    'Outfit for a dinner date',
  ]);
  const [aiConsentReady, setAiConsentReady] = useState(false);
  const [hasAiConsent, setHasAiConsent] = useState(false);
  const [showAiConsentModal, setShowAiConsentModal] = useState(false);
  const flatListRef = useRef(null);
  const isListeningRef = useRef(false);
  const inputTextRef = useRef('');
  const speechBaseTextRef = useRef('');
  const pendingInitialMessageRef = useRef(null);
  const hasAiConsentRef = useRef(false);

  // --- Mic listening pulse ---
  const micPulse = useSharedValue(0);
  useEffect(() => {
    if (isListening) {
      micPulse.value = withRepeat(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(micPulse);
      micPulse.value = withTiming(0, { duration: 200 });
    }
    return () => cancelAnimation(micPulse);
  }, [isListening, micPulse]);

  const micRingStyle = useAnimatedStyle(() => ({
    opacity: micPulse.value * 0.5,
    transform: [{ scale: 1 + micPulse.value * 0.9 }],
  }));

  // --- Send button "invite" pulse when there is text to send ---
  const sendPulse = useSharedValue(0);
  const hasText = inputText.trim().length > 0 && !isLimitReached && !isLoading;
  useEffect(() => {
    if (hasText) {
      sendPulse.value = withRepeat(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(sendPulse);
      sendPulse.value = withTiming(0, { duration: 200 });
    }
    return () => cancelAnimation(sendPulse);
  }, [hasText, sendPulse]);

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + sendPulse.value * 0.08 }],
  }));

  useEffect(() => {
    const checkConsent = async () => {
      setAiConsentReady(false);
      const consented = await hasAiDataConsent(currentUserId);
      hasAiConsentRef.current = consented;
      setHasAiConsent(consented);
      setAiConsentReady(true);
      if (!consented) {
        setShowAiConsentModal(true);
      } else {
        setShowAiConsentModal(false);
      }
    };
    checkConsent();
  }, [currentUserId]);

  useEffect(() => {
    if (aiConsentReady && hasAiConsent) {
      fetchHistory();
    }
  }, [aiConsentReady, hasAiConsent, currentUserId]);

  const handleAcceptAiConsent = async () => {
    await setAiDataConsent(true, currentUserId);
    hasAiConsentRef.current = true;
    setHasAiConsent(true);
    setShowAiConsentModal(false);
    const pending = pendingInitialMessageRef.current;
    pendingInitialMessageRef.current = null;
    if (pending) {
      sendMessage(pending);
    }
  };

  const handleDeclineAiConsent = () => {
    setShowAiConsentModal(false);
    pendingInitialMessageRef.current = null;
    navigation.goBack();
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // 1. Fetch Wardrobe for title matching fallback
      let names = [];
      try {
        const wardrobeRes = await getOutfitsListApi({ page: 1, per_page: 100 });
        if (wardrobeRes?.data?.list) {
          names = wardrobeRes.data.list.map(o => o.name?.toLowerCase().trim()).filter(Boolean);
          setSavedOutfitsNames(names);
        }
      } catch (e) {
        console.log('Wardrobe Fetch Error:', e);
      }


      try {
        const defaultQRes = await getDefaultQuestionsApi();

        if (defaultQRes?.data?.list) {
          const list = defaultQRes.data.list
            .map(item => item.question || item.title || item)
            .filter(Boolean);
          if (list.length > 0) {
            setSuggestedQuestions(list);
          }
        } else if (Array.isArray(defaultQRes?.data)) {
          const list = defaultQRes.data
            .map(item => item.title || item.question || item)
            .filter(Boolean);
          if (list.length > 0) {
            setSuggestedQuestions(list);
          }
        } else if (Array.isArray(defaultQRes)) {
          setSuggestedQuestions(defaultQRes);
        }
      } catch (e) {
        console.log('Default Questions Fetch Error:', e);
      }

      const response = await getChatHistoryApi({ page: 1 });
      console.log('Chat History RAW Response:', JSON.stringify(response, null, 2));


      const resPayload = response;
      const list = resPayload?.data?.list || resPayload?.list;

      if (list && Array.isArray(list)) {
        console.log('Found history list with', list.length, 'records');
        const historyMessages = [];

        // Use a copy to avoid mutating the original array
        [...list].reverse().forEach((item, index) => {
          const timestamp = item.created_at
            ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()
            : '';

          if (item.question) {
            historyMessages.push({
              id: `hist-q-${index}-${Date.now()}`,
              backendId: item._id,
              text: item.question,
              sender: 'user',
              timestamp,
            });
          }

          const aiResponse = item.response || {};
          const answerMessage = aiResponse.answer || item.answer;

          if (answerMessage) {
            historyMessages.push({
              id: `hist-a-${index}-${Date.now()}`,
              backendId: item._id,
              text: answerMessage,
              sender: 'ai',
              suggestions: [
                ...(aiResponse.suggested_outfits || []),
                ...(aiResponse.suggested_new_outfits || []),
                ...(item.suggested_outfits || []),
              ].map(sug => {
                const isAlreadySavedByTitle = names.includes(sug.name?.toLowerCase().trim());
                return {
                  ...sug,
                  is_saved: sug.is_saved || isAlreadySavedByTitle || false
                };
              }),
              missingItems: aiResponse.missing_items || item.missing_items || [],
              timestamp,
            });
          }
        });

        if (historyMessages.length > 0) {
          setMessages(prev => {
            const welcomeMsg = prev.find(m => m.id === 'welcome-0');
            const mappedHistory = historyMessages.reverse();
            return [...mappedHistory, welcomeMsg].filter(Boolean);
          });
        }
      } else {
        console.log('No history list found in response');
      }
    } catch (error) {
      console.log('Fetch History Error:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    console.log('route.params?.initialMessage', route);
    if (!route.params?.initialMessage || !aiConsentReady) return;

    const message = route.params.initialMessage;
    navigation.setParams({ initialMessage: undefined });

    if (hasAiConsent) {
      sendMessage(message);
    } else {
      pendingInitialMessageRef.current = message;
      setShowAiConsentModal(true);
    }
  }, [route.params?.initialMessage, aiConsentReady, hasAiConsent]);

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

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      isListeningRef.current = false;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    isListeningRef.current = true;
    setIsListening(true);
  };

  const onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    isListeningRef.current = false;
    setIsListening(false);
  };

  const onSpeechPartialResults = e => {
    if (e?.value?.[0]) applySpeechText(e.value[0]);
  };

  const onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    if (e?.value?.[0]) applySpeechText(e.value[0]);
  };

  const onSpeechError = e => {
    console.log('onSpeechError: ', e);
    isListeningRef.current = false;
    setIsListening(false);
  };

  const startListening = async () => {
    if (isListeningRef.current || isLimitReached || isLoading) return;

    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (!hasPermission) {
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
    }
    try {
      try {
        await Voice.cancel();
      } catch (_) {}

      speechBaseTextRef.current = inputTextRef.current || '';
      isListeningRef.current = true;
      setIsListening(true);
      await Voice.start('en-US', { REQUEST_PERMISSIONS_AUTO: false });
    } catch (e) {
      console.error(e);
      isListeningRef.current = false;
      setIsListening(false);
      Alert.alert(
        'Voice Error',
        'Could not start voice recognition. Please try again.',
      );
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    } finally {
      isListeningRef.current = false;
      setIsListening(false);
    }
  };

  const toggleListening = async () => {
    if (isLimitReached || isLoading) return;
    if (!hasAiConsentRef.current) {
      setShowAiConsentModal(true);
      return;
    }
    if (isListeningRef.current) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const handleSend = () => {
    sendMessage(inputText);
  };

  const sendMessage = async textToSend => {
    if (!textToSend?.trim() || isLoading) return;

    if (!hasAiConsentRef.current) {
      pendingInitialMessageRef.current = textToSend.trim();
      setShowAiConsentModal(true);
      return;
    }

    if (isListeningRef.current) {
      await stopListening();
    }

    const userMessage = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      sender: 'user',
      timestamp: new Date()
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        .toLowerCase(),
    };

    setMessages(prev => [userMessage, ...prev]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askQuestionApi({ question: userMessage.text });

      // Axios interceptors sometimes strip out the outer response.data wrap
      // depending on backend setup. We will look for `answer` safely.
      const resPayload = response?.data || response;
      console.log("res payload is", response)
      let answerText = 'Sorry, I am not able to answer this at the moment.';

      if (response?.data?.limit_reached) {
        answerText = response.message;
        setIsLimitReached(true);
      } else if (resPayload?.data?.answer) {
        answerText = resPayload.data.answer;
      } else if (resPayload?.answer) {
        answerText = resPayload.answer;
      } else if (resPayload?.message) {
        answerText = resPayload.message;
      }

      // Fallback check for message content
      if (answerText.toLowerCase().includes('premium subscription')) {
        setIsLimitReached(true);
      }

      // Log the interaction
      await saveAiLog(userMessage.text, answerText);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        backendId: resPayload?.data?._id || resPayload?._id,
        text: answerText,
        sender: 'ai',
        suggestions: [
          ...(resPayload?.data?.suggested_outfits || resPayload?.suggested_outfits || []),
          ...(resPayload?.data?.suggested_new_outfits || resPayload?.suggested_new_outfits || [])
        ].map(sug => {
          const isAlreadySavedByTitle = savedOutfitsNames.includes(sug.name?.toLowerCase().trim());
          return {
            ...sug,
            is_saved: sug.is_saved || isAlreadySavedByTitle || false
          };
        }),
        missingItems: resPayload?.data?.missing_items || resPayload?.missing_items || [],
        timestamp: new Date()
          .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          .toLowerCase(),
      };

      setMessages(prev => [aiMessage, ...prev]);
    } catch (error) {
      console.log('Chat Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        'Something went wrong. Please try again.';
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date()
          .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          .toLowerCase(),
      };

      setMessages(prev => [aiMessage, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOutfit = async (messageId, suggestionIndex) => {
    try {
      const message = messages.find(m => m.id === messageId);
      console.log("message s1111", message)
      if (!message) return;

      const suggestion = message.suggestions[suggestionIndex];
      console.log("suh\ggestion is", suggestion)
      // Construct a FormData payload with proper file objects
      const formData = new FormData();

      Object.keys(suggestion).forEach(key => {
        if (!['outfit_image', 'images', 'items', 'is_saved'].includes(key)) {
          if (Array.isArray(suggestion[key])) {
            suggestion[key].forEach(val => formData.append(key, val));
          } else if (typeof suggestion[key] === 'object' && suggestion[key] !== null) {
            formData.append(key, JSON.stringify(suggestion[key]));
          } else if (suggestion[key] !== undefined && suggestion[key] !== null) {
            formData.append(key, suggestion[key]);
          }
        }
      });

      formData.append('chat_id', message.backendId);

      if (!suggestion.item_id && suggestion.items && suggestion.items.length) {
        const itemIds = suggestion.items.map(i => i._id || i.item_id).filter(Boolean);
        itemIds.forEach(id => formData.append('item_id', id));
      }

      if (suggestion.outfit_image) {
        let uriToUpload = suggestion.outfit_image;
        if (!uriToUpload.startsWith('file://') && !uriToUpload.startsWith('http')) {
          uriToUpload = `file://${uriToUpload}`;
        }
        const filename = suggestion.outfit_image.split('/').pop() || 'image.jpeg';
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image/jpeg`;
        if (type === 'image/jpg') type = 'image/jpeg';

        formData.append('images', {
          uri: uriToUpload,
          name: filename,
          type: type,
        });
      }

      console.log("formData is ", formData);
      const response = await saveSuggestedOutfitApi(formData);

      if (response?.data?.success || response?.success) {
        showSuccessToast(response?.data?.message || response?.message || 'Outfit saved successfully');


        // Update local state to mark it as saved
        setMessages(prevMessages =>
          prevMessages.map(msg => {
            if (msg.id === messageId) {
              const updatedSuggestions = [...msg.suggestions];
              updatedSuggestions[suggestionIndex] = {
                ...updatedSuggestions[suggestionIndex],
                is_saved: true
              };
              return { ...msg, suggestions: updatedSuggestions };
            }
            return msg;
          })
        );
        navigation.navigate("OutfitHome");
      } else {
        showDangerToast(response?.data?.message || response?.message || 'Failed to save outfit');
      }
    } catch (error) {
      console.log('Save Outfit Error:', error);
      showDangerToast(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const renderHeader = () => (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View entering={FadeInDown.duration(450)}>
        <Header
          showLeftButton={true}
          onLeftButtonPress={() => navigation.goBack()}
          title="Bae"
          backgroundColor={Colors.white}
        />
      </Animated.View>
    </>
  );

  // const renderIntroCard = () => (
  //   <View style={styles.introCard}>
  //     <View style={styles.botAvatarContainer}>
  //       <Image
  //         source={imagePath.BaeImage}
  //         style={styles.botAvatarMain}
  //         resizeMode="contain"
  //       />
  //     </View>
  //     <Text style={styles.introTitle}>Chat with Bae</Text>
  //     <Text style={styles.introSubtitle}>
  //       Closet looks empty. Add your first item now.
  //     </Text>
  //   </View>
  // );

  const renderMessage = ({ item }) => {
    const isAi = item.sender === 'ai';
    const hasSuggestions = isAi && item.suggestions && item.suggestions.length > 0;
    const hasMissingItems = isAi && item.missingItems && item.missingItems.length > 0;

    return (
      <Animated.View
        entering={
          isAi
            ? FadeInLeft.duration(400).springify().damping(18)
            : FadeInRight.duration(400).springify().damping(18)
        }
        style={[
          styles.messageRow,
          isAi ? styles.aiMessageRow : styles.userMessageRow,
        ]}
      >
        {isAi && (
          <View style={styles.aiAvatarSmallContainer}>
            <Image
              source={imagePath.BaeAIcon}
              style={styles.aiAvatarSmall}
              resizeMode="contain"
            />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isAi ? styles.aiBubble : styles.userBubble,
            (hasSuggestions || hasMissingItems) && { maxWidth: '85%' }
          ]}
        >
          <Text style={[styles.messageText, !isAi && styles.userText]}>
            {item.text}
          </Text>

          {/* Suggested Outfits */}
          {hasSuggestions && (
            <View style={styles.suggestionContainer}>
              {item.suggestions.map((suggestion, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.duration(450).delay(index * 120).springify().damping(16)}
                  style={styles.outfitCard}
                >
                  <Text style={styles.outfitName}>{suggestion.name}</Text>
                  <Text style={styles.outfitDesc}>{suggestion.description}</Text>

                  <View style={styles.itemsGrid}>
                    {suggestion.items?.map((itemObj, idx) => (
                      <ScaleButton
                        onPress={() => { navigation.navigate('ClosetDetails', { item: itemObj }) }}
                        key={idx} style={styles.itemThumbContainer}>
                        <Image
                          source={{ uri: itemObj.images?.[0] || itemObj.image }}
                          style={styles.itemThumb}
                        />
                        <Text style={styles.itemName}>{itemObj.name}</Text>
                      </ScaleButton>
                    ))}
                  </View>

                  {suggestion.items && suggestion.items.length > 0 && (
                    <AppButton
                      title={suggestion.is_saved ? "✓ Saved" : "Save Outfit"}
                      disabled={suggestion.is_saved}
                      onPress={() => suggestion.is_saved ? null : handleSaveOutfit(item.id, index)}
                      width={wp(35)}
                      height={hp(4)}
                      borderRadius={wp(10)}
                      style={{ marginTop: hp(1) }}
                      textStyle={{ fontSize: FontSize.FONT_12 }}
                    />
                  )}
                </Animated.View>
              ))}
            </View>
          )}

          {/* Missing Items */}
          {hasMissingItems && (
            <View style={styles.missingContainer}>
              <Text style={styles.missingTitle}>Missing Items:</Text>
              {item.missingItems.map((missing, idx) => (
                <View key={idx} style={styles.missingItemRow}>
                  <View style={styles.missingDot} />
                  <Text style={styles.missingText}>{missing}</Text>
                </View>
              ))}
            </View>
          )}

          <View
            style={[
              styles.timestampContainer,
              isAi ? styles.timestampLeft : null,
            ]}
          >
            <Text
              style={[
                styles.timestampText,
                !isAi ? styles.userTimestampText : null,
              ]}
            >
              {item.timestamp}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSuggestions = () => {
    if (isLoading) return null;
    return (
      <View style={styles.suggestionsWrapper}>
        <FlatList
          horizontal
          data={isLimitReached ? [] : suggestedQuestions}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsList}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.duration(400).delay(index * 90).springify().damping(16)}
            >
              <ScaleButton
                style={[styles.suggestionChip, isLimitReached && { opacity: 0.5 }]}
                onPress={() => !isLimitReached && sendMessage(item)}
                disabled={isLimitReached}
              >
                <Text style={styles.suggestionChipText}>✨ {item}</Text>
              </ScaleButton>
            </Animated.View>
          )}
        />
      </View>
    );
  };

  const renderInputArea = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.textInput, isLimitReached && { color: Colors.graytext, opacity: 0.7 }]}
          placeholder={isLimitReached ? "Subscription limit reached" : "Ask what to wear today..."}
          placeholderTextColor={Colors.graytext}
          value={inputText}
          onChangeText={text => {
            if (isListeningRef.current) {
              // Manual edit while listening — stop mic so text doesn't get overwritten/duplicated
              stopListening();
            }
            inputTextRef.current = text;
            setInputText(text);
          }}
          multiline
          maxLength={300}
          editable={!isLimitReached && !isLoading}
        />
        <TouchableOpacity
          onPress={toggleListening}
          disabled={isLimitReached || isLoading}
          style={[styles.inputIconButton, isLimitReached && { opacity: 0.5 }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                left: wp(1),
                width: wp(6),
                height: wp(6),
                borderRadius: wp(3),
                backgroundColor: Colors.themeColor,
              },
              micRingStyle,
            ]}
          />
          <Image
            source={imagePath.mic}
            style={[
              styles.inputIcon,
              isListening && styles.micIconActive,
              isLimitReached && { tintColor: Colors.graytext }
            ]}
          />
        </TouchableOpacity>
      </View>
      <Animated.View style={sendButtonStyle}>
        <AppButton
          style={[styles.sendIconContainer, isLimitReached && { backgroundColor: Colors.borderGrey }]}
          onPress={handleSend}
          disabled={isLoading || !inputText.trim() || isLimitReached}
          width={wp(11.5)}
          height={wp(11.5)}
          borderRadius={wp(100)}
          opacity={1}
          disabledOpacity={isLimitReached ? 0.6 : 1}
        >
          <Image
            source={imagePath.send1}
            style={styles.sendIcon}
            resizeMode="contain"
          />
        </AppButton>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}
        >
          {isLoadingHistory && messages.length <= 1 ? (
            <ChatSkeleton count={5} />
          ) : (
          <FlatList
            ref={flatListRef}
            inverted
            data={messages}
            keyExtractor={item => item.id}
            ListFooterComponent={() => (
              <>
                {/* {renderIntroCard()} */}
                {messages.length > 0 && (
                  <Text style={styles.dateSeparatorText}>Today</Text>
                )}
              </>
            )}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatListContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() =>
              isLoading ? (
                <View style={[styles.messageRow, styles.aiMessageRow]}>
                  <View style={styles.aiAvatarSmallContainer}>
                    <Image
                      source={imagePath.BaeAIcon}
                      style={styles.aiAvatarSmall}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={[
                      styles.messageBubble,
                      styles.aiBubble,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: wp(4),
                        paddingVertical: hp(1.8),
                      },
                    ]}
                  >
                    <TypingIndicator color={Colors.themeColor} />
                  </View>
                </View>
              ) : null
            }
          />
          )}
        </View>

        <View style={{ backgroundColor: Colors.white }}>
          {renderSuggestions()}
          {renderInputArea()}
          <SafeAreaView edges={['bottom']} />
        </View>
      </KeyboardAvoidingView>

      <AiDataConsentModal
        visible={showAiConsentModal}
        onAccept={handleAcceptAiConsent}
        onDecline={handleDeclineAiConsent}
      />
    </View>
  );
};

export default AiHomeScreen;
