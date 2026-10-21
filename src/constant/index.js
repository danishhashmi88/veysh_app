import { imagePath } from './imagePath';

export const SKELETON_TIME_OUT = 500;

export const policy_slug = {
  terms: 'termsandcondition',
  refund: 'refund_dispute_policy',
  privacy: 'privacy_policy',
};

export const features = [
  'Digitize my wardrobe',
  'Shopping',
  'Sell preloved/thrift',
  'Plan my outfits and save time',
  'Styling tips',
  'Get my tribe/community',
  'Track what I’m wearing',
  'Create and discover outfits',
  'Wardrobe stats and insights',
];

export const colorPaletteBrand = [
  { name: 'Red', colorCode: '#FF0000', showBorder: false },
  { name: 'Blue', colorCode: '#5B2DFF', showBorder: false },
  { name: 'Green', colorCode: '#2ECC71', showBorder: false },
  { name: 'Black', colorCode: '#000000', showBorder: false },
  { name: 'White', colorCode: '#FFFFFF', showBorder: true },
  { name: 'Pink', colorCode: '#FF4DFF', showBorder: false },
  { name: 'Purple', colorCode: '#6A0DAD', showBorder: false },
  { name: 'Orange', colorCode: '#FF8C1A', showBorder: false },
  { name: 'Yellow', colorCode: '#FFD43B', showBorder: false },
  { name: 'Brown', colorCode: '#7B3F00', showBorder: false },
  { name: 'Grey', colorCode: '#9E9E9E', showBorder: false },
  { name: 'Beige', colorCode: '#FFCC99', showBorder: false },
];

export const colorPalette = [
  { name: 'Black', colorCode: '#0A0A0A', showBorder: false },
  { name: 'Dark Brown', colorCode: '#3D2314', showBorder: false },
  { name: 'Blonde', colorCode: '#D4A76A', showBorder: false },
  { name: 'Platinum', colorCode: '#E5E4E2', showBorder: false },
  { name: 'Auburn', colorCode: '#A52A2A', showBorder: true },
  { name: 'Grey', colorCode: '#B2BEB5', showBorder: false },
];
export const colorPaletteEye = [
  { name: 'Dark Grey', colorCode: '#383838', showBorder: false },
  { name: 'Dark Brown', colorCode: '#5A292C', showBorder: false },
  { name: 'Blue', colorCode: '#4868B5', showBorder: false },
  { name: 'Hazel', colorCode: '#B4A250', showBorder: false },
  { name: 'Light Brown', colorCode: '#8B7466', showBorder: true },
  { name: 'Green', colorCode: '#49865D', showBorder: false },
  { name: 'Steel Blue', colorCode: '#6A7F84', showBorder: false },
];

export const bodyType = [
  { id: 1, label: 'Rectangle' },
  { id: 2, label: 'Triangle' },
  { id: 3, label: 'Inverted triangle' },
  { id: 4, label: 'Apple' },
  { id: 5, label: 'Hourglass' },
  { id: 6, label: 'Plus size' },
];

export const hairTypes = [
  { id: 1, label: 'Straight' },
  { id: 2, label: 'Wavy' },
  { id: 3, label: 'Curly' },
  { id: 4, label: 'Coily' },
];

export const faceShapes = [
  { id: 1, label: 'Oval' },
  { id: 2, label: 'Round' },
  { id: 3, label: 'Square' },
  { id: 4, label: 'Rectangle' },
];

export const gender = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' },
];

export const complexions = [
  { id: 1, label: 'Fair' },
  { id: 2, label: 'Medium' },
  { id: 3, label: 'Deep' },
  { id: 4, label: 'Warm' },
  { id: 5, label: 'Cool' },
  { id: 6, label: 'Neutral' },
];

export const dressStyles = [
  { id: 1, label: 'Classic' },
  { id: 2, label: 'Casual' },
  { id: 3, label: 'Trendy' },
  { id: 4, label: 'Edgy' },
  { id: 5, label: 'Boho' },
  { id: 6, label: 'Minimal' },
  { id: 7, label: 'Sporty' },
  { id: 8, label: 'Romantic' },
  { id: 9, label: 'Street' },
  { id: 10, label: 'Glam' },
  { id: 11, label: 'Chic' },
];

export const moodboardOptions = [
  { id: 1, label: 'Clean' },
  { id: 2, label: 'Bold' },
  { id: 3, label: 'Elegant' },
  { id: 4, label: 'Playful' },
  { id: 5, label: 'Effortless' },
  { id: 6, label: 'Confident' },
];

