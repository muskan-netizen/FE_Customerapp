import { BlurView } from '@react-native-community/blur';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, textScale } from '../styles/responsiveSize';
import LinearGradient from 'react-native-linear-gradient';

const CustomBottomTabBarGlass = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { themeColors } = useSelector((state) => state?.initBoot);
  return (
    <View style={[styles.tabBarContainer, { bottom: moderateScale(insets.bottom) }]}>
      {/* Background Blur Layer */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={Platform.OS === 'ios' ? 'light' : 'xlight'}
        blurAmount={5}
      />
      {/* Tabs */}
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

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

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const icon =
            options.tabBarIcon &&
            options.tabBarIcon({
              focused: isFocused,
              tintColor: isFocused ? themeColors.primary_color : colors.black,
            });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tabButton,
                isFocused && styles.selectedTabOverlay
              ]}
              activeOpacity={0.9}
            >
              <View style={styles.tabContent}>
                <View
                  style={[styles.iconWrapper,]}
                >
                  {icon}
                </View>
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused ? themeColors.primary_color : colors.black,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomTabBarGlass;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: moderateScale(10),
    left: moderateScale(16),
    right: moderateScale(16),
    borderRadius: moderateScale(36),
    overflow: 'hidden',
    backgroundColor: colors.whiteOpacity15,
    borderWidth: 1,
    borderColor: colors.blackOpacity05,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(4),
    marginHorizontal: moderateScale(2),
    borderRadius: moderateScale(36),
  },
  selectedTabOverlay: {
    backgroundColor: colors.blackOpacity05,
    shadowColor: colors.black,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    padding: moderateScale(6),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: textScale(10),
    fontFamily: fontFamily.medium,
    marginTop: moderateScale(4),
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});
