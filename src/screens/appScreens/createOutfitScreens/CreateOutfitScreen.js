import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { captureRef } from 'react-native-view-shot';
import LinearGradient from 'react-native-linear-gradient';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

// Custom redx & utils
import { getItemsList, getCategories } from '../../../redux/thunks/itemsThunk';
import { showToast, showDangerToast } from '../../../utils/toast';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp } from '../../../utils/helper';
import { styles } from './styles';
import Header from '../../../component/common/UI/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGEURL } from '../../../utils/axios';
import { FontFamily, FontSize, OutfitFamily } from '../../../constant/fonts';

const ITEM_SIZE = wp(30);
const MIN_ITEM_SCALE = 0.5;
const MAX_ITEM_SCALE = 2.5;
const SELECTED_SCALE_BOOST = 1.05;

const clampItemPosition = (
  x,
  y,
  scale,
  canvasWidth,
  canvasHeight,
  selectionBoost = 1,
) => {
  'worklet';
  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return { x, y };
  }

  const effectiveScale = scale * selectionBoost;
  const minX = Math.max(0, (ITEM_SIZE * (effectiveScale - 1)) / 2);
  const maxX = Math.max(
    minX,
    canvasWidth - (ITEM_SIZE * (1 + effectiveScale)) / 2,
  );
  const minY = Math.max(0, (ITEM_SIZE * (effectiveScale - 1)) / 2);
  const maxY = Math.max(
    minY,
    canvasHeight - (ITEM_SIZE * (1 + effectiveScale)) / 2,
  );

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
};

const clampItemScale = (scale, maxScale) => {
  'worklet';
  const upperBound = maxScale > 0 ? maxScale : MAX_ITEM_SCALE;
  return Math.min(upperBound, Math.max(MIN_ITEM_SCALE, scale));
};

