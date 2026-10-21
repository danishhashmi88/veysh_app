import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getStyles } from './styles';
import { imagePath } from '../../../../constant/imagePath';
import {
  getLookbookListApi,
  deleteLookbookItemApi,
} from '../../../../services/user.service';
import { useTheme } from '../../../../hooks/useTheme';
import AppButton from '../../../../component/common/Buttons/AppButton';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';
import { hp, wp } from '../../../../utils/helper';
import { FontSize } from '../../../../constant/fonts';
import Header from '../../../../component/common/UI/Header';
import NoDataText from '../../../../component/common/UI/NoDataText';

const LookBookHome = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lookbookPosts, setLookbookPosts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchLookbook();
    }, []),
  );

  const fetchLookbook = async () => {
    try {
      const payload = {
        page: 1,
        limit: 100, // Or implement pagination
      };

      const res = await getLookbookListApi(payload);
      console.log('LOOKBOOK API RES:', res);
      if (res?.success) {
        console.log('LOOKBOOK ITEMS:', res.data?.items);
        setLookbookPosts(res.data?.items || []);
      }
    } catch (error) {
      console.log('Error fetching lookbook', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLookbook();
  };

  const handleDeleteItem = async item => {
    try {
      setLoading(true);
      const payload = { lookbook_id: item?._id };
      const res = await deleteLookbookItemApi(payload);
      if (res?.success) {
        const typeName = item?.type
          ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
          : 'Item';
        showSuccessToast(res?.message || `${typeName} removed from lookbook`);
        fetchLookbook(); // Refresh list after deletion
      } else {
        showDangerToast(res?.message || 'Failed to remove item');
      }
    } catch (error) {
      console.log('Error deleting lookbook item', error);
      showDangerToast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderEmpty = () => (
    <NoDataText
      source={imagePath.book}
      title={'Lookbook is empty'}
      subTitle={'You haven\'t added anything to your lookbook yet.'}
    />
  );

  const renderItem = ({ item }) => {
    console.log("iotem is", item)
    // We need to parse fields depending on if it's outfit, website, or post
    let title = '';
    let authorName = '';
    let imageUrl = '';
    let badgeLabel = '';

    if (item.type === 'outfit' && item.outfit) {
      title = item.outfit.name || 'Outfit';
      authorName = item.outfit.createdBy?.name || 'Rishita Sharma'; // placeholder fallback if missing
      imageUrl = item.outfit.images?.[0];
      badgeLabel = `${item.outfit.item_id?.length || 0} Items`; // showing item count instead of hardcoded 8
    } else if (item.type === 'website') {
      title = item.title || 'Website Link';
      authorName = item.website_link || 'External';
      imageUrl = item.image;
      badgeLabel = 'Website';
    } else if (item.type === 'post' && item.post) {
      title = item.post.caption || 'Post';
      // Post createdBy could be populated or just ID. Fallback as requested UI uses names heavily.
      authorName = item.post.createdBy?.name || 'User Post';
      imageUrl = item.post.images?.[0] || (Array.isArray(item.post.thumbnail) ? item.post.thumbnail[0] : item.post.thumbnail) || item.post.videos?.[0];
      badgeLabel = 'Post';
    }

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          if (item.type === 'outfit' && item.outfit) {
            navigation.navigate('OutfitDetail', { outfitId: item.outfit._id });
          } else if (item.type === 'post' && item.post) {
            navigation.navigate('SocialCommunityScreen', {
              postId: item.post._id,
              postData: item.post,
            });
          } else if (item.type === 'website' && item.website_link) {
            Linking.openURL(item.website_link).catch(err => {
              console.log('Failed to open link:', err);
              showDangerToast('Could not open the website link');
            });
          }
        }}
      >
        <View style={styles.imageOverlayContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, { backgroundColor: '#E5E7EB' }]} />
          )}

          <LinearGradient
            colors={['rgba(28, 27, 27, 0)', 'rgba(15,14,14,0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={styles.gradient}
          />

          <View style={styles.cardContent}>
            <View style={{ flex: 1, paddingRight: wp(2) }}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {badgeLabel}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Remove Item',
                  'Are you sure you want to remove this item from your Lookbook?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Remove',
                      style: 'destructive',
                      onPress: () => handleDeleteItem(item),
                    },
                  ],
                );
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={imagePath.del}
                style={styles.deleteIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        title="My Lookbook"
        backgroundColor={Colors.white}
      />

      <View style={[styles.container, { paddingTop: 0 }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.black} />
          </View>
        ) : (
          <FlatList
            data={lookbookPosts}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={[
              styles.listContent,
              (!lookbookPosts || lookbookPosts.length === 0) && {
                flexGrow: 1,
                justifyContent: 'center',
              },
            ]}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={renderEmpty}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Floating Create Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CreateLookbook')}
          >
            <Image
              source={imagePath.plusbuttom}
              style={styles.plusIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LookBookHome;
