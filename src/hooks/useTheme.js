import { useSelector } from 'react-redux';
import { DarkColors, LightColors } from '../constant/colors';

export const useTheme = () => {
  const theme = useSelector(state => state.theme.theme);

  return theme === 'dark' ? DarkColors : LightColors;
};
