import moment from 'moment';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { APP_LANGUAGES } from '../constant';
import parse from 'node-html-parser';
import cssToReactNative from 'css-to-react-native';
import { resetAuthState } from '../redux/slices/userSlice';
import { resetGlobalState } from '../redux/slices/globalSlice';
import { store } from '../redux/store';
import { Share } from 'react-native';
import { IMAGEURL, SHARE_BASE_URL } from './axios';

export const buildSharePostUrl = postId =>
  `${SHARE_BASE_URL}/post/${postId}`;

export const buildShareClosetUrl = itemId =>
  `${SHARE_BASE_URL}/closet/${itemId}`;


export const hp = percentage => {
  return heightPercentageToDP(percentage);
};

export const wp = percentage => {
  return widthPercentageToDP(percentage);
};

export const convertDateFormat = date => {
  const dateObj = moment(date, 'MM/DD/YYYY').toDate();
  return dateObj.toISOString();
};

export const calculateAge = dob => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const handleServerValidations = response => {
  let message = response.message;
  if (Array.isArray(response.error)) {
    if (response.error[0] && response.error[0].msg) {
      message = response.error[0].msg;
    } else if (response.error[0] && response.error[0].message) {
      message = response.error[0].message;
    }
  }
  return message;
};

export const truncateText = (text, maxLength = 20) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const handleUnauthorizedAccess = async () => {
  store.dispatch(resetAuthState());
  store.dispatch(resetGlobalState());
};

export function separateWords(text) {
  if (!text) return '';
  return text.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function splitUnderscoreWords(input) {
  if (!input) return '';
  return input.replace(/_/g, ' ');
}

export function cleanString(input) {
  return input.trim().replace(/\s{2,}/g, ' ');
}

export function getExtention(url) {
  return url.split('.')[url.split('.').length - 1];
}

export const formatVersion = version => {
  let parts = version.split('.');
  // Ensure always 3 parts
  while (parts.length < 3) {
    parts.push('0');
  }

  return parts.slice(0, 3).join('.');
};

export const getLanguageCode = value => {
  return APP_LANGUAGES.filter(item => {
    return item.code === value || item.name === value || item.label === value;
  })[0];
};

export const changeLanguage = lang => { };

export function extractInlineStylesFromHtml(htmlString) {
  const root = parse(htmlString);
  const allElements = root.querySelectorAll('*');

  const classesStyles = {};
  let classIndex = 0;

  allElements.forEach(el => {
    const styleAttr = el.getAttribute('style');
    if (styleAttr) {
      // Convert inline style to RN style
      const stylePairs = styleAttr
        .split(';')
        .filter(Boolean)
        .map(style => {
          const [prop, value] = style.split(':');
          return [prop.trim(), value.trim()];
        });

      try {
        const className = `dynamic-style-${classIndex++}`;
        el.setAttribute('class', className);
        el.removeAttribute('style');

        classesStyles[className] = cssToReactNative(stylePairs);
      } catch (err) {
        console.warn('Style parse failed:', styleAttr, err);
      }
    }
  });

  return {
    html: root.toString(),
    classesStyles,
  };
}

export const stripCountryCode = (phone = '') => {
  if (!phone) return '';
  return phone.split(' ')[1];
};

export const attachCountryCode = (phone = '', countryCode = '+91') => {
  if (!phone) return '';
  return `${countryCode} ${phone}`;
};

export const capitalize = (str = '') => {
  if (typeof str !== 'string' || !str.length) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatEndTime = date => {
  if (!date) return '';
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
};

export const extractFileName = url => {
  if (!url) return '';
  return url.split('/').pop();
};

export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0m';

  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;

  let result = [];

  if (days > 0) result.push(`${days}d`);
  if (hours > 0) result.push(`${hours}h`);
  if (mins > 0) result.push(`${mins}m`);

  return result.join(' ');
}

export const safeParseArray = data => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return [data];
    }
  }
  return [];
};

export const toSafeString = val => {
  if (val == null) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'number' && !Number.isNaN(val)) return String(val);
  return '';
};

export const pickString = (...values) => {
  for (const val of values) {
    const normalized = toSafeString(val);
    if (normalized) return normalized;
  }
  return '';
};

