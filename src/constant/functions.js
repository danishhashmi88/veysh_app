import moment from "moment";

export const getPostTime = (date) => {
  const now = moment();
  const postDate = moment(date);

  const minutes = now.diff(postDate, 'minutes');
  if (minutes < 60) {
    const mins = Math.max(1, minutes);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  }

  const hours = now.diff(postDate, 'hours');
  if (hours < 24) {
    return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  }

  const days = now.startOf('day').diff(postDate.startOf('day'), 'days');

  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks <= 5) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  const months = now.diff(postDate, 'months');
  if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = now.diff(postDate, 'years');
  return years === 1 ? '1 year ago' : `${years} years ago`;
};



export const capitalizeFirstLetter = (text = '') => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
