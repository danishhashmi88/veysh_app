import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { hp, wp } from '../../../utils/helper';
import { OutfitFamily } from '../../../constant/fonts';
import ScaleButton from '../animations/ScaleButton';
import { OotdSkeleton } from '../animations/HomeSkeletons';

const OutfitOfTheDay = ({ styles, ootdList, handleNavigation, IMAGEURL, loading }) => {

  const renderOOTDItem = ({ item }) => {
    const getPlannerImages = item => {
        let images = [];
        const outfit =
          item?.outfit ||
          (item?.outfit_id && typeof item.outfit_id === 'object'
            ? item.outfit_id
            : null);

        if (outfit) {
          let imgPath = outfit.image;
          if (!imgPath && outfit.images && outfit.images.length > 0)
            imgPath = outfit.images[0];
          if (imgPath) {
            if (imgPath.startsWith('http')) images.push({ uri: imgPath });
            else {
              let formattedPath = imgPath;
              if (!formattedPath.includes('uploads/'))
                formattedPath = `uploads/outfits/${formattedPath}`;
              images.push({ uri: `${IMAGEURL}${formattedPath}` });
            }
          }
        } else if (item?.items && item.items.length > 0) {
          item.items.forEach(it => {
            let imgPath =
              it.images && it.images.length > 0 ? it.images[0] : it.image;
            if (imgPath) {
              if (imgPath.startsWith('http')) images.push({ uri: imgPath });
              else images.push({ uri: `${IMAGEURL}${imgPath}` });
            }
          });
        } else if (item?.item) {
          let it = item.item;
          let imgPath = it.images && it.images.length > 0 ? it.images[0] : it.image;
          if (imgPath) {
            if (imgPath.startsWith('http')) images.push({ uri: imgPath });
            else images.push({ uri: `${IMAGEURL}${imgPath}` });
          }
        } else if (item?.item_id && typeof item.item_id === 'object') {
          const it = item.item_id;
          const imgPath =
            it.images && it.images.length > 0 ? it.images[0] : it.image;
          if (imgPath) {
            if (imgPath.startsWith('http')) images.push({ uri: imgPath });
            else {
              let formattedPath = imgPath;
              if (!formattedPath.includes('uploads/'))
                formattedPath = `uploads/items/${formattedPath}`;
              images.push({ uri: `${IMAGEURL}${formattedPath}` });
            }
          }
        }
    
        if (images.length === 0 && item?.images && item.images.length > 0) {
          const imgPath = item.images[0];
          if (imgPath) {
            if (imgPath.startsWith('http')) images.push({ uri: imgPath });
            else images.push({ uri: `${IMAGEURL}${imgPath}` });
          }
        }
    
        return images;
    };

    const images = getPlannerImages(item);

    const formatDate = (dateString, timeString) => {
      if (!dateString) return 'TODAY • ' + (timeString || '1:15 PM');
      const date = new Date(dateString);
      const today = new Date();

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      if (isToday) {
        return timeString ? `TODAY • ${timeString}` : 'TODAY';
      }

      const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      };
      const formattedDate = date
        .toLocaleDateString('en-US', options)
        .toUpperCase();
      return timeString ? `${formattedDate} • ${timeString}` : formattedDate;
    };

    return (
      <View style={styles.ootdShadowWrapper}>
        <ScaleButton
          style={styles.ootdMainCard}
          scaleTo={0.97}
          onPress={() => handleNavigation('ItemDetail', { item })}
        >
          {/* IMAGE SECTION */}
          <View style={styles.ootdImageContainer}>
            {images.length > 0 ? (
                images.length === 1 ? (
                    <Image source={images[0]} style={styles.ootdMainImage} />
                ) : (
                    <View style={styles.ootdMultiImageContainer}>
                        {images.map((img, idx) => (
                            <Image 
                                key={idx} 
                                source={img} 
                                style={styles.ootdSmallImage} 
                            />
                        ))}
                    </View>
                )
            ) : (
              <View
                style={[
                  styles.ootdMainImage,
                  {
                    backgroundColor: '#f2f2f2',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: OutfitFamily.Medium,
                    color: '#6B7280',
                    fontSize: 10,
                    textAlign: 'center',
                  }}
                >
                  No Image{`\n`}Found
                </Text>
              </View>
            )}
          </View>

          {/* INFO SECTION */}
          <View style={styles.ootdInfoSection}>
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>
                {formatDate(item?.event_date, item?.event_time)}
              </Text>
            </View>

            <Text style={styles.ootdTitle} numberOfLines={1}>
              {item?.name || 'Outfit Planner'}
            </Text>

            <Text style={styles.ootdDetails} numberOfLines={2}>
              {item?.notes || ''}
            </Text>
          </View>
        </ScaleButton>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.ootdEmptyCard}>
      <View style={styles.ootdEmptyIconContainer}>
        <Image source={imagePath.calender} style={styles.ootdEmptyIcon} />
      </View>
      <Text style={styles.ootdEmptyTitle}>No outfit for today</Text>
      <Text style={styles.ootdEmptySubtitle}>
        You don't have any outfit planned for today
      </Text>

      <TouchableOpacity
        style={styles.ootdEmptyButton}
        onPress={() => handleNavigation('CreatePlanner', { planForToday: true })}
        activeOpacity={0.8}
      >
        <Text style={styles.ootdEmptyButtonText}>Plan Outfit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.sectionContainer}>
      {/* HEADER */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Outfit Of The Day</Text>

        {ootdList && ootdList.length > 0 && <TouchableOpacity
          onPress={() => handleNavigation('CreatePlanner', { eventDetail: ootdList && ootdList[0] })}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={styles.changeText}>
            {'Change'}
          </Text>

          <Image
            source={imagePath.chevronDown}
            style={[
              styles.headerChevron,
              { transform: [{ rotate: '270deg' }] },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>}
      </View>

      {/* LIST OR EMPTY STATE */}
      {loading && (!ootdList || ootdList.length === 0) ? (
        <OotdSkeleton />
      ) : ootdList && ootdList.length > 0 ? (
        <FlatList
          data={ootdList}
          renderItem={renderOOTDItem}
          keyExtractor={item => (item._id || item.id)?.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={wp(92)}
          contentContainerStyle={{ paddingVertical: hp(1) }}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

export default OutfitOfTheDay;
