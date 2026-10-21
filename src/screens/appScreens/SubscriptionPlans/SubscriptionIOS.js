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
  getActiveSubscriptionDetails,
  getSubscriptionList,
  verifySubscriptionPayment,
} from '../../../redux/thunks/subscriptionThunk';
import { showSuccessToast } from '../../../utils/toast';
import DeleteItemModal from '../../../component/common/Modal/DeleteItemModal';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { useIAP, getAvailablePurchases } from 'react-native-iap';
import { IOS_IAP, IOS_SUBSCRIPTION_SKUS } from '../../../constant/iapProducts';
import { ENV } from '../../../config/env';

const formatSubscriptionLength = storeProduct => {
  const unitRaw =
    storeProduct?.subscriptionPeriodUnitIOS ||
    storeProduct?.subscriptionPeriod?.unit;
  const numRaw =
    storeProduct?.subscriptionPeriodNumberIOS ||
    storeProduct?.subscriptionPeriod?.value ||
    1;
  const num = Number(numRaw) || 1;
  const unit = String(unitRaw || 'MONTH').toUpperCase();
  const labels = {
    DAY: ['day', 'days'],
    WEEK: ['week', 'weeks'],
    MONTH: ['month', 'months'],
    YEAR: ['year', 'years'],
  };
  const pair = labels[unit] || labels.MONTH;
  const unitLabel = num === 1 ? pair[0] : pair[1];
  return `${num} ${unitLabel}`;
};

const isStaleSubscriptionError = error => {
  const message = String(error?.message || error || '').toLowerCase();
  return (
    message.includes('inactive subscription') ||
    message.includes('please retry the purchase')
  );
};

const isUserCancelledPurchase = error => {
  const code = String(error?.code || '').toUpperCase();
  const message = String(error?.message || '').toLowerCase();
  return (
    code === 'E_USER_CANCELLED' ||
    message.includes('cancelled') ||
    message.includes('canceled')
  );
};

