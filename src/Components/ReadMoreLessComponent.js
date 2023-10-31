import React, {memo, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';

const ReadMoreLessComponent = ({
  maxLength = 100,
  text,
  readMore,
  toggleExpanded = () => {},
}) => {
  // --------------------redux state
  const {themeColor, themeToggle} = useSelector(state => state?.initBoot || {});
  const darkthemeusingDevice = useDarkMode();

  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) : text;
  return (
    <>
      <Text
        style={{
          marginTop: moderateScaleVertical(8),
          color: colors.textColor,
          marginHorizontal: moderateScale(2),
        }}>
        {readMore ? text : truncatedText}
        <Text style={{   color: colors.black}}
        onPress={toggleExpanded}>
          ...{readMore ? 'Read Less' : 'Read more'}
        </Text>
      </Text>
      {/* )} */}
    </>
  );
};

export default memo(ReadMoreLessComponent);
