import AsyncStorage from '@react-native-async-storage/async-storage';

const AI_LOG_KEY = '@ai_interaction_log';

export const saveAiLog = async (request, response) => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      request: request,
      response: response,
    };
    await AsyncStorage.setItem(AI_LOG_KEY, JSON.stringify(logEntry));
    console.log('[AI_LOGGER] Log saved successfully');
  } catch (error) {
    console.error('[AI_LOGGER] Error saving log:', error);
  }
};

export const getAiLog = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(AI_LOG_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('[AI_LOGGER] Error getting log:', error);
    return null;
  }
};

export const clearAiLog = async () => {
  try {
    await AsyncStorage.removeItem(AI_LOG_KEY);
  } catch (error) {
    console.error('[AI_LOGGER] Error clearing log:', error);
  }
};