export const safeGoBack = (navigation, fallback) => {
  if (navigation?.canGoBack?.()) {
    navigation.goBack();
    return;
  }

  if (typeof fallback === 'string') {
    navigation.navigate(fallback);
  } else if (typeof fallback === 'function') {
    fallback(navigation);
  }
};

export const getImageUrl = (path, defaultFolder = '') => {
  if (!path) return null;
  if (typeof path !== 'string') return path;

  // 1. Fix double protocol (most likely cause of iOS URI parsing error)
  let cleanPath = path.replace(/^(https?:\/\/)\1+/g, '$1');

  // 2. Fix multiple http occurrences (e.g. mangled by nested baseURLs)
  const lastHttp = cleanPath.lastIndexOf('http');
  if (lastHttp > 0) {
    cleanPath = cleanPath.substring(lastHttp);
  }

  // 3. If it's a full URL or local file path now, return it
  if (cleanPath.startsWith('http') || cleanPath.startsWith('file://') || cleanPath.startsWith('content://')) {
    return cleanPath;
  }

  // 4. Handle absolute local paths (e.g. from ImagePicker)
  if (cleanPath.startsWith('/') && (cleanPath.includes('/Users/') || cleanPath.includes('/var/') || cleanPath.includes('/storage/') || cleanPath.includes('/sdcard/'))) {
    return `file://${cleanPath}`;
  }

  // 4. Handle relative paths
  const baseUrl = IMAGEURL.endsWith('/') ? IMAGEURL.slice(0, -1) : IMAGEURL;

  // Apply default folder if path doesn't already contain it
  let finalPath = cleanPath;
  if (defaultFolder && !finalPath.includes(defaultFolder)) {
    const folder = defaultFolder.endsWith('/') ? defaultFolder : `${defaultFolder}/`;
    const relative = finalPath.startsWith('/') ? finalPath.slice(1) : finalPath;
    finalPath = `${folder}${relative}`;
  }

  const relativePath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;

  return `${baseUrl}${relativePath}`;
};

/**
 * Normalizes post `createdBy` from common API shapes:
 * - populated user object with `_id`
 * - nested under `0` / `[0]` (legacy populate quirk)
 * - string user id only
 */
export const normalizeCreatedBy = createdBy => {
  if (!createdBy) return null;

  if (typeof createdBy === 'string') {
    return { _id: createdBy };
  }

  if (Array.isArray(createdBy)) {
    return normalizeCreatedBy(createdBy[0]);
  }

  if (typeof createdBy !== 'object') {
    return null;
  }

  const nested = createdBy[0] ?? createdBy['0'];
  const hasNestedUser =
    nested &&
    typeof nested === 'object' &&
    (nested._id ||
      nested.id ||
      nested.username ||
      nested.full_name ||
      nested.name);

  const user =
    hasNestedUser && !createdBy._id && !createdBy.id ? nested : createdBy;

  const profile_image = hasNestedUser
    ? nested.profile_image ||
      nested.profileImage ||
      user.profile_image ||
      user.profileImage
    : user.profile_image || user.profileImage;

  const username =
    user.username ||
    user.full_name ||
    user.fullName ||
    user.name ||
    [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
    undefined;

  const userId =
    user._id ||
    user.id ||
    createdBy._id ||
    createdBy.id ||
    nested?._id ||
    nested?.id;

  return {
    ...user,
    _id: userId,
    username,
    profile_image: profile_image
      ? getImageUrl(profile_image)
      : profile_image,
  };
};

export const extractPlannerList = payload => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.list)) return payload.list;
  if (Array.isArray(payload.events)) return payload.events;
  if (Array.isArray(payload.planner)) return payload.planner;
  if (Array.isArray(payload.plannerList)) return payload.plannerList;
  if (payload.data) return extractPlannerList(payload.data);
  return [];
};

export const filterPlannerEventsForToday = (events = []) => {
  const today = moment().format('YYYY-MM-DD');
  return events.filter(event => {
    if (!event?.event_date) return false;
    const eventDay = moment(event.event_date).format('YYYY-MM-DD');
    return eventDay === today;
  });
};

