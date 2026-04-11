import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../../../../styles/colors';
import { moderateScale, textScale, width } from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { getImageUrl } from '../../../../utils/helperFunctions';
import { getColorSchema } from '../../../../utils/utils';

const HomeCategoryCard4 = ({data = {}, onPress = () => {}}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const imageURI = getImageUrl(
    data?.icon?.proxy_url,
    data?.icon?.image_path,
    '800/400',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <View
      style={{
        width: width / 4,
        marginBottom: moderateScale(10),
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          height: moderateScale(75),
          width: moderateScale(75),
          marginVertical: moderateScale(5),
          marginHorizontal: moderateScale(2),
          borderRadius: moderateScale(16),
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: moderateScale(64),
            width: moderateScale(64),
            borderRadius: moderateScale(18),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : '#F5F7FB',
            overflow: 'hidden',
          }}>
          {isSVG ? (
            <SvgUri
              height={moderateScale(45)}
              width={moderateScale(45)}
              style={{
                marginHorizontal: moderateScale(5),
              }}
              uri={imageURI}
            />
          ) : (
            <View
              style={{
                height: moderateScale(50),
                width: moderateScale(50),
                // borderRadius: 15,
                overflow: 'hidden',
              }}>
              <Image
                style={{flex: 1}}
                source={{
                  uri: imageURI,
                }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={{}}>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
            // marginLeft: moderateScale(15),
            marginTop: moderateScale(5),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {data.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
export default React.memo(HomeCategoryCard4);
