import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';

import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

const RatingModal = () => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <Modal
      isVisible={true}
      style={{margin: 0, justifyContent: 'flex-end'}}
      animationInTiming={600}>
      <View
        style={{
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
          padding: moderateScale(12),
          borderTopRightRadius: moderateScale(8),
          borderTopLeftRadius: moderateScale(8),
        }}>
        <Text>Hidfidf</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default React.memo(RatingModal);
