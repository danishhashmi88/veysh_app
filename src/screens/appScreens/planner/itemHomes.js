import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    FlatList,
    StatusBar,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getItemsList, getCategories } from '../../../redux/thunks/itemsThunk';
import Header from '../../../component/common/UI/Header';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp, getImageUrl } from '../../../utils/helper';
import { FontFamily, FontSize, OutfitFamily } from '../../../constant/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataText from '../../../component/common/UI/NoDataText';
import { getOutfitsList } from '../../../redux/thunks/outfitsThunk';
import { showDangerToast } from '../../../utils/toast';
import { IMAGEURL } from '../../../utils/axios';

const ItemHomes = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { onSelect, type, initialSelectedIds = [] } = route.params || {};
    const [searchText, setSearchText] = useState('');
    const { itemsList = [] } = useSelector(state => state.items);
    const [selectedIds, setSelectedIds] = useState(initialSelectedIds);

    const outfitsList = useSelector(state => state.outfits.outfitsList);
    const loading = useSelector(state => state.outfits.loading);
    const success = useSelector(state => state.outfits.success);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const filteredOutfits = useMemo(() => {
        const query = searchText.trim().toLowerCase();
        if (!query) return outfitsList || [];

        return (outfitsList || []).filter(outfit => {
            const name = (outfit.name || '').toLowerCase();
            const description = (
                outfit.description ||
                outfit.caption ||
                ''
            ).toLowerCase();
            return name.includes(query) || description.includes(query);
        });
    }, [outfitsList, searchText]);

    useEffect(() => {
        if (type == "item") {
            fetchItems();
        } else {
            fetchOutfits();
        }
    }, []);
    const fetchOutfits = async (isPullRefresh = false) => {
        if (loading && !isPullRefresh) {
            return;
        }
        if (isPullRefresh) setIsRefreshing(true);
        const payload = {
            page: 1,
            per_page: 100,
            search: {},
            sort: { column: 'createdAt', order: -1 },
        };
        try {
            await dispatch(getOutfitsList(payload));
        } finally {
            if (isPullRefresh) setIsRefreshing(false);
        }
    };

    const fetchItems = () => {
        const payload = {
            global_search: searchText || '',
            page: 1,
            per_page: 100,
            sort: { column: 'createdAt', order: -1 },
        };
        dispatch(getItemsList(payload));
    };

    useEffect(() => {
        if (type !== 'item') return;
        const delayDebounceFn = setTimeout(() => {
            fetchItems();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    const handleItemPress = (item) => {
        const isSelected = selectedIds.includes(item._id);
        if (isSelected) {
            setSelectedIds(prev => prev.filter(id => id !== item._id));
        } else {
            if (selectedIds.length >= 9) {
                showDangerToast('You can select up to 9 items only');
                return;
            }
            setSelectedIds(prev => [...prev, item._id]);
        }
    };

    const handleDone = () => {
        const selectedItemsData = itemsList
            .filter(i => selectedIds.includes(i._id))
            .map(i => ({
                id: i._id,
                image: i.images?.[0] || i.image
            }));

        onSelect({
            selectedItems: selectedItemsData,
            type: 'item'
        });
        navigation.goBack();
    };

    const renderItem = ({ item }) => {
        const imgPath = item.images?.[0] || item.image;
        const uri = getImageUrl(imgPath);
        const title = item.name || 'Untitled';
        const price = item?.price ?? item?.mrp ?? item?.selling_price ?? '0';

        const isSelected = selectedIds.includes(item._id);

        return (
            <TouchableOpacity
                style={[styles.cardContainer, isSelected && styles.activeCard]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
            >
                <Image
                    source={uri ? { uri } : imagePath.placeholder}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
                {isSelected && (
                    <View style={styles.checkIconContainer}>
                        <Image source={imagePath.white_tick} style={styles.checkIcon} />
                    </View>
                )}
                <View style={styles.cardDetails}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text style={styles.cardPrice}>₹{price}</Text>
                </View>
            </TouchableOpacity>
        );
    };



    const renderOutfitItem = ({ item }) => {
        const title = item.name || 'Untitled';

        let imageSource = imagePath.placeholder;
        let imgPath = item.image;

        if (!imgPath && item.images && item.images.length > 0) {
            imgPath = item.images[0];
        }

        if (imgPath) {
            if (imgPath.startsWith('http')) {
                imageSource = { uri: imgPath };
            } else {
                let formattedPath = imgPath;
                if (!formattedPath.includes('uploads/')) {
                    formattedPath = `uploads/outfits/${formattedPath}`;
                }
                imageSource = { uri: `${IMAGEURL}${formattedPath}` };
            }
        }

        const isSelected = selectedIds.includes(item._id);

        return (
            <TouchableOpacity
                style={[styles.gridItem, isSelected && styles.activeCard]}
                onPress={() => {
                    onSelect({
                        selectedOutfit: item._id,
                        selectedOutfitImage: item.image || (item.images && item.images.length > 0 ? item.images[0] : null),
                        type: 'Outfit'
                    });
                    navigation.goBack();
                }}
                activeOpacity={0.7}
            >
                <Image
                    source={imageSource}
                    style={styles.itemImage}
                    resizeMode="cover"
                />
                {isSelected && (
                    <View style={styles.checkIconContainer}>
                        <Image source={imagePath.white_tick} style={styles.checkIcon} />
                    </View>
                )}
                <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };


    if (type == "item") {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
                <Header
                    showLeftButton={true}
                    onLeftButtonPress={() => navigation.goBack()}
                    title={"Select Item"}
                    backgroundColor={Colors.white}
                    rightComponent={
                        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    }
                />
                <SafeAreaView style={styles.content} edges={['left', 'right', 'bottom']}>
                    <View style={styles.searchSection}>
                        <View style={styles.searchBar}>
                            <Image source={imagePath.searchImage} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={itemsList}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <NoDataText
                                source={imagePath.outfit}
                                title={'No items found'}
                                subTitle={'Closet looks empty.Add your first item now.'}
                            />
                        }
                    />

                </SafeAreaView>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <Header
                showLeftButton={true}
                onLeftButtonPress={() => navigation.goBack()}
                title={"Select Outfits"}
                backgroundColor={Colors.white}
            />
            <SafeAreaView
                style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}
                edges={['left', 'right', 'bottom']}
            >
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Image
                            source={imagePath.search}
                            style={styles.searchIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search outfits"
                            placeholderTextColor={Colors.greyDark2}
                            value={searchText}
                            onChangeText={setSearchText}
                            returnKeyType="search"
                            autoCorrect={false}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchText('')}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Text style={styles.clearSearchText}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {loading && outfitsList?.length === 0 ? (
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <ActivityIndicator size="large" color={Colors.black} />
                    </View>
                ) : (
                    <>
                        {outfitsList?.length === 0 && success ? (
                            <NoDataText
                                source={imagePath.outfit}
                                title={'No outfits found'}
                                subTitle={'Start creating your own outfits!'}
                            />
                        ) : filteredOutfits?.length === 0 ? (
                            <NoDataText
                                source={imagePath.search}
                                title={'No outfits found'}
                                subTitle={`No results for "${searchText.trim()}"`}
                            />
                        ) : (
                            <FlatList
                                data={filteredOutfits}
                                renderItem={renderOutfitItem}
                                keyExtractor={item => item._id}
                                numColumns={2}
                                columnWrapperStyle={{
                                    justifyContent: 'flex-start',
                                    gap: wp(3),
                                    marginBottom: hp(2),
                                }}
                                contentContainerStyle={styles.list}
                                showsVerticalScrollIndicator={false}
                                refreshing={isRefreshing}
                                onRefresh={() => fetchOutfits(true)}
                                removeClippedSubviews={false}
                                extraData={filteredOutfits}
                            />
                        )}
                    </>
                )}
            </SafeAreaView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backGroundColor1,
    },
    content: {
        flex: 1,
    },
    searchSection: {
        paddingHorizontal: wp(5),
        paddingTop: hp(2),
        paddingBottom: hp(1),
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
    searchInput: {
        flex: 1,
        fontSize: FontSize.FONT_15,
        color: Colors.black,
        paddingVertical: 0,
        fontFamily: FontFamily.OutfitMedium,
    },
    clearSearchText: {
        fontSize: FontSize.FONT_14,
        color: Colors.greyDark2,
        paddingHorizontal: wp(1),
    },
    listContainer: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(10),
        paddingTop: hp(2),
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    cardContainer: {
        width: (wp(100) - wp(12)) / 2,
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
    cardImage: {
        width: '100%',
        height: hp(22),
        backgroundColor: Colors.genderBg,
    },
    cardDetails: {
        padding: wp(3),
    },
    cardTitle: {
        fontSize: FontSize.FONT_14,
        fontFamily: FontFamily.OutfitMedium,
        color: Colors.black,
    },
    cardPrice: {
        fontSize: FontSize.FONT_14,
        fontFamily: FontFamily.OutfitMedium,
        color: Colors.themeColor,
        marginTop: hp(0.5),
    },
    loader: {
        marginTop: hp(10),
    },
    emptyContainer: {
        marginTop: hp(10),
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: FontFamily.OutfitRegular,
        fontSize: FontSize.FONT_14,
        color: Colors.graytext,
    },
    list: {
        marginTop: hp(2),
        paddingHorizontal: wp(5),
        paddingBottom: hp(12),
    },
    itemImage: {
        width: '100%',
        height: hp(22),
        backgroundColor: Colors.genderBg,
    },
    itemTitleContainer: {
        padding: wp(3),
    },
    itemTitle: {
        fontSize: FontSize.FONT_14,
        fontFamily: FontFamily.OutfitMedium,
        color: Colors.black,
    },
    gridItem: {
        width: (wp(100) - wp(13)) / 2,
        backgroundColor: Colors.white,
        borderRadius: wp(4),
        marginBottom: hp(2),
        overflow: 'hidden',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
        elevation: 1,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeCard: {
        borderColor: Colors.themeColor,
    },
    doneButton: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(0.8),
        backgroundColor: Colors.themeColor,
        borderRadius: wp(2),
    },
    doneButtonText: {
        color: Colors.white,
        fontFamily: FontFamily.OutfitMedium,
        fontSize: FontSize.FONT_14,
    },
    checkIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.themeColor,
        borderRadius: wp(5),
        padding: 4,
        zIndex: 1,
    },
    checkIcon: {
        width: wp(3),
        height: wp(3),
        tintColor: Colors.white,
    },
});

export default ItemHomes;
