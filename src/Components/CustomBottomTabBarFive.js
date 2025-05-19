import React, { Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';
const CustomBottomTabBarFive = ({
  state,
  descriptors,
  navigation,
  bottomTabNotify,

  ...props
}) => {
  const insets = useSafeAreaInsets();
  const { themeColors } = useSelector((state) => state.initBoot);

  const { appStyle } = useSelector((state) => state?.initBoot || {});

  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesData({ fontFamily });
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.backgroundGrey,
      }}>
      <View style={[styles.tabBarStyle]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Fragment key={route.name}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityStates={isFocused ? ['selected'] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                // onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  // height: 49,

                  // marginBottom:20
                }}>
                {options.tabBarIcon({
                  focused: isFocused,
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : isFocused
                      ? themeColors.primary_color
                      : colors.black,
                })}
                <Text
                  style={{
                    ...props.labelStyle,
                    ...styles.labelStyle,
                    color: isDarkMode
                      ? isFocused
                        ? MyDarkTheme.colors.text
                        : MyDarkTheme.colors.text
                      : isFocused
                        ? themeColors?.primary_color
                        : colors.textGrey,
                    opacity: isFocused ? 1 : 0.6,
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};

export function stylesData({ fontFamily }) {
  const currentTheme = useSelector((state) => state.initBoot);
  const { themeColors } = currentTheme;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const styles = StyleSheet.create({
    tabBarStyle: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,
      borderTopLeftRadius: moderateScale(35.5),
      borderTopRightRadius: moderateScale(35.5),
      paddingVertical: moderateScaleVertical(20),
      elevation: 15,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    labelStyle: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(11),
    },
  });
  return styles;
}
export default React.memo(CustomBottomTabBarFive);