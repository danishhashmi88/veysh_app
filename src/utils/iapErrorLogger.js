import { parseErrorStringToJsonObj } from 'react-native-iap';

const ANDROID_BILLING_RESPONSE_CODES = {
  [-3]: 'SERVICE_TIMEOUT',
  [-2]: 'FEATURE_NOT_SUPPORTED',
  [-1]: 'SERVICE_DISCONNECTED',
  0: 'OK',
  1: 'USER_CANCELED',
  2: 'SERVICE_UNAVAILABLE',
  3: 'BILLING_UNAVAILABLE',
  4: 'ITEM_UNAVAILABLE',
  5: 'DEVELOPER_ERROR',
  6: 'ERROR',
  7: 'ITEM_ALREADY_OWNED',
  8: 'ITEM_NOT_OWNED',
  12: 'NETWORK_ERROR',
};

export const getAndroidBillingResponseName = responseCode => {
  if (responseCode === undefined || responseCode === null) {
    return 'UNKNOWN';
  }

  return (
    ANDROID_BILLING_RESPONSE_CODES[responseCode] || `UNKNOWN_CODE_${responseCode}`
  );
};

export const parseIapError = error => {
  const parsed = parseErrorStringToJsonObj(error);

  const responseCode =
    parsed.responseCode ?? error?.responseCode ?? error?.nativeErrorCode;
  const debugMessage = parsed.debugMessage ?? error?.debugMessage;
  const code = parsed.code ?? error?.code;
  const message = parsed.message ?? error?.message ?? String(error);

  return {
    code,
    message,
    responseCode,
    responseCodeName: getAndroidBillingResponseName(responseCode),
    debugMessage,
    productId: parsed.productId ?? error?.productId,
    productIds: parsed.productIds ?? error?.productIds,
    productType: parsed.productType ?? error?.productType,
    platform: parsed.platform ?? error?.platform ?? 'android',
    isEmptyProductList:
      parsed.isEmptyProductList ?? error?.isEmptyProductList ?? false,
    rawError: error,
    parsedPayload: parsed,
  };
};

export const logIapError = (error, context = 'Android IAP') => {
  const details = parseIapError(error);

  console.log(`[${context}] ========== Google Play Billing Error ==========`);
  console.log(`[${context}] code:`, details.code);
  console.log(`[${context}] message:`, details.message);
  console.log(
    `[${context}] responseCode:`,
    details.responseCode,
    `(${details.responseCodeName})`,
  );
  console.log(`[${context}] debugMessage:`, details.debugMessage);
  console.log(`[${context}] productId:`, details.productId);
  console.log(`[${context}] productIds:`, details.productIds);
  console.log(`[${context}] platform:`, details.platform);
  console.log(
    `[${context}] full parsed payload:`,
    JSON.stringify(details.parsedPayload, null, 2),
  );
  console.log(`[${context}] raw error object:`, error);
  console.log(`[${context}] ===============================================`);

  return details;
};

export const getIapErrorMessage = error => {
  const details = parseIapError(error);

  const parts = [
    details.message,
    details.debugMessage,
    details.responseCode !== undefined && details.responseCode !== null
      ? `Play Billing: ${details.responseCodeName} (${details.responseCode})`
      : null,
    details.code ? `IAP code: ${details.code}` : null,
  ].filter(Boolean);

  return parts.join(' | ') || 'Unknown Google Play billing error';
};
