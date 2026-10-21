import { getData, setData, removeData, USER_ID } from './storage';

export const AI_DATA_CONSENT_KEY = 'AI_OPENAI_DATA_CONSENT';
export const AI_DATA_CONSENT_BY_USER_KEY = 'AI_OPENAI_DATA_CONSENT_BY_USER';

const getCurrentUserId = async () => {
  const userId = await getData(USER_ID);
  if (userId === null || userId === undefined || userId === '') return null;
  return String(userId);
};

const getConsentMap = async () => {
  const map = await getData(AI_DATA_CONSENT_BY_USER_KEY);
  if (map && typeof map === 'object' && !Array.isArray(map)) return map;
  return {};
};

export const hasAiDataConsent = async (userId) => {
  const id = userId != null ? String(userId) : await getCurrentUserId();
  if (!id) return false;

  const map = await getConsentMap();
  const entry = map[id];
  if (entry === true || entry === 'true') return true;
  if (entry && typeof entry === 'object') return entry.accepted === true;

  return false;
};

export const setAiDataConsent = async (accepted = true, userId) => {
  const id = userId != null ? String(userId) : await getCurrentUserId();
  if (!id) return;

  const map = await getConsentMap();
  map[id] = {
    accepted: !!accepted,
    acceptedAt: new Date().toISOString(),
    provider: 'OpenAI',
  };
  await setData(AI_DATA_CONSENT_BY_USER_KEY, map);

  // Remove legacy device-wide key so old consent never leaks across accounts
  await removeData(AI_DATA_CONSENT_KEY);
};

export const clearAiDataConsent = async (userId) => {
  const id = userId != null ? String(userId) : await getCurrentUserId();
  if (!id) {
    await removeData(AI_DATA_CONSENT_KEY);
    return;
  }

  const map = await getConsentMap();
  if (map[id] !== undefined) {
    delete map[id];
    await setData(AI_DATA_CONSENT_BY_USER_KEY, map);
  }
  await removeData(AI_DATA_CONSENT_KEY);
};

/** Call on logout / account delete so no stale global consent remains. */
export const clearAllAiDataConsent = async () => {
  await removeData(AI_DATA_CONSENT_KEY);
};
