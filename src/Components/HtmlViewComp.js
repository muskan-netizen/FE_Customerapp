import React from 'react';
import HTMLView from 'react-native-htmlview';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, textScale } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';

const HtmlViewComp = ({ plainHtml = null, numOfLine = 2, ...props }) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const isDarkMode = theme;

  return (
    <HTMLView
      value={
        plainHtml.startsWith('<p>') ? plainHtml : '<p>' + plainHtml + '</p>'
      }
      stylesheet={{
        p: {
          fontSize: textScale(10),
          color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyE,
          fontFamily:fontFamily.regular,
          lineHeight: moderateScale(16),
        },
      }}
      {...props}
    />
  );
};


export default HtmlViewComp;
