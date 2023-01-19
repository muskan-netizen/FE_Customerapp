import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {
  moderateScale,
  StatusBarHeight,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';

const Header3 = ({
  leftIcon = imagePath.back,
  location = [],
  conatinerStyle = {},
}) => {
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: StatusBarHeight,
        marginHorizontal: moderateScale(15),
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        // flex: 1,
        ...conatinerStyle,
      }}>
      <TouchableOpacity
        style={{
          flex: 0.1,
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={leftIcon}
          style={{
            tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}
        />
      </TouchableOpacity>
      {!!appData?.profile?.preferences?.is_hyperlocal && (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}
          onPress={() =>
            navigation.navigate(navigationStrings.LOCATION, {
              type: 'Home1',
            })
          }>
          <Image
            style={{
              marginRight: moderateScale(10),
            }}
            source={imagePath.redLocation}
          />
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
              fontSize: textScale(10),
            }}>
            {location?.address}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default React.memo(Header3);

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({});
  return styles;
}