export const mapBackendUserToFrontend = user => {
  if (!user) return null;

  const profileImg = getImageUrl(
    user.profile_image || user.profile_img || user.profileImage,
  );

  const nameParts = pickString(user.name).split(/\s+/).filter(Boolean);

  return {
    firstName: pickString(user.firstName, user.first_name, nameParts[0]),
    lastName: pickString(
      user.lastName,
      user.last_name,
      nameParts.slice(1).join(' '),
    ),
    first_name: pickString(user.first_name, user.firstName, nameParts[0]),
    last_name: pickString(
      user.last_name,
      user.lastName,
      nameParts.slice(1).join(' '),
    ),
    full_name: pickString(
      user.full_name,
      user.name,
      `${pickString(user.first_name, user.firstName)} ${pickString(
        user.last_name,
        user.lastName,
      )}`.trim(),
    ),
    username: pickString(user.username),
    phone: pickString(user.phone_number, user.phone),
    location: pickString(user.address, user.location),
    bio: pickString(user.long_bio, user.short_bio, user.bio),
    gender: pickString(user.gender),
    dob: pickString(user.DOB, user.dob),
    dobISO: pickString(user.DOB, user.dob),
    goals: safeParseArray(user.goals || user.app_goals),
    // ... remaining profile parsing logic, only adding safeParseArray ...
    profileImage: profileImg,
    profile_image: profileImg, // UI Compatibility

    _id: user._id || user.id,
    email: user.email,

    // Unified Stylist Code
    stylistCode: pickString(
      user.referral_code,
      user.referral_link,
      user.stylist_referral_link,
      user.stylistCode,
    ),

    // Explicitly parse Brand/Color prefs to root replacing old mapping
    preferred_colors: safeParseArray(user.preferred_colors || user.colors),
    brands: safeParseArray(user.preferred_brands || user.brands),
    custom_brand: pickString(user.custom_brand, user.customBrand),

    stylePreferences: user.style_preferences || user.stylePreferences || {},
    sizes: user.sizes || {},
    measurements: user.measurement || user.measurements || {},

    // Style fields
    styleDesc: pickString(user.style_desc, user.style_icon, user.styleDesc),
    style: safeParseArray(user.style),
    moodboard: safeParseArray(user.mood_board || user.moodboard),
    pinterestLink: pickString(user.pinterest_link, user.pinterestLink),
    marketPlace: user.marketPlace || user.brands || [],
    sustainablityPreference: safeParseArray(
      user.sustain_preferences ||
      user.sustainability ||
      user.sustainablityPreference,
    ),

    // Appearance fields
    bodyType: pickString(user.body_type, user.bodyType),
    hairColor: pickString(user.hair_color, user.hairColor),
    hairType: pickString(user.hair_type, user.hairType),
    eyeColor: pickString(user.eye_color, user.eyeColor),
    faceShape: pickString(user.face_shape, user.faceShape),
    complexion: pickString(user.complexion),
    dislikes: pickString(user.dislikes),
    bodyImages: (() => {
      let imgs = user.full_body_image || user.bodyImages || [];
      if (typeof imgs === 'string') imgs = [imgs];
      if (!Array.isArray(imgs)) imgs = [];
      const mapped = imgs
        .filter(Boolean)
        .map(img => {
          if (!img || typeof img !== 'string') return img;
          if (img.startsWith('http')) {
            if (
              img.includes('devtechnosys.tech') &&
              !img.includes('uploads/users/')
            ) {
              return img.replace(
                'devtechnosys.tech/',
                'devtechnosys.tech/uploads/users/',
              );
            }
            return img;
          }
          return `${IMAGEURL}uploads/users/${img}`;
        })
        .filter(Boolean);
      // Keep a single full-body photo in app state/UI
      return [...new Set(mapped)].slice(-1);
    })(),

    // Slugs
    profile_slugs: user.profile_slugs || {},
    slug: pickString(user.slug),

    // Privacy & Notifications
    privacy_settings: user.privacy_settings || {
      only_me: user.closetPrivacy === 'ONLY_ME',
      followers_only: user.closetPrivacy === 'STYLIST_ONLY',
      closet: true,
      post: true
    },
    notification_settings: user.notification_settings || {
      push: {
        outfit_reminders: true,
        new_messages: true,
        posts_with_mention: true,
        posts_from_follow: true,
        bae_notifications: true,
        likes: true,
        comments: true,
      },
      email: {
        outfit_reminders: true,
        new_messages: true,
        posts_with_mention: true,
        posts_from_follow: true,
        bae_notifications: true,
        likes: true,
        comments: true,
      },
    },
    closetPrivacy: pickString(user.closetPrivacy),

    // Stats
    itemsCount: user.itemsCount || user.totalItems || 0,
    outfitsCount: user.outfitsCount || user.totalOutfits || 0,
    followers: user.followers || 0,
    following: user.following || 0,
  };
};