export const sustainabilityPreferences = [
  { id: 1, label: 'Thrift' },
  { id: 2, label: 'Rental' },
  { id: 3, label: 'Vegan Materials' },
  { id: 4, label: 'Local brands' },
];

export const profileTab = [
  {
    titleKey: 'Notification Settings',
    image: imagePath.profileIcons.notification,
    type: 'navigate',
    modalType: null,
    verificationNeeded: false,
    allowForGuest: false,
    route: 'NotificationSettings',
    params: {},
  },
  {
    titleKey: 'About Us',
    image: imagePath.profileIcons.about,
    type: 'navigate',
    modalType: null,
    verificationNeeded: false,
    allowForGuest: false,
    route: 'CmsScreen',
    params: { screenType: 'about_us' },
  },
  {
    titleKey: 'Contact Us',
    image: imagePath.profileIcons.contact_us,
    type: 'navigate',
    modalType: null,
    verificationNeeded: false,
    allowForGuest: false,
    route: 'ContactUs',
    params: {},
  },
  {
    titleKey: 'FAQ',
    image: imagePath.profileIcons.faq,
    type: 'navigate',
    modalType: null,
    verificationNeeded: false,
    allowForGuest: false,
    route: 'FrequentQuestions',
    params: {},
  },
  {
    titleKey: 'Privacy Settings',
    image: imagePath.profileIcons.privacy,
    type: 'navigate',
    modalType: null,
    verificationNeeded: false,
    allowForGuest: false,
    route: 'PrivacySettings',
    params: {},
  },
  {
    titleKey: 'Privacy Policy',
    image: imagePath.profileIcons.privacy_policy,
    type: 'navigate',
    modalType: null,
    verificationNeeded: false,
    allowForGuest: false,
    route: 'CmsScreen',
    params: { screenType: 'privacy' },
  },
  {
    titleKey: 'Terms of Service ',
    image: imagePath.profileIcons.terms,
    type: 'navigate',
    modalType: null,
    verificationNeeded: false,
    allowForGuest: false,
    route: 'CmsScreen',
    params: { screenType: 'terms' },
  },
];

//****************. Home Screen Data

