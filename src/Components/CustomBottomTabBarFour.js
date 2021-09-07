import React, {Fragment} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';

export default function CustomBottomTabBarFour({
  state,
  descriptors,
  navigation,
  bottomTabNotify,

  ...props
}) {
  const insets = useSafeAreaInsets();

  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesData({fontFamily});

  return (
    <View style={[styles.tabBarStyle]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
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
                tintColor: isFocused ? themeColors.primary_color : colors.black,
              })}
              <Text
                style={{
                  ...props.labelStyle,
                  ...styles.labelStyle,
                  color: isFocused ? themeColors.primary_color : colors.black,
                  opacity: isFocused ? 1 : 0.6,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </View>
  );
}

export function stylesData({fontFamily}) {
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors} = currentTheme;

  const styles = StyleSheet.create({
    tabBarStyle: {
      // height: Platform.OS === 'ios' ? 60 + insets.bottom : 70 + insets.bottom,
      flexDirection: 'row',
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScaleVertical(15),
      backgroundColor: colors.white,
      position: 'absolute',
      left: moderateScale(25),
      right: moderateScale(25),
      bottom: moderateScaleVertical(10),
      borderRadius: moderateScale(35.5),
      shadowColor: colors.black,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: colors.white,
    },
    labelStyle: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(9),
    },
  });
  return styles;
}