const SubscriptionIOS = () => {
  const navigation = useNavigation();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { subscriptionLists, activeSubscriptionDetails } = useSelector(
    state => state.subscription,
  );
  const handledTransactions = useRef(new Set());
  const purchaseRequested = useRef(false);
  const staleRetryUsed = useRef(false);
  const requestPurchaseRef = useRef(null);
  const finishTransactionRef = useRef(null);
  let ActivePlan = activeSubscriptionDetails?.subscription;
  
  const inactivePlans = [];
  const [showModal, setShowModal] = useState(false);
  const isBasicActive = ActivePlan?.plan?.title?.toLowerCase() === 'basic' || ActivePlan?.plan?.price === 0;

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
      console.log({
        transactionId: purchase.transactionId,
        originalTransactionId: purchase.originalTransactionIdentifierIOS,
        transactionDate: purchase.transactionDate,
        productId: purchase.productId,
      });
      console.log(
        '[IAP] Purchase Success',
        JSON.stringify(purchase, null, 2),
      );
      purchaseRequested.current = false;
      staleRetryUsed.current = false;
      try {
        const transactionKey =
          purchase.transactionId || purchase.id || purchase.purchaseToken;
        if (transactionKey && handledTransactions.current.has(transactionKey)) {
          console.log('[IAP] Transaction already handled:', transactionKey);
          return;
        }
        if (transactionKey) {
          handledTransactions.current.add(transactionKey);
        }

        const receipt =
          purchase.purchaseToken ||
          purchase.transactionReceipt ||
          purchase.originalJson;

        console.log('Receipt:', receipt);
        console.log('Receipt Length:', receipt?.length);
        if (!receipt) {
          try {
            await finishTransaction({ purchase, isConsumable: false });
          } catch (finishErr) {
            console.log('[IAP] Finish without receipt:', finishErr);
          }
          setIsPurchasing(false);
          Alert.alert('Purchase Error', 'Receipt not found.');
          return;
        }
        const response = await dispatch(
          verifySubscriptionPayment({
            receipt,
            product_id:
              purchase.productId ||
              purchase.id ||
              IOS_IAP.SUBSCRIPTION_PRODUCT_ID,
            transaction_id: purchase.transactionId || purchase.id,
            platform: 'ios',
          }),
        ).unwrap();

        console.log('VERIFY RESPONSE', JSON.stringify(response, null, 2));

        try {
          await finishTransaction({
            purchase,
            isConsumable: false,
          });
        } catch (finishErr) {
          console.log('[IAP] Finish after verify:', finishErr);
        }

        await onRefresh();
        setIsPurchasing(false);

        if (response?.message === 'Subscription renewed') {
          showSuccessToast('Subscription renewed successfully!');
          return;
        }

        showSuccessToast(
          response?.message || 'Subscription activated successfully!',
        );
      } catch (err) {
        try {
          await finishTransaction({ purchase, isConsumable: false });
        } catch (finishErr) {
          console.log('[IAP] Finish after verify error:', finishErr);
        }

        setIsPurchasing(false);
        handledTransactions.current.delete(
          purchase.transactionId || purchase.id,
        );

        console.log('========== VERIFY ERROR ==========');
        console.log('Full Error:', err);
        console.log('Message:', err?.message);
        console.log('==================================');

        Alert.alert(
          'Verification Failed',
          err?.response?.data?.message ||
            err?.message ||
            'Unable to verify subscription.',
        );
      }
    },

    onPurchaseError: error => {
      console.log('[IAP ERROR]', error);

      if (isUserCancelledPurchase(error)) {
        purchaseRequested.current = false;
        staleRetryUsed.current = false;
        setIsPurchasing(false);
        return;
      }

      if (isStaleSubscriptionError(error) && !staleRetryUsed.current) {
        staleRetryUsed.current = true;
        const buy = requestPurchaseRef.current;
        if (buy) {
          buy({
            request: {
              ios: {
                sku: IOS_IAP.SUBSCRIPTION_PRODUCT_ID,
              },
            },
            type: 'subs',
          }).catch(retryErr => {
            console.log('[IAP] Stale retry failed', retryErr);
            if (!isStaleSubscriptionError(retryErr) && !isUserCancelledPurchase(retryErr)) {
              purchaseRequested.current = false;
              setIsPurchasing(false);
              Alert.alert(
                'Purchase Failed',
                retryErr?.message || 'Purchase failed',
              );
            } else if (isUserCancelledPurchase(retryErr)) {
              purchaseRequested.current = false;
              setIsPurchasing(false);
            }
          });
          return;
        }
      }

      purchaseRequested.current = false;
      setIsPurchasing(false);

      if (!isStaleSubscriptionError(error)) {
        Alert.alert('Purchase Failed', error.message || 'Purchase failed');
      }
    },
  });

  requestPurchaseRef.current = requestPurchase;
  finishTransactionRef.current = finishTransaction;

  // Fetch IAP subscriptions from App Store
  useEffect(() => {
    const fetchIAPProducts = async () => {
      console.log('[iOS IAP] Connection status:', connected);
      if (!connected) {
        console.log('[iOS IAP] Not connected to App Store yet... waiting for connection');
        return;
      }
      try {
        console.log('[iOS IAP] Connected! Fetching subscription SKUs:', IOS_SUBSCRIPTION_SKUS);
        console.log('[iOS IAP] Product ID being requested:', IOS_IAP.SUBSCRIPTION_PRODUCT_ID);
        const result = await fetchProducts({ skus: IOS_SUBSCRIPTION_SKUS, type: 'subs' });
        console.log('[iOS IAP] fetchProducts returned:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.log('[iOS IAP] Error fetching subscriptions:', error);
        console.log('[iOS IAP] Error code:', error?.code);
        console.log('[iOS IAP] Error message:', error?.message);
      }
    };
    fetchIAPProducts();
  }, [connected, fetchProducts]);

  // Log fetched subscriptions
  useEffect(() => {
    if (subscriptions?.length) {
      console.log('[iOS IAP] Available subscriptions:', JSON.stringify(subscriptions, null, 2));
    }
  }, [subscriptions]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const onBuypress = async () => {
    try {
      if (!connected) {
        Alert.alert('Store not connected');
        return;
      }

      if (!subscriptions.length) {
        Alert.alert('Products not loaded');
        return;
      }

      setIsPurchasing(true);
      staleRetryUsed.current = false;
      purchaseRequested.current = true;

      try {
        const existingPurchases = await getAvailablePurchases({
          onlyIncludeActiveItemsIOS: false,
        });
        for (const purchase of existingPurchases || []) {
          if (purchase?.isAutoRenewing) {
            continue;
          }
          try {
            await finishTransaction({ purchase, isConsumable: false });
          } catch (finishErr) {
            console.log('[IAP] Pre-buy finish ignored:', finishErr);
          }
        }
      } catch (clearErr) {
        console.log('[IAP] Could not clear prior transactions:', clearErr);
      }

      await requestPurchase({
        request: {
          ios: {
            sku: IOS_IAP.SUBSCRIPTION_PRODUCT_ID,
          },
        },
        type: 'subs',
      });
    } catch (error) {
      console.log('[PURCHASE ERROR]', error);

      if (isUserCancelledPurchase(error)) {
        purchaseRequested.current = false;
        setIsPurchasing(false);
        return;
      }

      if (isStaleSubscriptionError(error) && !staleRetryUsed.current) {
        staleRetryUsed.current = true;
        try {
          await requestPurchase({
            request: {
              ios: {
                sku: IOS_IAP.SUBSCRIPTION_PRODUCT_ID,
              },
            },
            type: 'subs',
          });
          return;
        } catch (retryErr) {
          console.log('[IAP] Stale retry failed', retryErr);
          if (isUserCancelledPurchase(retryErr)) {
            purchaseRequested.current = false;
            setIsPurchasing(false);
            return;
          }
          if (isStaleSubscriptionError(retryErr)) {
            return;
          }
          purchaseRequested.current = false;
          setIsPurchasing(false);
          Alert.alert(
            'Purchase Error',
            retryErr?.message || 'Purchase failed',
          );
          return;
        }
      }

      if (isStaleSubscriptionError(error)) {
        return;
      }

      purchaseRequested.current = false;
      setIsPurchasing(false);
      Alert.alert('Purchase Error', error?.message || 'Purchase failed');
    }
  };

  const storeProduct = subscriptions?.find(
    product =>
      product?.id === IOS_IAP.SUBSCRIPTION_PRODUCT_ID ||
      product?.productId === IOS_IAP.SUBSCRIPTION_PRODUCT_ID,
  );

  const subscriptionTitle =
    storeProduct?.displayName ||
    storeProduct?.title ||
    'Premium Subscription';
  const subscriptionLength = formatSubscriptionLength(storeProduct);
  const subscriptionPrice = storeProduct?.displayPrice || storeProduct?.localizedPrice;

  const openAppleEula = async () => {
    const supported = await Linking.canOpenURL(ENV.APPLE_EULA_URL);
    if (supported) {
      await Linking.openURL(ENV.APPLE_EULA_URL);
    } else {
      Alert.alert('Unable to open Terms of Use');
    }
  };

  const renderLegalFooter = () => (
    <View style={styles.legalFooter}>
      <Text style={styles.legalMeta}>
        {subscriptionTitle}
        {'\n'}
        Length: {subscriptionLength} (auto-renewable)
        {subscriptionPrice ? `\nPrice: ${subscriptionPrice} per ${subscriptionLength}` : ''}
        {'\n'}
        Premium closet, outfit, and Bae AI styling features during each subscription period.
      </Text>
      <View style={styles.legalLinkRow}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CmsScreen', { screenType: 'terms' })
          }
          accessibilityRole="link"
        >
          <Text style={styles.legalLink}>Terms of Use</Text>
        </TouchableOpacity>
        <Text style={styles.legalDot}>•</Text>
        <TouchableOpacity onPress={openAppleEula} accessibilityRole="link">
          <Text style={styles.legalLink}>EULA</Text>
        </TouchableOpacity>
        <Text style={styles.legalDot}>•</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CmsScreen', { screenType: 'privacy' })
          }
          accessibilityRole="link"
        >
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.legalFinePrint}>
        Payment will be charged to your Apple ID account at confirmation of
        purchase. The subscription automatically renews unless it is canceled at
        least 24 hours before the end of the current period. Your account will
        be charged for renewal within 24 hours prior to the end of the current
        period. You can manage and cancel subscriptions in Settings {'>'} Apple
        ID {'>'} Subscriptions.
      </Text>
    </View>
  );

  const onCancelPress = async () => {
    const url = "https://apps.apple.com/account/subscriptions";

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Unable to open",
        "Please open Settings > Apple ID > Subscriptions."
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
            <View style={{ flex: 1, paddingRight: wp(2) }}>
              <Text style={styles.planTypeStyle}>
                {item.price === 0 || item.title?.toLowerCase() === 'basic'
                  ? item.title
                  : subscriptionTitle}
              </Text>
              {item?.price == 0 ? (
                <Text style={[styles.planTitle, { marginTop: 5 }]}>FREE</Text>
              ) : (
                <>
                  <Text style={styles.price}>
                    {subscriptionPrice || item.price}
                    <Text style={styles.durationType}>
                      {' '}
                      / {subscriptionLength}
                    </Text>
                  </Text>
                  <Text style={styles.periodLabel}>
                    Auto-renewable • {subscriptionLength} access to premium
                    features
                  </Text>
                </>
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
        {/* <View style={styles.featureContainer}>
          {item?.description
            ? item?.description
              .split('\r\n')
              .filter(line => line.trim() !== '')
              .map((feature, index) => (
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
        </View> */}
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
                  {item?.plan?.title || subscriptionTitle}
                </Text>
                <Text style={[styles.price, { color: Colors?.black }]}>
                  {subscriptionPrice || item?.plan?.price}
                  <Text style={[styles.durationType, { color: Colors?.black }]}>
                    {' '}
                    / {subscriptionLength}
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
          ListFooterComponent={renderLegalFooter}
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
          ListFooterComponent={renderLegalFooter}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      <DeleteItemModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onDelete={async () => {
          setShowModal(false);
          await onCancelPress();
        }}
        imagess={imagePath?.cross_black}
        imageStyle={{ width: wp(5), height: wp(5), tintColor: Colors.red, }}
        showtitle
        deleteMessage={'Are you sure you want to cancel the subscription plan?'}
        rightText={'Yes, Cancel'}
      />
    </View>
  );
};

export default SubscriptionIOS;
