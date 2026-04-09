import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { appIds } from '../../../../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../../../../utils/helperFunctions';
import { getColorSchema } from '../../../../utils/utils';

const HomeCategoryCard3 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => { };

  let imgHeight =
    appStyle?.homePageLayout === 5
      ? moderateScale(60)
      : getBundleId() === appIds.onTheWheel || getBundleId() === appIds.ping
        ? moderateScale(62)
        : moderateScale(60);
  let imgWidth =
    appStyle?.homePageLayout === 5
      ? moderateScale(60)
      : getBundleId() === appIds.onTheWheel || getBundleId() === appIds.ping
        ? moderateScale(62)
        : moderateScale(60);
  let imgRadius = moderateScale(18);
  const tileBackgroundColor = isDarkMode
    ? 'rgba(255,255,255,0.08)'
    : '#EEF1F4';
  const titleColor = isDarkMode
    ? MyDarkTheme.colors.text
    : '#111827';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: '100%',
        paddingHorizontal: 0,
        marginVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            height: moderateScale(84),
            borderRadius: moderateScale(10),
            backgroundColor: tileBackgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          {isSVG ? (
            <SvgUri
              height={imgHeight}
              width={imgWidth}
              uri={imageURI}
              style={{}}
            />
          ) : (
            <View>
              <FastImage
                style={{
                  height: imgHeight,
                  width: imgWidth,
                  borderRadius: imgRadius,
                }}
                source={{
                  uri: imageURI,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                resizeMode="contain"
                onLoad={onLoad}
              />
            </View>
          )}
        </View>
        <View
          style={{
            height: moderateScaleVertical(24),
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: moderateScaleVertical(8),
          }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: titleColor,
              fontFamily: fontFamily?.medium || fontFamily?.regular,
              fontSize: textScale(10.6),
              lineHeight: moderateScaleVertical(13),
              textAlign: 'center',
              paddingHorizontal: moderateScale(2),
            }}>
            {data?.name || (data?.translation && data?.translation[0]?.name)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(HomeCategoryCard3);