export const getScreenNameFromSlug = slugs => {
  console.log(slugs, 'slugs');

  // 1. Check if slugs is null/undefined first
  if (!slugs) return 'CompleteProfile';

  // 2. Iterate through steps. If any step is false/missing, go there.
  if (!slugs.basic) return 'CompleteProfile';
  if (!slugs.preferences) return 'BrandPreference';
  if (!slugs.size_info) return 'SizeInfo';
  if (!slugs.appearance) return 'PersonalApperence';
  if (!slugs.style_info) return 'DefineYourStyle';
  if (!slugs.privacy) return 'PrivacySetting';

  // 3. FIX: Return 'MainTab' so Login.js knows to switch the Redux state
  return 'MainTab';
};


const normalizeShareImagePath = (path, folder) => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith('http')) {
    return path.replace(IMAGEURL, '').replace(/^\//, '');
  }
  let relative = path.startsWith('/') ? path.slice(1) : path;
  if (folder && !relative.includes(folder)) {
    const normalizedFolder = folder.endsWith('/') ? folder : `${folder}/`;
    relative = `${normalizedFolder}${relative}`;
  }
  return relative;
};

const collectShareImages = (primary, list, folder) => {
  const rawPaths = [];
  if (primary) rawPaths.push(primary);
  if (Array.isArray(list)) rawPaths.push(...list);

  const relativePaths = [
    ...new Set(
      rawPaths
        .map(path => normalizeShareImagePath(path, folder))
        .filter(Boolean),
    ),
  ];

  return relativePaths.map(path => getImageUrl(path));
};

export const getCategorySizeLabels = sizes =>
  (sizes || []).map(size => (typeof size === 'object' ? size.title : size));

export const getUniqueSizesFromCategories = (categories = []) => {
  const allSizes = categories.flatMap(category =>
    getCategorySizeLabels(category?.sizes),
  );
  return [...new Set(allSizes.filter(Boolean))];
};

export const getImageMimeType = filename => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/jpeg';
};

export const remoteImageToUploadFile = async url => {
  const name = url.split('/').pop()?.split('?')[0] || `image_${Date.now()}.jpg`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();
  const dataUri = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return {
    uri: dataUri,
    name,
    type: blob.type || getImageMimeType(name),
  };
};

export const buildSharePostPayload = ({ type, outfit, item }) => {
  if (type === 'outfit' && outfit) {
    return {
      caption: outfit.name || outfit.title || '',
      location: '',
      images: collectShareImages(outfit.image, outfit.images, 'uploads/outfits'),
      fromShare: true,
      outfit_id: outfit._id,
    };
  }
  if (type === 'item' && item) {
    return {
      caption: item.title || item.name || '',
      location: '',
      images: collectShareImages(item.image, item.images, 'uploads/items'),
      fromShare: true,
      item_id: item._id,
    };
  }
  return null;
};

export const onShareNative = async post => {
  try {
    const shareUrl = buildSharePostUrl(post?._id);
    const messageText = `Check out this post on Veysh: ${post?.caption || ''}`;
    const shareMessage = `${messageText}\n\n${shareUrl}`;

    await Share.share({
      message: shareMessage,
      url: shareUrl,
      title: 'Share Post',
    });
  } catch (error) {
    if (error?.message !== 'User did not share') {
      alert(error.message);
    }
  }
};

export const onShareItemCloset = async item => {
  try {
    const shareUrl = buildShareClosetUrl(item?._id);
    const messageText = `Check out this item on Veysh: ${item?.name || ''}`;
    const shareMessage = `${messageText}\n\n${shareUrl}`;

    await Share.share({
      message: shareMessage,
      url: shareUrl,
      title: 'Share Item',
    });
  } catch (error) {
    if (error?.message !== 'User did not share') {
      alert(error.message);
    }
  }
};