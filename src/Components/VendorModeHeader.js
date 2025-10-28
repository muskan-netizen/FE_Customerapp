import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { getImageUrl, showError, showSuccess } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

// Separate component for each tab item to properly use hooks
const VendorModeItem = React.memo(({ item, index, isSelected, onPressItem, themeColors, fontFamily, isDarkMode, tabs }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const getVendorModeImage = (item) => {
    if (item?.icon) {
      if (typeof item.icon === 'string') {
        return item.icon;
      } else if (item.icon?.image_path) {
        return getImageUrl(
          item.icon.image_fit,
          item.icon.image_path,
          '1024/2048'
        );
      }
    }
    return null;
  };

  const getVendorModeActiveImage = (item) => {
    if (item?.active_icon) {
      if (typeof item.active_icon === 'string') {
        return item.active_icon;
      } else if (item.active_icon?.image_path) {
        return getImageUrl(
          item.active_icon.image_fit,
          item.active_icon.image_path,
          '1024/2048'
        );
      }
    }
    return null;
  };

  const imageUri = getVendorModeImage(item);
  const activeImageUri = getVendorModeActiveImage(item);
  const styles = stylesFunc({ fontFamily, themeColors, isDarkMode });

  return (
    <Animated.View style={animatedStyle}>
      {
        imageUri ?
          <Pressable
            disabled={item?.isActive}
            onPress={() => onPressItem(item, index)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            hitSlop={hitSlopProp}
            style={[{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: moderateScale(12),
              backgroundColor: colors.greyNew,
              borderRadius: moderateScale(8),
              height: moderateScale(58),
              minWidth: tabs.length == 2 ? (width - moderateScale(32) - moderateScale(24)) / 2 : (width - moderateScale(32) - moderateScale(24)) / 3,
            },
            ]}
          >
            <FastImage
              source={{ uri: isSelected ? activeImageUri : imageUri }}
              style={{...styles.vendorModeIconImage, 
                width: tabs.length == 2 ? (width - moderateScale(32) - moderateScale(24)) / 2 : (width - moderateScale(32) - moderateScale(24)) / 3}}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </Pressable> :

          <Pressable
            disabled={item?.isActive}
            onPress={() => onPressItem(item, index)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            hitSlop={hitSlopProp}
            style={[
              styles.vendorModeItem,
              tabs.length == 2 && { width: (width - moderateScale(32) - moderateScale(24)) / 2 },
              isSelected && { backgroundColor: themeColors.primary_color, borderWidth: 1, borderColor: colors.white },
            ]}>
            <Text
              style={[
                styles.vendorModeTitle,
                {
                  color: isSelected ? colors.white : colors.black,
                },
              ]}>
              {item?.name}
            </Text>
          </Pressable>
      }
    </Animated.View>
  );
});

VendorModeItem.displayName = 'VendorModeItem';

function VendorModeHeader({ selectedToggle = () => { }, containerStyle = {} }) {
  const { cartItemCount } = useSelector(state => state?.cart);
  const {
    appData,
    themeColors,
    appStyle,
    currencies,
    languages,
    themeToggle,
    themeColor,
  } = useSelector(state => state?.initBoot);
  const { dineInType } = useSelector(state => state?.home);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors, isDarkMode });

  const flatRef = useRef(null);
  const [myTabs, setTabs] = useState(appData?.profile?.preferences?.vendorMode);

  const tabs = useMemo(() => myTabs);

  useEffect(() => {
    setTabs(appData?.profile?.preferences?.vendorMode || []);
  }, [tabs]);

  const _onTableItm = (value, indx) => {
    const newTabs = tabs.map((item, index) => ({
      ...item,
      isActive: index === indx, // activate only the clicked one
    }));

    setTabs(newTabs);
    selectedToggle(newTabs[indx]?.type);
  };

  const dineInFunction = (item, indx) => {
    Alert.alert('', strings.REMOVE_CART_MSG, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(item, indx) },
    ]);
  };

  const clearCart = (item, indx) => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: deviceInfoModule.getUniqueId(),
        },
      )
      .then(res => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
        _onTableItm(item, indx);
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    showError(error?.message || error?.error);
  };

  const onPressItem = (item, index) => {
    !(cartItemCount?.message == null && cartItemCount?.data?.item_count > 0)
      ? _onTableItm(item, index)
      : dineInFunction(item, index);
  };

  const renderItem = ({ item, index }) => {
    const isSelected = dineInType === item?.type;

    return (
      <VendorModeItem
        item={item}
        index={index}
        isSelected={isSelected}
        onPressItem={onPressItem}
        themeColors={themeColors}
        fontFamily={fontFamily}
        isDarkMode={isDarkMode}
        tabs={tabs}
      />
    );
  };

  const awesomeChildListKeyExtractor = useCallback(
    item => `vendor-mode-key-${item?.type}`,
    [tabs],
  );
  if (tabs.length <= 1) {
    return <></>;
  }

  return (
    <View>
      <FlatList
        ref={flatRef}
        horizontal
        overScrollMode='never'
        showsHorizontalScrollIndicator={false}
        data={tabs}
        renderItem={renderItem}
        keyExtractor={awesomeChildListKeyExtractor}
        contentContainerStyle={[styles.flatListContent, containerStyle]}
      />
    </View>
  );
}

export function stylesFunc({ fontFamily, themeColors, isDarkMode }) {
  const styles = StyleSheet.create({
    flatListContent: {
      marginBottom: moderateScaleVertical(12),
    },
    vendorModeItem: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: moderateScale(12),
      minWidth: (width - moderateScale(32) - moderateScale(24)) / 3,
      backgroundColor: colors.greyNew,
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      minHeight: moderateScale(58),
    },
    iconContainer: {
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(16),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: moderateScale(8),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 8,
    },
    selectedIconContainer: {
      // Selected state styling
    },
    vendorModeIcon: {
      width: moderateScale(26),
      height: moderateScale(26),
      marginBottom: moderateScaleVertical(4),
    },
    vendorModeIconImage: {
      minWidth: (width - moderateScale(42) - moderateScale(24)) / 3,
      height: moderateScale(58),
      borderRadius: moderateScale(8),
    },
    placeholderIcon: {
      width: moderateScale(50),
      height: moderateScale(50),
      borderRadius: moderateScale(25),
    },
    vendorModeTitle: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      textAlign: 'center',
      textTransform: 'capitalize',
    },
  });
  return styles;
}

export default React.memo(VendorModeHeader);