export const homeScreenData = {
  header: {
    greeting: 'Hello, User',
    userImage: imagePath.avtarProfile,
    bell: imagePath.bell,
    menu: imagePath.menu,
    profile: imagePath.avtarProfile,
    planner: imagePath.planner,
    outfit: imagePath.outfit,
  },
  ///////////////////////
  actionCards: [
    {
      id: 1,
      image: imagePath.planner,
      isSvg: true,
    },
    {
      id: 2,
      image: imagePath.insight,
      isSvg: true,
    },
  ],
  ////////////////////////
  chatWidget: {
    title: 'Chat with Bae',
    subTitle: 'Ask what to wear today...',
    botIcon: imagePath.bot_face,
    BaeImage: imagePath.BaeImage,
    messIcon: imagePath.messIcon,
  },
  outfitOfTheDay: {
    title: 'Wedding Party',
    subTitle: 'Lorem ipsum sit amet',
    date: 'Today, 24th Oct',
    image: imagePath.outfit_day_main,
    // Ring:imagePath.Ring
  },
  wardrobeInsights: {
    recentSpend: '620.00',
    currency: '₹',
    tabs: ['Most Worn', 'Least Worn', 'Never Worn'],
    items: [
      { id: 1, name: 'Golden Ring', image: imagePath.ring_img },
      { id: 2, name: 'Jacket', image: imagePath.jacket_img },
      { id: 3, name: 'Black Blazer', image: imagePath.blazer_img },
      { id: 4, name: 'Pink Skirt', image: imagePath.skirt_img },
      { id: 5, name: 'Denim Jeans', image: imagePath.jeans_img },
      { id: 6, name: 'Sunglasses', image: imagePath.sunglasses_img },
    ],
  },
  latestPosts: [
    {
      id: 1,
      userName: 'Rishita Sharma',
      userImage: imagePath.rishita,
      time: '10 mins ago',
      postImage: imagePath.Post1,
      likes: 10,
      comments: 10,
      title: 'Outfit of the day 🤍',
      tags: '#outfit #style #clothes #stylist #new',
    },
    {
      id: 2,
      userName: 'Kanika Kapoor',
      userImage: imagePath.kanika,
      time: '10 mins ago',
      postImage: imagePath.post2,
      likes: ' 10',
      comments: 10,
      title: 'Dressing how I feel today.',
      tags: '#outfit #style #clothes #stylist #new',
    },
  ],
  buyOutfits: [
    {
      id: 1,
      title: 'Wedding Party',
      price: '1,000',
      image: imagePath.weddingParty,
    },
    {
      id: 2,
      title: 'Gala Party Outfit',
      price: '1,000',
      image: imagePath.galaPartyOutfits,
    },
    {
      id: 3,
      title: 'Gala Party Outfit',
      price: '1,000',
      image: imagePath.galaPartyOutfits,
    },
  ],
  stylistHighlights: [
    {
      id: 1,
      title: 'Summer Essentials',
      author: 'By Nancy Pastor',
      image: imagePath.summerEssential,
    },
    {
      id: 2,
      title: 'Trendy Outfit',
      author: 'Nancy Pastor',
      image: imagePath.trendyOutfits,
    },
    {
      id: 3,
      title: 'Trendy Outfit',
      author: 'Nancy Pastor',
      image: imagePath.trendyOutfits,
    },
  ],
};
export const profileData = {
  name: 'Caroline Barbee',
  username: 'caroline423',
  stats: { follower: 42, following: 34, items: 123 },
  stylist: { name: 'Nancy Pastor', image: imagePath.stylist },
  info: {
    image: imagePath.pencil,
    phone: '928-517-7314',
    dob: '10th Jan 1997',
    gender: 'Female',
    location: 'Delhi, India',
    goal: 'Digitize my wardrobe',
    bio: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  preferences: {
    colors: ['#FF0000', '#6200EE', '#00C853', '#000000'],
    brands: ['Zara', 'Gucci'],
    sizes: [
      { label: 'Shirt', val: 'XL', icon: imagePath.Shirticon },
      { label: 'Trouser', val: '32', icon: imagePath.TrouserIcon },
      { label: 'Shoe', val: '8', icon: imagePath.shoeIcon },
      { label: 'Wrist', val: '8', icon: imagePath.WristIcon },
    ],
    measurements: [
      { label: 'Bust', val: '32' },
      { label: 'Waist', val: '32' },
      { label: 'Hip', val: '32' },
      // { label: 'Circumference', val: '32' },
      { label: 'Height', val: '160 in' },
      { label: 'Inseam', val: '70' },
      { label: 'Shoulder', val: '40' },
    ],
    details: [
      { label: 'Body type:', val: 'Rectangle' },
      { label: 'Hair color:', val: 'Red', colorDot: '#FF0000' },
      { label: 'Hair type:', val: 'Straight' },
      { label: 'Eye color:', val: 'Blue', colorDot: '#6200EE' },
      { label: 'Face shape:', val: 'Round' },
      { label: 'Complexion:', val: 'Fair' },
    ],
    dislike: "Don't like black dress",
  },
  myStyle: {
    style: 'Classic',
    moodboard: 'Clean',
    sustainability: 'Thrift',
    icons: 'Loved Alia Bhatt Style',
    pinterest: 'www.pinterest.com',
    brands: 'Gucci, myntra',
  },
};
export const countryCodes = [
  {
    id: 1,
    code: '+91',
    country: 'India',
    flag: imagePath.IN_Flag,
  },
  {
    id: 2,
    code: '+1',
    country: 'USA',
    flag: imagePath.US_Flag,
  },
];
export const styleTags = [
  { id: 1, label: 'Classic' },
  { id: 2, label: 'Casual' },
  { id: 3, label: 'Trendy' },
  { id: 4, label: 'Edgy' },
  { id: 5, label: 'Boho' },
  { id: 6, label: 'Minimal' },
  { id: 7, label: 'Sporty' },
  { id: 8, label: 'Romantic' },
  { id: 9, label: 'Street' },
  { id: 10, label: 'Glam' },
  { id: 11, label: 'Chic' },
];

export const moodboardTags = [
  { id: 1, label: 'Clean' },
  { id: 2, label: 'Bold' },
  { id: 3, label: 'Elegant' },
  { id: 4, label: 'Playful' },
  { id: 5, label: 'Effortless' },
  { id: 6, label: 'Confident' },
];

export const sustainabilityTags = [
  { id: 1, label: 'Thrift' },
  { id: 2, label: 'Rental' },
  { id: 3, label: 'Vegan Materials' },
  { id: 4, label: 'Local brands' },
];
// export const categoriesList = [
//   { label: 'Tops', value: '6968bcb423a4ebc474721481' }, // ID from your log
//   { label: 'Bottoms', value: '6968c7386554ca03a5f93f60' },
//   { label: 'Dresses', value: '6968c7386554ca03a5f93f61' },
//   { label: 'Outerwear', value: '6968c7386554ca03a5f93f62' },
//   { label: 'Shoes', value: '6968c7386554ca03a5f93f63' },
//   { label: 'Accessories', value: '6968c7386554ca03a5f93f64' },
// ];

// export const subCategoriesList = [
//   { label: 'Shirt', value: '6968c7386554ca03a5f93f60' },
//   { label: 'T-shirt', value: '6968c7386554ca03a5f93f65' },
//   { label: 'Blouse', value: '6968c7386554ca03a5f93f66' },
//   { label: 'Jeans', value: '6968c7386554ca03a5f93f67' },
// ];

// Backend specific enums (Lowercase bhejne ke liye)
export const occasionsList = [
  'Party',
  'Casual',
  'Formal',
  'Daily',
  'Workout',
  'Lounge',
  'Ethnic',
  'Wedding',
];
export const seasonsList = ['Summer', 'Winter', 'Monsoon','Spring','Autumn'];

// Dropdown Options (Label/Value)
export const occasionOptions = occasionsList.map(item => ({
  label: item,
  value: item.toLowerCase(),
}));
export const seasonOptions = seasonsList.map(item => ({
  label: item,
  value: item.toLowerCase(),
}));
export const statusList = [
  'Donate',
  'Laundry',
  'Closet',
  'Sell',
  'Repair',
  'Lent',
  'Iron'
];
export const statusOptions = statusList.map(item => ({
  label: item,
  value: item.toLowerCase(),
}));

export const careList = ['Regular', 'Gentle', 'Dry Clean'];
export const careOptions = careList.map(item => ({
  label: item,
  value: item.toLowerCase().replace(/ /g, '_'),
}));
// export const careList = ['Regular', 'Gentle', 'Dry Clean'];

// export const careOptions = careList.map(item => ({
//   label: item,
//   value: item.toLowerCase().replace(/[\s]+/g, '_'),
// }));
export const moodsList = ['Romantic', 'Casual', 'Happy','Festive','Professional', 'Edgy', 'Sporty', 'Boho', 'Minimalist', 'Glam', 'Street', 'Ethnic/Traditional', 'Resort/Vacation', 'Cozy', 'Date Night', 'Power'];
export const moodOptions = moodsList.map(item => ({
  label: item,
  value: item.toLowerCase().replace(/[\s/]/g, '_'),
}));

export const buyerRouteName = 'user';
export const sellerRouteName = 'stylist';

export const user_roles = {
  buyer: 'user',
  seller: 'stylist',
};

export const colorOptions = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
];

