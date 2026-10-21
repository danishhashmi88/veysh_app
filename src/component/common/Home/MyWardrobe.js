import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { imagePath } from '../../../constant/imagePath';
import ScaleButton from '../animations/ScaleButton';
import { WardrobeItemsSkeleton } from '../animations/HomeSkeletons';

const MyWardrobe = ({
  styles,
  data,
  handleNavigation,
  activeTab,
  handleTabPress,
  wardrobeItems,
  IMAGEURL,
  totalItems,
  loading,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.wardrobeHeader}>
        <Text style={styles.sectionTitle}>My Closet</Text>
        <TouchableOpacity
          onPress={() => handleNavigation('MyCloset')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={styles.changeText}>See All</Text>
          <Image
            source={imagePath.chevronDown}
            style={[
              styles.headerChevron,
              { transform: [{ rotate: '270deg' }] },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <WardrobeItemsSkeleton />
      ) : (
        <>
          <View style={styles.filterContainer}>
            {data.wardrobeInsights.tabs.map(tab => {
              const isActive = activeTab === tab;
              return (
                <ScaleButton
                  key={tab}
                  onPress={() => handleTabPress(tab)}
                  style={[styles.filterPill, isActive && styles.activeFilterPill]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      isActive && styles.activeFilterText,
                    ]}
                  >
                    {tab}
                  </Text>
                </ScaleButton>
              );
            })}
          </View>

          <View style={styles.wardrobeListContainer}>
            {wardrobeItems && wardrobeItems.length > 0 ? (
          <Animated.View key={activeTab} entering={FadeIn.duration(350)}>
            <FlatList
              data={wardrobeItems.slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item._id ?? index.toString()}
              renderItem={({ item, index }) => {
                let imageUri = '';
                const itemImg = item.image || (item.images && item.images[0]);
                if (itemImg) {
                  let cleanImg = String(itemImg).trim().replace(/\\/g, '/');
                  imageUri = cleanImg.toLowerCase().startsWith('http')
                    ? cleanImg
                    : `${IMAGEURL}${cleanImg}`;
                }
                return (
                  <Animated.View
                    entering={FadeInRight.duration(350).delay(index * 60)}
                  >
                    <ScaleButton
                      style={styles.wardrobeItem}
                      scaleTo={0.96}
                      onPress={() => handleNavigation('ClosetDetails', { item })}
                    >
                      <View style={styles.itemImageContainer}>
                        {imageUri ? (
                          <Image
                            source={{ uri: imageUri }}
                            style={styles.itemImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[styles.itemImage, { backgroundColor: '#F2F2F2' }]}
                          />
                        )}
                      </View>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.title || item.name || 'Item'}
                      </Text>
                    </ScaleButton>
                  </Animated.View>
                );
              }}
            />
          </Animated.View>
        ) : (
          <View style={styles.noItemContainer}>
            <View style={styles.ootdEmptyIconContainer}>
              <Image source={imagePath.outfit} style={styles.emptuyIcon} />
            </View>
            <Text style={styles.noItemText}>No item found</Text>
          </View>
        )}
          </View>
        </>
      )}
    </View>
  );
};

export default MyWardrobe;
