import React, { Fragment } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScaleVertical } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';

const CustomBottomTabBar = ({
  state,
  descriptors,
  navigation,
  bottomTabNotify,
  ...props
}) => {

  const insets = useSafeAreaInsets();
  const { themeColors, themeToggle, themeColor, appStyle } = useSelector(
    (state) => state.initBoot,
  );

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  return (
    <LinearGradient
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={{
        height: Platform.OS === 'ios' ? moderateScaleVertical(45) + insets.bottom : moderateScaleVertical(50) + insets.bottom,
        flexDirection: 'row',
        alignItems: "center"
      }}
      colors={
        isDarkMode
          ? [MyDarkTheme.colors.lightDark, MyDarkTheme.colors.lightDark]
          : [themeColors.primary_color, themeColors.primary_color]
      }>
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
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',

              }}>
              {options.tabBarIcon({ focused: isFocused })}
              <Text
                style={{
                  ...props.labelStyle,
                  color: isFocused
                    ? themeColors.secondary_color
                    : colors.whiteOpacity85,
                  opacity: isFocused ? 1 : 0.6,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </LinearGradient>
  );
};
export default React.memo(CustomBottomTabBar);
