import React, { Fragment, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import Elevations from 'react-native-elevation';
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

  // Animation for sliding border
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const tabWidth = 100 / state.routes.length; // Calculate tab width percentage

  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: state.index * tabWidth,
      useNativeDriver: false,
      tension: 50,
      friction: 12,
    }).start();
  }, [state.index, tabWidth]);

  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.backgroundGrey,
      }}>
      <View style={[styles.tabBarStyle,{paddingBottom: insets.bottom ? insets.bottom : moderateScaleVertical(28)}]}>
        {/* Sliding Border Bar */}
        <Animated.View
          style={[
            styles.slidingBorder,
            {
              left: slideAnimation.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              width: `${tabWidth}%`,
              backgroundColor: isDarkMode 
                ? MyDarkTheme.colors.text 
                : themeColors?.primary_color || colors.themeColor,
            },
          ]}
        />
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
                  // flexDirection : 'row',
                  justifyContent:'center'
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
                    marginTop: moderateScaleVertical(6),
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
      paddingTop: moderateScaleVertical(12),
      position: 'relative',

      ...Elevations[15],
    },
    slidingBorder: {
      position: 'absolute',
      top: 0,
      height: moderateScaleVertical(3),
      borderRadius: moderateScaleVertical(1.5),
    },
    labelStyle: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
  });
  return styles;
}
export default React.memo(CustomBottomTabBarFive);