export const fabricOptions = [
  { label: 'Cotton', value: 'cotton' },
  { label: 'Linen', value: 'linen' },
  { label: 'Polyester', value: 'polyester' },
  { label: 'Nylon', value: 'nylon' },
  { label: 'Rayon', value: 'rayon' },
  { label: 'Viscose', value: 'viscose' },
  { label: 'Wool', value: 'wool' },
  { label: 'Silk', value: 'silk' },
  { label: 'Denim', value: 'denim' },
  { label: 'Leather', value: 'leather' },
  { label: 'Suede', value: 'suede' },
  { label: 'Velvet', value: 'velvet' },
  { label: 'Corduroy', value: 'corduroy' },
  { label: 'Cashmere', value: 'cashmere' },
  { label: 'Fleece', value: 'fleece' },
  { label: 'Jersey', value: 'jersey' },
  { label: 'Satin', value: 'satin' },
  { label: 'Chiffon', value: 'chiffon' },
  { label: 'Georgette', value: 'georgette' },
  { label: 'Organza', value: 'organza' },
  { label: 'Tweed', value: 'tweed' },
  { label: 'Canvas', value: 'canvas' },
  { label: 'Spandex', value: 'spandex' },
  { label: 'Lycra', value: 'lycra' },
  { label: 'Acrylic', value: 'acrylic' },
  { label: 'Bamboo', value: 'bamboo' },
  { label: 'Hemp', value: 'hemp' },
  { label: 'Modal', value: 'modal' },
  { label: 'Tencel', value: 'tencel' },
  { label: 'Flannel', value: 'flannel' },
  { label: 'Khadi', value: 'khadi' },
];

