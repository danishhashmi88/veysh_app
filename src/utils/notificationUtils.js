const toNumber = value => {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const isTruthyRead = value =>
  value === true ||
  value === 'true' ||
  value === 1 ||
  value === '1';

const isFalsyRead = value =>
  value === false ||
  value === 'false' ||
  value === 0 ||
  value === '0';

export const parseNotificationsFromResponse = res => {
  if (!res) return [];

  const payload = res.data ?? res;

  let notifs =
    payload?.notifications ||
    payload?.list ||
    payload?.docs ||
    payload?.results ||
    payload?.items ||
    (Array.isArray(payload) ? payload : null) ||
    (Array.isArray(payload?.data) ? payload.data : null) ||
    [];

  if (!Array.isArray(notifs) && payload && typeof payload === 'object') {
    const maybeArr = Object.values(payload).find(v => Array.isArray(v));
    notifs = maybeArr || [];
  }

  if (!Array.isArray(notifs)) return [];

  const seen = new Set();
  return notifs.filter((notification, index) => {
    const id =
      notification?._id ||
      notification?.id ||
      notification?.notification_id ||
      notification?.notificationId ||
      `notification-${index}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

export const isNotificationUnread = notification => {
  if (!notification) return false;

  const readValue =
    notification.is_read ?? notification.read ?? notification.isRead;

  if (notification.status === 'read' || isTruthyRead(readValue)) {
    return false;
  }

  if (
    notification.status === 'unread' ||
    isFalsyRead(readValue)
  ) {
    return true;
  }

  if (notification.read_at || notification.readAt) {
    return false;
  }

  return true;
};

export const getUnreadNotificationCount = res => {
  if (!res) return 0;

  const payload = res.data ?? res;
  const directCount =
    payload?.unread_count ??
    payload?.unreadCount ??
    payload?.unread_notification_count ??
    payload?.totalUnread ??
    payload?.total_unread ??
    res?.unread_count ??
    res?.unreadCount;

  const parsedCount = toNumber(directCount);
  if (parsedCount != null && parsedCount >= 0) {
    return parsedCount;
  }

  if (res.success === false) return 0;

  const notifications = parseNotificationsFromResponse(res);
  return notifications.filter(isNotificationUnread).length;
};

export const formatNotificationBadgeCount = count => {
  if (!count || count <= 0) return '';
  return count > 99 ? '99+' : String(count);
};
