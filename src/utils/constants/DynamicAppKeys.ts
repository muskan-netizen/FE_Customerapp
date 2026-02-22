import { Platform } from 'react-native';

const shortCodes = {

  grub: 'c8fbba',
 
};

const appIds = {

  grub: Platform.select({
    ios: 'com.customer.restocare',
    android: 'com.customer.restocare',
  }),
};



export { appIds, shortCodes };

