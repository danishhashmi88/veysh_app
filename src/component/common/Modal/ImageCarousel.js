import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable
} from 'react-native';
import Video from 'react-native-video';
import { getImageUrl } from '../../../utils/helper';

const CarouselItem = React.memo(
  ({
    item,
    containerWidth,
    height,
    imageStyle,
    isActive,
    socialCommunity,
    borderRadius,
    onPress,
  }) => {
    const [loading, setLoading] = useState(true);

    return (
      <View
        pointerEvents="box-none"
        style={{
          width: containerWidth,
          height,
          borderRadius: !socialCommunity ? 0 : 0,
          overflow: 'hidden',
          backgroundColor: socialCommunity ? '#000' : '#F5F5F5',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={onPress}
          style={styles.mediaPressable}
        >
          {item.type === 'image' ? (
            <Image
              source={{ uri: getImageUrl(item.uri) }}
              style={[
                styles.image,
                { width: containerWidth, height },
                imageStyle,
              ]}
              resizeMode="contain"
              onLoadEnd={() => setLoading(false)}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          ) : (
            <View pointerEvents={socialCommunity ? 'auto' : 'none'} style={{ width: containerWidth, height }}>
              <Video
                source={{ uri: getImageUrl(item.uri) }}
                style={[styles.image, { width: containerWidth, height }, imageStyle]}
                resizeMode="contain"
                muted
                repeat
                controls={socialCommunity ? true : false}
                paused={!isActive}
                ignoreSilentSwitch="ignore"
                playInBackground={true}
                playWhenInactive={false}
                poster={item.thumbnail ? getImageUrl(item.thumbnail) : null}
                posterResizeMode="contain"
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            </View>
          )}
        </Pressable>
        {loading && (
          <View style={[StyleSheet.absoluteFill, styles.loaderContainer]}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
      </View>
    );
  },
);

const ImageCarousel = ({
  images = [],
  videos = [],
  thumbnail = null,
  height = 240,
  width: manualWidth,
  imageStyle = {},
  containerStyle = {},
  showDots = true,
  isParentVisible = true,
  socialCommunity,
  borderRadius,
  onPress,
  useScrollView = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(0);

  const containerWidth = manualWidth || layoutWidth;

  // 🔹 Combine media for carousel (order: images → videos)
  const mediaList = React.useMemo(
    () => [
      ...(Array.isArray(images)
        ? images.map(uri => ({ type: 'image', uri }))
        : []),
      ...(Array.isArray(videos)
        ? videos.map((uri, index) => ({
          type: 'video',
          uri,
          thumbnail: Array.isArray(thumbnail)
            ? thumbnail[index]
            : index === 0
              ? thumbnail
              : null,
        }))
        : []),
    ],
    [images, videos, thumbnail],
  );

  const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <CarouselItem
        item={item}
        containerWidth={containerWidth > 0 ? containerWidth : manualWidth || 0}
        height={height}
        imageStyle={imageStyle}
        isActive={
          isParentVisible && (mediaList.length === 1 || index === activeIndex)
        }
        socialCommunity={socialCommunity}
        borderRadius={borderRadius}
        onPress={onPress}
      />
    ),
    [
      containerWidth,
      manualWidth,
      height,
      imageStyle,
      mediaList.length,
      activeIndex,
      isParentVisible,
      borderRadius,
      onPress,
    ],
  );

  if (!mediaList.length) return null;

  const itemWidth = containerWidth > 0 ? containerWidth : 0;
  const hasMeasuredWidth = itemWidth > 0;

  const carouselContent = !hasMeasuredWidth ? null : useScrollView ? (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onMomentumScrollEnd={e => {
        if (!itemWidth) return;
        const index = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
        setActiveIndex(index);
      }}
    >
      {mediaList.map((item, index) => (
        <CarouselItem
          key={`${item.type}-${index}`}
          item={item}
          containerWidth={itemWidth}
          height={height}
          imageStyle={imageStyle}
          isActive={
            isParentVisible && (mediaList.length === 1 || index === activeIndex)
          }
          socialCommunity={socialCommunity}
          borderRadius={borderRadius}
          onPress={onPress}
        />
      ))}
    </ScrollView>
  ) : (
    <FlatList
      key={`carousel-${itemWidth}`}
      data={mediaList}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth}
      snapToAlignment="center"
      decelerationRate="fast"
      disableIntervalMomentum={true}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      keyExtractor={(_, index) => index.toString()}
      getItemLayout={(_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      renderItem={renderItem}
      scrollEventThrottle={16}
      nestedScrollEnabled
    />
  );

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.outerPadding}>
        <View
          style={[
            styles.carouselContainer,
            {
              height,
              width: manualWidth || '100%',
              backgroundColor: socialCommunity ? '#000' : '#F5F5F5',
            },
          ]}
          onLayout={e =>
            !manualWidth && setLayoutWidth(e.nativeEvent.layout.width)
          }
        >
          {carouselContent}

          {/* Dots */}
          {showDots && mediaList.length > 1 && hasMeasuredWidth && (
            <View style={styles.dotsContainer}>
              {mediaList.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  wrapper: {
    // marginTop: 8,
  },
  outerPadding: {
    // paddingHorizontal: 12,
  },
  carouselContainer: {
    overflow: 'hidden',
  },
  mediaPressable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
  },
});
