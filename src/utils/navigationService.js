import { createNavigationContainerRef } from '@react-navigation/native';
import { navigationRef } from '../navigation';

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
