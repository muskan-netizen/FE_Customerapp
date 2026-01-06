import { Platform } from 'react-native';

const shortCodes = {

  grub: 'c8fbba',
 
};

const appIds = {

  grub: Platform.select({
    ios: 'com.customer.grub',
    android: 'com.customer.grub',
  }),
};



export { appIds, shortCodes };