// export const myClosetCategories = [
//   { id: 0, icon: imagePath.firstCloset },
//   { id: 1, icon: imagePath.pant },
//   { id: 2, icon: imagePath.skirt },
//   { id: 3, icon: imagePath.shirt },
//   { id: 4, icon: imagePath.shoes },
//   { id: 5, icon: imagePath.googlesCap },
//   { id: 6, icon: imagePath.saree },

// ];

export const categoryIconMap = {
  all: imagePath.firstCloset,
  accessories: imagePath.googlesCap,
  bottom: imagePath.pant,
  dress: imagePath.skirt,
  saree: imagePath.saree,
  shoes: imagePath.shoes,
  top: imagePath.shirt,
};

// UI mein dikhane ke liye exact order
export const categoryOrder = {
  accessories: 1,
  bottom: 2,
  dress: 3,
  saree: 4,
  shoes: 5,
  top: 6,
};

export const getCategoryType = (title = '') => {
  if (!title) return 'all';
  const t = title.toLowerCase().trim();

  // Order 1: Accessories (API matches: "Sunglasses")
  if (
    t.includes('sunglasses') ||
    t.includes('glass') ||
    t.includes('cap') ||
    t.includes('accessories')
  ) {
    return 'accessories';
  }

  // Order 2: Bottoms
  if (t.includes('pant') || t.includes('jeans') || t.includes('bottom')) {
    return 'bottom';
  }

  // Order 3: Dress (API matches: "Skirt")
  if (t.includes('skirt') || t.includes('dress') || t.includes('gown')) {
    return 'dress';
  }

  // Order 4: Saree (API matches: "Sareee")
  if (t.includes('saree') || t.includes('ethnic') || t.includes('kurta')) {
    return 'saree';
  }

  // Order 5: Shoes
  if (t.includes('shoe') || t.includes('heel') || t.includes('footwear')) {
    return 'shoes';
  }

  // Order 6: Top (API matches: "Tops", "Jackets", "Shirt")
  if (
    t.includes('top') ||
    t.includes('shirt') ||
    t.includes('jacket') ||
    t.includes('t-shirt') ||
    t.includes('outerwear')
  ) {
    return 'top';
  }

  return 'all';
};

export const myClosetItems = [
  { id: 1, title: 'Golden Ring', image: imagePath.ring_img },
  { id: 2, title: 'Jacket', image: imagePath.jacket_img },
  { id: 3, title: 'Black Blazer', image: imagePath.blazer_img },
  { id: 4, title: 'Pink Skirt', image: imagePath.skirt_img },
  { id: 5, title: 'Denim Jeans', image: imagePath.jeans_img },
  { id: 6, title: 'Sunglasses', image: imagePath.sunglasses_img },
  { id: 7, title: 'Golden Ring', image: imagePath.ring_img },
  { id: 8, title: 'Jacket', image: imagePath.jacket_img },
  { id: 9, title: 'Black Blazer', image: imagePath.blazer_img },
  { id: 10, title: 'Pink Skirt', image: imagePath.skirt_img },
  { id: 11, title: 'Denim Jeans', image: imagePath.jeans_img },
  { id: 12, title: 'Sunglasses', image: imagePath.sunglasses_img },
];

// Helper to generate range options
const generateRange = (start, end, step = 1, unit = ' in') => {
  const options = [];
  for (let i = start; i <= end; i += step) {
    options.push({ label: `${i}${unit}`, value: `${i}` });
  }
  return options;
};

// Size Options
export const shirtSizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(
  s => ({
    label: s,
    value: s,
  }),
);
export const trouserSizeOptions = generateRange(60, 120, 1);
export const shoeSizeOptions = [];
for (let i = 3; i <= 16; i++) {
  shoeSizeOptions.push({ label: `UK ${i}/${i + 34}`, value: `${i}` });
}
export const wristSizeOptions = generateRange(10, 30, 1);

// Measurement Options (CM)
export const bustOptions = generateRange(70, 160, 1);
export const waistOptions = generateRange(60, 160, 1);
export const hipOptions = generateRange(70, 160, 1);
export const circumferenceOptions = generateRange(50, 160, 1);
export const inseamOptions = generateRange(50, 110, 1);
export const shoulderOptions = generateRange(30, 70, 1);
export const sleeveLengthOptions = generateRange(40, 90, 1); // Typical range in inches

// Height Options (90in to 240in)
const generateHeightOptionsInIn = () => {
  const options = [];
  for (let i = 90; i <= 240; i++) {
    options.push({ label: `${i} in`, value: `${i}` });
  }
  return options;
};
export const heightOptions = generateHeightOptionsInIn();
