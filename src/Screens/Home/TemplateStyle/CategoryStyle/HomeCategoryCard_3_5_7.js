import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { getImageUrl } from '../../../../utils/helperFunctions';
import { getColorSchema } from '../../../../utils/utils';

const HomeCategoryCard3 = ({
  data = {},
  onPress = () => { },
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

  const onLoad = () => { };

  let imgHeight = moderateScale(38);
  let imgWidth = moderateScale(38);
  const tileBackgroundColor = isDarkMode
    ? 'rgba(255,255,255,0.07)'
    : '#EAECF2';
  const titleColor = isDarkMode
    ? MyDarkTheme.colors.text
    : '#1A1A2E';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View
          style={{
            width: '100%',
            height: moderateScale(68),
            borderRadius: moderateScale(10),
            backgroundColor: tileBackgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0,
            borderColor: 'transparent',
            overflow: 'hidden',
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
          }}>
          {isSVG ? (
            <SvgUri height={imgHeight} width={imgWidth} uri={imageURI} />
          ) : (
            <FastImage
              style={{ height: imgHeight, width: imgWidth }}
              source={{
                uri: imageURI,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              resizeMode="contain"
              onLoad={onLoad}
            />
          )}
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: titleColor,
            fontFamily: fontFamily?.medium || fontFamily?.regular,
            fontSize: textScale(10.5),
            marginTop: moderateScaleVertical(6),
            textAlign: 'center',
            paddingHorizontal: moderateScale(2),
          }}>
          {data?.name || (data?.translation && data?.translation[0]?.name)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(HomeCategoryCard3);
