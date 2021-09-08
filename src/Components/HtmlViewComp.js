//import liraries
import React from 'react';
import { StyleSheet } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, textScale } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';

const HtmlViewComp = ({
  plainHtml = null,
  numOfLine = 2,
  ...props
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const isDarkMode = theme;

  return (
    <HTMLView
      value={
        plainHtml.startsWith('<p>')
          ? plainHtml
          : '<p>' + plainHtml + '</p>'
      }

      stylesheet={{

        p: [
          styles.descriptionStyle,
          {
            color: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.textGreyE,
          },
        ],
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  descriptionStyle: {
    color: colors.textGreyE,
    fontSize: textScale(14),
    fontFamily: fontFamily.regular,
    lineHeight: moderateScale(22),
  },
})

export default HtmlViewComp;