// --- Draggable Item Component ---
const DraggableItemInternal = ({
  item,
  onPositionChange,
  onSelect,
  isSelected,
  onDelete,
  canvasWidth,
  canvasHeight,
  maxScale,
}) => {
  const translationX = useSharedValue(item.x);
  const translationY = useSharedValue(item.y);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const scale = useSharedValue(item.scale || 1);
  const startScale = useSharedValue(1);

  const rotation = useSharedValue(item.rotation || 0);
  const startRotation = useSharedValue(0);
  const selectionBoost = isSelected ? SELECTED_SCALE_BOOST : 1;

  useEffect(() => {
    translationX.value = item.x;
    translationY.value = item.y;
    if (item.scale !== undefined) scale.value = item.scale;
    if (item.rotation !== undefined) rotation.value = item.rotation;
  }, [item.x, item.y, item.scale, item.rotation]);

  const updateItemState = () => {
    onPositionChange(
      item.id,
      translationX.value,
      translationY.value,
      scale.value,
      rotation.value,
    );
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(onSelect)(item.id);
      startX.value = translationX.value;
      startY.value = translationY.value;
    })
    .onUpdate(event => {
      let newX = startX.value + event.translationX;
      let newY = startY.value + event.translationY;

      const clamped = clampItemPosition(
        newX,
        newY,
        scale.value,
        canvasWidth,
        canvasHeight,
        selectionBoost,
      );

      translationX.value = clamped.x;
      translationY.value = clamped.y;
    })
    .onEnd(() => {
      const clamped = clampItemPosition(
        translationX.value,
        translationY.value,
        scale.value,
        canvasWidth,
        canvasHeight,
        selectionBoost,
      );
      translationX.value = clamped.x;
      translationY.value = clamped.y;
      runOnJS(updateItemState)();
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      runOnJS(onSelect)(item.id);
      startScale.value = scale.value;
    })
    .onUpdate(event => {
      const nextScale = clampItemScale(startScale.value * event.scale, maxScale);
      scale.value = nextScale;

      const clamped = clampItemPosition(
        translationX.value,
        translationY.value,
        nextScale,
        canvasWidth,
        canvasHeight,
        selectionBoost,
      );
      translationX.value = clamped.x;
      translationY.value = clamped.y;
    })
    .onEnd(() => {
      scale.value = clampItemScale(scale.value, maxScale);
      const clamped = clampItemPosition(
        translationX.value,
        translationY.value,
        scale.value,
        canvasWidth,
        canvasHeight,
        selectionBoost,
      );
      translationX.value = clamped.x;
      translationY.value = clamped.y;
      runOnJS(updateItemState)();
    });

  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      runOnJS(onSelect)(item.id);
      startRotation.value = rotation.value;
    })
    .onUpdate(event => {
      rotation.value = startRotation.value + event.rotation;
    })
    .onEnd(() => {
      runOnJS(updateItemState)();
    });

  const composedGestures = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    rotationGesture,
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value * (isSelected ? SELECTED_SCALE_BOOST : 1) },
        { rotate: `${rotation.value}rad` },
      ],
      zIndex: isSelected ? 10 : 1,
      borderRadius: 10,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const currentScale = scale.value * (isSelected ? SELECTED_SCALE_BOOST : 1);
    return {
      transform: [{ scale: 1 / currentScale }],
    };
  });

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={[styles.draggableItem, animatedStyle]}>
        <Image
          source={item.image}
          style={[styles.itemImage, { borderRadius: 10 }]}
          resizeMode="contain"
        />
        {isSelected && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 2,
                right: 2,
                zIndex: 100,
              },
              iconAnimatedStyle,
            ]}
          >
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderRadius: wp(10),
                padding: wp(1.5),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 5,
              }}
              onPress={() => {
                runOnJS(onDelete)(item.id);
              }}
            >
              <Image
                source={imagePath.delete}
                style={{
                  width: wp(5),
                  height: wp(5),
                  tintColor: Colors.themeColor,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

// --- Main Screen Component ---
const CreateOutfitScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux State
  const { itemsList, ItemCategoryList, loading } = useSelector(
    state => state.items,
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [outfitItems, setOutfitItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false); // State to hide icon during capture
  const [canvasBounds, setCanvasBounds] = useState({ width: 0, height: 0 });
  const viewRef = useRef();

  const maxItemScale = useMemo(() => {
    if (canvasBounds.width <= 0 || canvasBounds.height <= 0) {
      return MAX_ITEM_SCALE;
    }

    const fitScale =
      (Math.min(canvasBounds.width, canvasBounds.height) / ITEM_SIZE) * 0.98;

    return Math.min(MAX_ITEM_SCALE, Math.max(MIN_ITEM_SCALE, fitScale));
  }, [canvasBounds.width, canvasBounds.height]);

  // Fetch Categories once on mount
  useEffect(() => {
    dispatch(getCategories({ type: 'item' }));
  }, []);

  // Fetch Items when Category Changes
  useEffect(() => {
    if (!selectedCategory?._id) return;

    const payload = {
      page: 1,
      per_page: 10,
      sort: { column: 'price_sort', order: 1 },
      search: { category: selectedCategory._id },
    };

    dispatch(getItemsList(payload));
  }, [selectedCategory?._id]);

  // Auto-select first category when list loads
  useEffect(() => {
    if (ItemCategoryList?.length > 0 && !selectedCategory) {
      setSelectedCategory(ItemCategoryList[0]);
    }
  }, [ItemCategoryList]);

    // Load existing items if editing or if navigating from Closet Details
    const { outfitData, selectedItem, aiSuggestion } = useRoute().params || {};

    useEffect(() => {
        if (!outfitData && !selectedItem) return;

        console.log('[CreateOutfitScreen] Processing input data for items...', {
            outfitId: outfitData?._id,
            hasItems: !!outfitData?.items?.length,
            hasItemIds: !!outfitData?.item_id?.length,
            hasImages: !!outfitData?.images?.length
        });

        let rawItemsList = [];
        if (outfitData) {
            
            rawItemsList =
                outfitData.items ||
                outfitData.item_id ||
                outfitData.item_details ||
                [];

            
            if (typeof rawItemsList === 'string') {
                try {
                    rawItemsList = JSON.parse(rawItemsList);
                } catch (e) {
                    rawItemsList = [rawItemsList];
                }
            }
            
            if (rawItemsList.length === 0 && outfitData.images?.length > 0) {
                console.log('[CreateOutfitScreen] Falling back to images array for mapping');
                rawItemsList = outfitData.images;
            }
        }

        if (rawItemsList.length > 0 && outfitItems.length === 0) {
            const baseUrl = IMAGEURL.endsWith('/') ? IMAGEURL.slice(0, -1) : IMAGEURL;
            
            const loadedItems = rawItemsList.map((item, index) => {
                const itemObj = typeof item === 'string' ? { image: item } : item;
                const originalId = itemObj._id || itemObj.id || (typeof item === 'string' ? item : undefined);

                // Safe Image Resolution - Align with gallery logic + fix for broken full URLs
                let imageSource = null;
                const imgRaw = (itemObj.images && itemObj.images.length > 0) ? itemObj.images[0] : itemObj.image;

                if (imgRaw) {
                    if (typeof imgRaw === 'string') {
                        if (imgRaw.startsWith('http')) {
                            // HEURISTIC: If it's a full URL but missing 'uploads/', it might be a broken root URL
                            if (!imgRaw.includes('uploads/')) {
                                const filename = imgRaw.split('/').pop();
                                imageSource = { uri: `${baseUrl}/uploads/items/${filename}` };
                                console.log('[CreateOutfitScreen] Fixed broken root URL:', imgRaw, '->', imageSource.uri);
                            } else {
                                imageSource = { uri: imgRaw };
                            }
                        } else {
                            let path = imgRaw;
                            // Ensure items have the correct uploads prefix
                            if (!path.includes('uploads/')) {
                                path = `uploads/items/${path}`;
                            }
                            // Avoid double slashes
                            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
                            imageSource = { uri: `${baseUrl}/${cleanPath}` };
                        }
                    } else if (typeof imgRaw === 'object' && imgRaw.uri) {
                        imageSource = imgRaw;
                    }
                }

                console.log(`[CreateOutfitScreen] Item ${index} final resolved URI:`, imageSource?.uri);

                // Disperse items near the center of the canvas
                const centerX = wp(30); // (wp(90) - wp(30)) / 2
                const centerY = wp(30); 
                const offset = index * 15; // Slight offset so they don't perfectly overlap

                return {
                    id: `edit_${Date.now()}_${index}`,
                    originalId: originalId,
                    image: imageSource,
                    x: centerX + offset,
                    y: centerY + offset,
                    scale: 1,
                    rotation: 0
                };
            }).filter(item => item.image?.uri || typeof item.image === 'number');

            if (loadedItems.length > 0) {
                console.log(`[CreateOutfitScreen] Successfully mapped ${loadedItems.length} items to canvas`);
                setOutfitItems(loadedItems);
            }
        }
        // 3. Handle single selected item case
        else if (selectedItem && outfitItems.length === 0) {
            const baseUrl = IMAGEURL.endsWith('/') ? IMAGEURL.slice(0, -1) : IMAGEURL;
            let imageSource = selectedItem.image;
            
            if (selectedItem.images && selectedItem.images.length > 0) {
                const imagePathStr = selectedItem.images[0];
                imageSource = imagePathStr.startsWith('http')
                    ? { uri: imagePathStr }
                    : { uri: `${baseUrl}${imagePathStr.startsWith('/') ? '' : '/'}${imagePathStr}` };
            }

            const newItem = {
                id: `direct_${Date.now()}`,
                originalId: selectedItem.id || selectedItem._id,
                image: imageSource,
                x: wp(35),
                y: hp(15),
                scale: 1,
                rotation: 0
            };
            setOutfitItems([newItem]);
            setSelectedItemId(newItem.id);
        }
    }, [outfitData, selectedItem]);

  // Construct Categories List
  const allCategories = useMemo(() => {
    return ItemCategoryList || [];
  }, [ItemCategoryList]);

  const handleAddItem = item => {
    const isAlreadyAdded = outfitItems.some(
      i => String(i.originalId) === String(item.id || item._id),
    );

    if (isAlreadyAdded) {
      showDangerToast('This item is already added');
      return;
    }

    // Handle API image structure
    let imageSource = item.image;
    if (item.images && item.images.length > 0) {
      const imagePathStr = item.images[0];
      if (imagePathStr.startsWith('http')) {
        imageSource = { uri: imagePathStr };
      } else {
        imageSource = {
          uri: `${IMAGEURL}${imagePathStr}`,
        };
      }
    }

    const newItem = {
      id: Date.now().toString(),
      originalId: item.id || item._id,
      image: imageSource,
      x: wp(35),
      y: hp(15),
    };
    setOutfitItems([...outfitItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  const handleNext = async () => {
    if (outfitItems.length === 0) {
      showDangerToast('Please add at least one item to the outfit');
      return;
    }

    try {
      setSelectedItemId(null); // Deselect item to hide delete icon
      setIsCapturing(true);
      // Give React time to re-render without the icon
      setTimeout(async () => {
        try {
          const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 1,
            result: 'tmpfile',
          });
          console.log('Screenshot URI:', uri);
          setIsCapturing(false);

          // Extract Item IDs (originalId)
          const itemIds = outfitItems.map(i => i.originalId);

          // Navigate to Details Screen
          navigation.navigate({
            name: 'AddOutfitDetails',
            params: {
              imageUri: uri,
              category:
                selectedCategory && selectedCategory._id !== 'ALL'
                  ? selectedCategory._id
                  : null,
              itemIds: itemIds, // Pass IDs
              outfitData: outfitData, // Pass back original data to maintain Edit Mode
            },
            merge: true,
          });
        } catch (innerError) {
          console.error('Screenshot Capture Failed:', innerError);
          setIsCapturing(false);
          showDangerToast('Failed to capture outfit image');
        }
      }, 100);
    } catch (error) {
      console.error('Screenshot Error:', error);
      setIsCapturing(false);
      showDangerToast('Failed to initiate capture');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          showLeftButton={true}
          onLeftButtonPress={() => navigation.goBack()}
          title="Create Outfit"
          backgroundColor={Colors.white}
          rightComponent={
            <TouchableOpacity onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          }
        />
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.white}
        />

        {/* Canvas Area Wrapped in Screen Background */}
        <View style={{ backgroundColor: Colors.backGroundColor1, paddingVertical: hp(7), flex: 1 }}>
          <View style={styles.canvasContainer}>

            <View
              ref={viewRef}
              collapsable={false}
              style={styles.canvas}
              onLayout={event => {
                const { width, height } = event.nativeEvent.layout;
                setCanvasBounds({ width, height });
              }}
            >
              {/* Placeholder removed from inside canvas as it is displayed below */}
              {outfitItems.map(item => (
                <DraggableItemInternal
                  key={item.id}
                  item={item}
                  isSelected={selectedItemId === item.id}
                  onSelect={setSelectedItemId}
                  onDelete={id => {
                    setOutfitItems(prev => prev.filter(i => i.id !== id));
                    setSelectedItemId(null);
                  }}
                  canvasWidth={canvasBounds.width}
                  canvasHeight={canvasBounds.height}
                  maxScale={maxItemScale}
                  onPositionChange={(id, x, y, scale = 1, rotation = 0) => {
                    setOutfitItems(prev =>
                      prev.map(i =>
                        i.id === id ? { ...i, x, y, scale, rotation } : i,
                      ),
                    );
                  }}
                />
              ))}
            </View>

            {/* Bot Icon Overlay - Hidden during capture */}
            {!isCapturing && (
              <View style={styles.botIconContainer}>
                <TouchableOpacity style={styles.botIconCircle}
                  onPress={() =>
                    navigation.navigate('AiHomeScreen', {
                      // initialMessage: 'Analyze my closet and suggest a perfect outfit!',
                      isScanning: true,
                    })
                  }
                >
                  <Image
                    source={imagePath.BaeAIcon}
                    style={{
                      width: wp(11),
                      height: wp(11),
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* AI Suggestion Banner */}
        {!!aiSuggestion && (
          <View
            style={{
              marginHorizontal: wp(4),
              marginBottom: hp(1),
              backgroundColor: '#F5EEFF',
              borderRadius: wp(3),
              padding: wp(3),
              borderLeftWidth: 3,
              borderLeftColor: '#7100D7',
            }}
          >
            <Text
              style={{
                fontSize: wp(3.2),
                color: '#7100D7',
                fontFamily: OutfitFamily.Medium,
                marginBottom: hp(0.3),
              }}
            >
              ✨ Bae's Suggestion
            </Text>
            <Text
              numberOfLines={3}
              style={{ fontSize: wp(3), color: '#444', lineHeight: wp(4.5) }}
            >
              {aiSuggestion}
            </Text>
          </View>
        )}
        < View style={styles.paddingStyle}>
          <Text style={styles.instructionText}>
            Drag & drop items here to create your outfit
          </Text>

          {/* Category List */}
          <View style={styles.categoryContainer}>
            <FlatList
              data={allCategories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedCategory?._id === item._id;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(item)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.categoryTab,
                        isSelected && styles.categoryTabSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          isSelected && styles.categoryTextSelected,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Items List */}
          <View style={styles.itemsListContainer}>
            <View style={styles.actionRow}>
              <FlatList
                data={itemsList}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => (item.id || item._id).toString()}
                ListEmptyComponent={() =>
                  !loading ? (
                    <View
                      style={{
                        backgroundColor: 'white',
                        // paddingHorizontal: wp(12),
                        // paddingVertical: hp(4),
                        borderRadius: 10,
                        // marginHorizontal: wp(4),
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        // alignSelf: 'center',
                        // borderWidth: 1,
                        // borderColor: '#f0f0f0',
                        // Optional shadow
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.graytext,
                          fontSize: FontSize.FONT_16,
                          fontFamily: FontFamily?.Bold,
                        }}
                      >
                        No item available in this category
                      </Text>
                    </View>
                  ) : null
                }
                contentContainerStyle={
                  !itemsList || itemsList.length === 0
                    ? { flex: 1, justifyContent: 'center', marginLeft: wp(-1.8) }
                    : {}
                }
                renderItem={({ item }) => {
                  // helper to resolve image
                  let imageSource = item.image;
                  if (item.images && item.images.length > 0) {
                    const imagePathStr = item.images[0];
                    if (imagePathStr.startsWith('http')) {
                      imageSource = { uri: imagePathStr };
                    } else {
                      imageSource = {
                        uri: `${IMAGEURL}${imagePathStr}`,
                      };
                    }
                  }

                  const isAlreadyAdded = outfitItems.some(
                    i => String(i.originalId) === String(item.id || item._id),
                  );

                  return (
                    <TouchableOpacity
                      onPress={() => handleAddItem(item)}
                      style={[
                        styles.listItem,
                        isAlreadyAdded && { opacity: 0.5 },
                      ]}
                      disabled={isAlreadyAdded}
                    >
                      <Image source={imageSource} style={styles.listImage} />
                      {isAlreadyAdded && (
                        <View
                          style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            borderRadius: styles.listImage?.borderRadius || 10,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default CreateOutfitScreen;
