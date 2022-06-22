import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';
import colors from '../styles/colors';
import strings from '../constants/lang';
import imagePath from '../constants/imagePath';
import ButtonWithLoader from './ButtonWithLoader';
import {getImageUrl} from '../utils/helperFunctions';

const LaundryAddonModal = ({
  isVisible = false,
  hideModal = () => {},
  flatlistData = [],
  isLoadingAddons = true,
  selectedLaundryCategory = {},
  onPressLaundryCategory = () => {},
  onLaundryAddonSelect = () => {},
  selectedAddonSet = [],
  onPressProceed = () => {},
}) => {
  const {
    themeColor,
    themeToggle,
    appStyle,
    themeColors,
    languages,
    currencies,
  } = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors, isDarkMode});

  console.log(selectedAddonSet, 'selectedAddonSet>>>>');

  const checkIdPresetinAddon = (itmId, addonId) => {
    return selectedAddonSet.some(
      (item) => item?.id == itmId && item?.estimate_addon_id == addonId,
    );
  };

  const renderLaundryCategoryItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressLaundryCategory(item)}
        style={{
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri: getImageUrl(
              item?.category?.image?.image_fit,
              item?.category?.image?.image_path,
              '600/6000',
            ),
          }}
          style={{
            height: moderateScaleVertical(100),
            width: moderateScaleVertical(100),
            borderRadius: moderateScale(10),
            borderWidth: selectedLaundryCategory?.id == item?.id ? 4 : 0,
            borderColor: themeColors.primary_color,
          }}
        />
        <Text
          style={{
            width: moderateScaleVertical(100),
            textAlign: 'center',
            marginTop: moderateScaleVertical(15),
            fontSize: textScale(12),
            fontFamily: fontFamily.regular,
          }}>
          {item?.estimate_product_translation?.name ||
            item?.estimate_product_translation?.slug ||
            ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEstimateProductAddons = (itm) => {
    console.log(itm, 'itm>>>>>>itm');
    return (
      <View>
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(13),
          }}>
          {itm?.estimate_addon_set?.title}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: textScale(12),

            color: colors.black,
            opacity: 0.5,
            marginVertical: moderateScaleVertical(10),
          }}>
          Min {itm?.estimate_addon_set?.min_select} Max{' '}
          {itm?.estimate_addon_set?.max_select} sellections allowed
        </Text>
        <FlatList
          data={itm?.estimate_addon_set?.option}
          renderItem={({item, index}) => renderAddonOptions(item, itm)}
          ItemSeparatorComponent={() => (
            <View style={{height: moderateScaleVertical(8)}} />
          )}
        />
      </View>
    );
  };

  const renderAddonOptions = (item, categoryDetails) => {
    return (
      <TouchableOpacity
        onPress={() => onLaundryAddonSelect(item, categoryDetails)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}>
          {item?.title}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(11),
              marginRight: moderateScale(10),
            }}>
            {item?.price}
          </Text>

          {checkIdPresetinAddon(
            item?.id,
            categoryDetails?.estimate_addon_set?.id,
          ) ? (
            <Image source={imagePath.checkBox2Active} />
          ) : (
            <Image source={imagePath.checkBox2InActive} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={hideModal}>
      {isLoadingAddons ? (
        <View
          style={{
            height: moderateScaleVertical(100),
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopRightRadius: moderateScale(10),
            borderTopLeftRadius: moderateScale(15),
          }}>
          <Text>Loading... </Text>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <Text
            style={{
              ...styles.titleText,
              paddingHorizontal: moderateScale(12),
            }}>
            {'LAUNDRY SERVICES'}{' '}
          </Text>
          <View
            style={{
              paddingHorizontal: moderateScale(12),
              paddingVertical: moderateScaleVertical(15),
            }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              horizontal
              data={flatlistData || []}
              renderItem={renderLaundryCategoryItem}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: moderateScale(15),
                  }}
                />
              )}
            />
          </View>
          <View style={styles.horizontaLine} />
          <View
            style={{
              paddingHorizontal: moderateScale(12),
            }}>
            <Text
              style={{
                ...styles.titleText,
                paddingVertical: moderateScaleVertical(15),
              }}>
              {'ADD ONS'}{' '}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={selectedLaundryCategory?.estimate_product_addons || []}
              renderItem={({item}) => renderEstimateProductAddons(item)}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: moderateScale(20),
                  }}
                />
              )}
              ListFooterComponent={() => (
                <ButtonWithLoader
                  btnText="PROCEED"
                  onPress={hideModal}
                  btnTextStyle={{
                    color: colors.white,
                    textTransform: 'none',
                    fontSize: textScale(14),
                  }}
                  btnStyle={{
                    marginTop: moderateScaleVertical(20),
                    height: moderateScaleVertical(45),
                    borderRadius: moderateScale(5),
                    backgroundColor: themeColors.primary_color,
                    borderWidth: 0,
                    marginBottom: moderateScaleVertical(300),
                  }}
                />
              )}
            />
          </View>
        </View>
      )}
    </Modal>
  );
};

export function stylesFunc({fontFamily, themeColors, isDarkMode}) {
  const styles = StyleSheet.create({
    mainContainer: {
      borderTopLeftRadius: moderateScaleVertical(15),
      borderTopRightRadius: moderateScale(15),
      paddingVertical: moderateScale(10),
      backgroundColor: isDarkMode
        ? MyDarkTheme.colors.background
        : colors.white,
      height: '70%',
    },
    titleText: {
      fontSize: textScale(14),
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      fontFamily: fontFamily.medium,
    },
    horizontaLine: {
      borderBottomWidth: 0.6,
      marginTop: moderateScaleVertical(8),
      borderBottomColor: isDarkMode
        ? colors.whiteOpacity22
        : colors.lightGreyBg,
    },
  });
  return styles;
}

export default React.memo(LaundryAddonModal);
