import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight, OutfitFamily } from '../../../constant/fonts';
import Header from '../../../component/common/UI/Header';
import { searchUsersApi, postListApi } from '../../../services/user.service';

const SearchUser = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [discoveryPosts, setDiscoveryPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('User');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchDiscoveryPosts();
  }, []);

  useEffect(() => {
    if (isSearchVisible) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchVisible]);

  const fetchDiscoveryPosts = async (p = 1, isRefresh = false) => {
    if (p === 1) {
      if (!isRefresh) {
        setLoading(true);
      }
      setPage(1);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await postListApi({ page: p, per_page: 20 });
      if (response?.success) {
        const resData = response?.data;
        let newList = [];
        if (Array.isArray(resData)) {
          newList = resData;
        } else if (resData && Array.isArray(resData.list)) {
          newList = resData.list;
        } else if (resData && Array.isArray(resData.posts)) {
          newList = resData.posts;
        }

        if (p === 1) {
          setDiscoveryPosts(newList);
        } else {
          setDiscoveryPosts(prev => [...prev, ...newList]);
        }

        if (newList.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.log('Fetch Discovery Posts Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreDiscovery = () => {
    if (!loading && !loadingMore && hasMore && !searchQuery.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDiscoveryPosts(nextPage);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearch(searchQuery);
      } else {
        setUsers([]);
        setPosts([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearch = async (query, isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }
    try {
      const response = await searchUsersApi(query);
      if (response?.success) {
        const resData = response?.data;
        const fetchedUsers = resData?.users || [];
        setUsers(fetchedUsers);

        // Handle flattened or top-level posts
        if (resData?.posts && Array.isArray(resData.posts)) {
          setPosts(resData.posts);
        } else if (fetchedUsers.length > 0) {
          // Flatten all users' posts into a single list
          const allPosts = fetchedUsers.reduce((acc, user) => {
            if (user.posts && Array.isArray(user.posts)) {
              return [...acc, ...user.posts];
            }
            return acc;
          }, []);
          setPosts(allPosts);
        } else {
          setPosts([]);
        }
      }
    } catch (error) {
      console.log('Search Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (searchQuery.trim()) {
        await fetchSearch(searchQuery, true);
      } else {
        await fetchDiscoveryPosts(1, true);
      }
    } finally {
      setRefreshing(false);
    }
  }, [searchQuery]);

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => navigation.navigate('UserProfile', { item })}
    >
      <View style={styles.userInfo}>
        <Image
          source={
            item.profile_image
              ? { uri: item.profile_image }
              : imagePath.profile
          }
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.userName}>
          {item.first_name} {item.last_name || ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('SocialCommunityScreen', { postId: item._id })}
    >
      <Image
        source={{
          uri: item.images?.[0] || item.image || (Array.isArray(item.thumbnail) ? item.thumbnail[0] : item.thumbnail),
        }}
        style={styles.postImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Header
        showLeftButton={false}
        title="Social"
        showRightButton={true}
        rightIcon={isSearchVisible ? imagePath.cross_black : imagePath.search}
        rightIconStyle={styles.headerSearchIcon}
        onRightButtonPress={() => {
          if (isSearchVisible) {
            setSearchQuery('');
          }
          setIsSearchVisible(!isSearchVisible);
        }}
        backgroundColor={Colors.white}
      />

      {isSearchVisible && (
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Image
              source={imagePath.search}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              ref={searchInputRef}
              style={styles.input}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}

      {searchQuery.trim().length > 0 && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'User' && styles.activeTab]}
            onPress={() => setActiveTab('User')}
          >
            <Text style={[styles.tabText, activeTab === 'User' && styles.activeTabText]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Post' && styles.activeTab]}
            onPress={() => setActiveTab('Post')}
          >
            <Text style={[styles.tabText, activeTab === 'Post' && styles.activeTabText]}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Colors.themeColor} />
          </View>
        ) : (
          (searchQuery.trim() ? (activeTab === 'User' ? users.length : posts.length) : discoveryPosts.length) === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.ootdEmptyIconContainer}>
                <Image source={activeTab == "User" ? imagePath.blockIcon : imagePath.search} style={styles.emptuyIcon} />
              </View>
              <Text style={styles.emptyTitle}>

                No {searchQuery.trim() ? (activeTab === 'User' ? 'users' : 'posts') : 'posts'} found
              </Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search terms or filters.
              </Text>
            </View>
          ) : (
            <FlatList
              key={searchQuery.trim() ? (activeTab === 'User' ? 'users' : 'posts') : 'discovery'}
              data={
                searchQuery.trim()
                  ? activeTab === 'User'
                    ? users
                    : posts
                  : discoveryPosts
              }
              renderItem={
                searchQuery.trim()
                  ? activeTab === 'User'
                    ? renderUserItem
                    : renderPostItem
                  : renderPostItem
              }
              keyExtractor={(item) => (item._id || item.id)?.toString()}
              numColumns={searchQuery.trim() ? (activeTab === 'User' ? 1 : 2) : 2}
              columnWrapperStyle={
                (searchQuery.trim() ? activeTab !== 'User' : true)
                  ? styles.columnWrapper
                  : null
              }
              contentContainerStyle={[
                styles.listContent,
                !isSearchVisible && { paddingTop: hp(2) }
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.themeColor]}
                  tintColor={Colors.themeColor}
                />
              }
              onEndReached={loadMoreDiscovery}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                loadingMore ? (
                  <View style={{ paddingVertical: hp(2), alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={Colors.themeColor} />
                  </View>
                ) : null
              }
            />
          )
        )}
      </View>
    </View>
  );
};

export default SearchUser;

const getStyles = Colors => StyleSheet.create({
  emptuyIcon: {
    width: wp(8),
    height: wp(8),
    tintColor: Colors.greyVar1,
  },
  ootdEmptyIconContainer: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(3),
    backgroundColor: Colors?.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  searchSection: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(2),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    paddingHorizontal: wp(3),
    height: hp(5.5),
  },
  searchIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: Colors.greyDark2,
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: FontSize.FONT_15,
    color: Colors.black,
    paddingVertical: 0,
    fontFamily: FontFamily.OutfitMedium,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  listContent: {
    paddingBottom: hp(5),
  },
  loader: {
    marginTop: hp(5),
  },
  userCard: {
    paddingVertical: hp(1.5),
    marginTop: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorder,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: Colors.bgGrey,
  },
  userName: {
    fontSize: FontSize.FONT_16,
    fontFamily: OutfitFamily.Medium,
    color: Colors.black,
    marginLeft: wp(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyTitle: {
    fontSize: FontSize.FONT_21,
    fontFamily: FontFamily?.Bold,
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitRegular,
    color: Colors.graytext,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.themeColor,
  },
  tabText: {
    fontSize: FontSize.FONT_16,
    fontFamily: OutfitFamily.Regular,
    color: Colors.greyDark2,
    letterSpacing: 0.5,
  },
  activeTabText: {
    fontFamily: OutfitFamily.Medium,
    color: Colors.themeColor,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  postCard: {
    width: wp(43.5),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    marginBottom: hp(2),
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  postImage: {
    width: '100%',
    height: hp(22),
    backgroundColor: Colors.genderBg,
  },
  headerInput: {
    flex: 1,
    fontSize: FontSize.FONT_16,
    color: Colors.black,
    fontFamily: FontFamily.OutfitMedium,
    paddingVertical: hp(0.5),
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.lightBorder,
  },
  headerSearchIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: Colors.black,
  },
});
