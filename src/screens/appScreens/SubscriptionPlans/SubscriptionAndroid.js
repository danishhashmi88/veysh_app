import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './styles';
import { Colors } from '../../../constant/colors';
import Header from '../../../component/common/UI/Header';
import { wp, hp } from '../../../utils/helper';
import { FontFamily, FontSize } from '../../../constant/fonts';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSubscription,
  cancelSubscription,
  getActiveSubscriptionDetails,
  getSubscriptionList,
  updateSubscription,
  verifySubscriptionPayment,
} from '../../../redux/thunks/subscriptionThunk';
import { showSuccessToast } from '../../../utils/toast';
import DeleteItemModal from '../../../component/common/Modal/DeleteItemModal';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { useIAP } from 'react-native-iap';
import {
  ANDROID_IAP,
  ANDROID_SUBSCRIPTION_SKUS,
} from '../../../constant/iapProducts';

const SubscriptionAndroid = () => {
  const navigation = useNavigation();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { subscriptionLists, activeSubscriptionDetails } = useSelector(
    state => state.subscription,
  );
  const handledTransactions = useRef(new Set());
  let ActivePlan = activeSubscriptionDetails?.subscription;
  console.log('Active Plan', ActivePlan);
  const [selectedPlanID, setSelectedplanId] = useState('');
  const inactivePlans = [];
  const [showModal, setShowModal] = useState(false);
  const isBasicActive =
    ActivePlan?.plan?.title?.toLowerCase() === 'basic' ||
    ActivePlan?.plan?.price === 0;

  const finalPlansArray =
    ActivePlan && Object.keys(ActivePlan).length > 0 && !isBasicActive
      ? [ActivePlan, ...(inactivePlans || [])]
      : inactivePlans || [];

  useEffect(() => {
    handledTransactions.current.clear();
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await dispatch(getSubscriptionList());
      await dispatch(getActiveSubscriptionDetails());
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const {
    connected,
    subscriptions,
    fetchProducts,
    finishTransaction,
    requestPurchase,
  } = useIAP({
    onPurchaseSuccess: async purchase => {
      console.log(
        '[Android IAP] Purchase Success',
        JSON.stringify(purchase, null, 2),
      );

      try {
        // Prevent duplicate processing of same transaction
        if (handledTransactions.current.has(purchase.transactionId)) {
          console.log(
            '[Android IAP] Transaction already handled:',
            purchase.transactionId,
          );
          return;
        }

        handledTransactions.current.add(purchase.transactionId);

        const response = await dispatch(
          verifySubscriptionPayment({
            purchase_token: purchase.purchaseToken,
            product_id: purchase.productId,
            transaction_id: purchase.transactionId,
            platform: 'android',
          }),
        ).unwrap();

        console.log('VERIFY RESPONSE', JSON.stringify(response, null, 2));

        // Always finish/acknowledge the transaction after successful backend verification
        await finishTransaction({
          purchase,
          isConsumable: false,
        });

        // Refresh subscription details
        await onRefresh();

        if (response?.message === 'Subscription renewed') {
          console.log('[Android IAP] Subscription renewed');
          showSuccessToast('Subscription renewed successfully!');
          return;
        }

        showSuccessToast(
          response?.message || 'Subscription activated successfully!',
        );
      } catch (err) {
        // Remove from handled list if verification failed, so it can be retried later.
        handledTransactions.current.delete(purchase.transactionId);

        console.log('================================');
        console.log('VERIFY ERROR');
        console.log(err);
        console.log('================================');

        Alert.alert(
          'Verification Failed',
          err?.message || 'Unable to verify subscription.',
        );
      } finally {
        setIsPurchasing(false);
      }
    },

    onPurchaseError: error => {
      console.log('[Android IAP ERROR]', error);

      setIsPurchasing(false);

      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Purchase Failed', error.message || 'Purchase failed');
      }
    },
  });

  useEffect(() => {
    if (connected) {
      console.log('[Android IAP] Play Billing connected successfully');
    } else {
      console.log('[Android IAP] Not connected to Play Billing yet...');
    }
  }, [connected]);

  // Fetch IAP subscriptions from Play Store
  useEffect(() => {
    const fetchIAPProducts = async () => {
      if (!connected) {
        console.log('[Android IAP] Not connected yet... waiting for connection');
        return;
      }
      try {
        console.log('[Android IAP] Fetching SKUs:', ANDROID_SUBSCRIPTION_SKUS);
        console.log(
          '[Android IAP] Product ID being requested:',
          ANDROID_IAP.SUBSCRIPTION_PRODUCT_ID,
        );
        const result = await fetchProducts({
          skus: ANDROID_SUBSCRIPTION_SKUS,
          type: 'subs',
        });
        console.log(
          '[Android IAP] fetchProducts returned:',
          JSON.stringify(result, null, 2),
        );
      } catch (error) {
        console.log('[Android IAP] Error fetching subscriptions:', error);
        console.log('[Android IAP] Error code:', error?.code);
        console.log('[Android IAP] Error message:', error?.message);
      }
    };
    fetchIAPProducts();
  }, [connected, fetchProducts]);

  // Log fetched subscriptions + base plan matching
  useEffect(() => {
    if (subscriptions?.length) {
      console.log(
        '[Android IAP] Available subscriptions:',
        JSON.stringify(subscriptions, null, 2),
      );

      subscriptions.forEach(subscription => {
        const matchingBasePlan =
          subscription.subscriptionOfferDetailsAndroid?.find(
            offer => offer.basePlanId === ANDROID_IAP.BASE_PLAN_ID,
          );

        if (matchingBasePlan) {
          console.log(
            '[Android IAP] Matched base plan for',
            subscription.id,
            ':',
            JSON.stringify(matchingBasePlan, null, 2),
          );
        } else {
          console.log(
            '[Android IAP] Base plan not found in offers for',
            subscription.id,
            ANDROID_IAP.BASE_PLAN_ID,
          );
        }
      });
    }
  }, [subscriptions]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const getOfferTokenForProduct = () => {
    const targetSubscription = subscriptions?.find(
      sub => sub.id === ANDROID_IAP.SUBSCRIPTION_PRODUCT_ID,
    );

    const matchingBasePlan =
      targetSubscription?.subscriptionOfferDetailsAndroid?.find(
        offer => offer.basePlanId === ANDROID_IAP.BASE_PLAN_ID,
      );

    return matchingBasePlan?.offerToken;
  };

  const onBuypress = async () => {
    try {
      if (!connected) {
        Alert.alert('Store not connected');
        return;
      }
console.log('subscriptionssubscriptionssubscriptions',subscriptions)
      if (!subscriptions?.length) {
        Alert.alert('Products not loaded');
        return;
      }

      const offerToken = getOfferTokenForProduct();

      if (!offerToken) {
        Alert.alert('Unable to find subscription offer. Please try again.');
        return;
      }

      setIsPurchasing(true);

      console.log('Buying:', ANDROID_IAP.SUBSCRIPTION_PRODUCT_ID);

      await requestPurchase({
        request: {
          android: {
            skus: [ANDROID_IAP.SUBSCRIPTION_PRODUCT_ID],
            subscriptionOffers: [
              {
                sku: ANDROID_IAP.SUBSCRIPTION_PRODUCT_ID,
                offerToken,
              },
            ],
          },
        },
        type: 'subs',
      });
    } catch (error) {
      console.log('[PURCHASE ERROR]', error);

      setIsPurchasing(false);

      Alert.alert('Purchase Error', error?.message || 'Purchase failed');
    }
  };

  const onCancelPress = async () => {
    const url = 'https://play.google.com/store/account/subscriptions';

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Unable to open',
        'Please open Play Store > Payments & subscriptions > Subscriptions.',
      );
    }
  };
  // const onUpgradePress = async item => {
  //   await dispatch(updateSubscription({ subscription_id: item?._id }));
  //   await onRefresh();
  // };

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text style={[styles.planTitle, { marginBottom: 10 }]}>
          {item.price === 0 || item.title?.toLowerCase() === 'basic'
            ? 'CURRENT PLAN'
            : 'OTHER PLAN'}
        </Text>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.planTitle}>{item.title}</Text>
              {item?.price == 0 ? (
                <Text style={[styles.planTypeStyle, { marginTop: 5 }]}>
                  FREE
                </Text>
              ) : (
                <Text style={styles.price}>
                  ₹{item.price}
                  <Text style={styles.durationType}>
                    {' '}
                    /{item?.duration_type}
                  </Text>
                </Text>
              )}
            </View>

            {item.price === 0 ? (
              <View
                style={[
                  styles.buyButton,
                  { backgroundColor: Colors.backGroundColor1 },
                ]}
              >
                <Text style={[styles.buyText, { color: Colors.black }]}>
                  Activated
                </Text>
              </View>
            ) : (
              <AppButton
                style={styles.buyButton}
                onPress={() => {
                  onBuypress(item);
                }}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.buyText}>Unlock</Text>
                )}
              </AppButton>
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.featureContainer}>
            {item?.benefits?.length
              ? item.benefits.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Image
                    source={imagePath.tickMark}
                    style={styles.tickIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))
              : null}
          </View>
        </View>
      </View>
    );
  };

  const renderBuyItem = ({ item }) => {
    if (item?.end_date) {
      return (
        <View>
          <Text style={[styles.planTitle, { marginBottom: 10 }]}>
            {'Current Plan '}
          </Text>
          <View style={[styles.card, { backgroundColor: Colors?.white }]}>
            <View
              style={[
                styles.headerRow,
                {
                  backgroundColor: Colors?.white,
                },
              ]}
            >
              <View>
                <Text style={[styles.planTypeStyle, { color: Colors?.black }]}>
                  {item?.plan?.title}
                </Text>
                <Text style={[styles.price, { color: Colors?.black }]}>
                  ₹{item?.plan?.price}
                  <Text style={[styles.durationType, { color: Colors?.black }]}>
                    {' '}
                    /{item?.plan?.duration_type}
                  </Text>
                </Text>
                <View style={styles.expText}>
                  <Text style={[styles.expiryDate, { color: Colors?.redvar3 }]}>
                    Renews on - {moment(item?.end_date).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.buyButton,
                  { backgroundColor: Colors?.backGroundColor1 },
                ]}
                onPress={() => {
                  setSelectedplanId(item);
                  setShowModal(true);
                }}
              >
                <Text style={[styles.buyText, { color: Colors?.black }]}>
                  {'Cancel'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.featureContainer}>
              {item?.plan?.benefits?.length
                ? item?.plan?.benefits.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Image
                      source={imagePath.tickMark}
                      style={styles.tickIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))
                : null}
            </View>
          </View>
        </View>
      );
    }
    return (
      <View>
        <Text style={[styles.planTitle, { marginBottom: 10 }]}>
          {'Other Plan '}
        </Text>
        <View style={[styles.card]}>
          <View style={[styles.headerRow]}>
            <View>
              <Text style={styles.planTitle}>{item.title}</Text>
              <Text style={styles.price}>
                ₹{item.price}
                <Text style={styles.durationType}> /{item?.duration_type}</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => {
                // onUpgradePress(item);
              }}
            >
              <Text style={styles.buyText}>{'Upgrade'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.featureContainer}>
            {item?.plan?.benefits?.length
              ? item?.plan?.benefits.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Image
                    source={imagePath.tickMark}
                    style={styles.tickIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))
              : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Subscription Plans"
        headerTextStyle={{
          fontFamily: FontFamily.Bold,
          fontSize: FontSize.FONT_26,
          color: Colors.blackVar2,
        }}
        backgroundColor={Colors.white}
      />
      {ActivePlan && Object.keys(ActivePlan).length > 0 && !isBasicActive ? (
        <FlatList
          data={finalPlansArray}
          keyExtractor={item => item?._id}
          renderItem={renderBuyItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <FlatList
          data={subscriptionLists}
          keyExtractor={item => item?._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      <DeleteItemModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onDelete={() => {
          onCancelPress(selectedPlanID);
        }}
        imagess={imagePath?.cross_black}
        imageStyle={{ width: wp(5), height: wp(5), tintColor: Colors.red }}
        showtitle
        deleteMessage={'Are you sure you want to cancel the subscription plan?'}
        rightText={'Yes, Cancel'}
      />
    </View>
  );
};

export default SubscriptionAndroid;