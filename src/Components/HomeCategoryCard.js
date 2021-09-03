import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';
import {SvgUri} from 'react-native-svg';
import Elevations from 'react-native-elevation';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function HomeCategoryCard({data = {}, onPress = () => {}}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const isDarkMode = useDarkMode();
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const imageURI = getImageUrl(
    data?.icon?.proxy_url,
    data?.icon?.image_path,
    '800/400',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        height: moderateScale(145),
        width: moderateScale(145),
        // shadowOpacity: 0.5,
        marginVertical: moderateScale(5),
        marginHorizontal: moderateScale(2),
        borderRadius: moderateScale(15),
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFCFC',

        ...Elevations[2],
      }}>
      <View style={{flex: 0.4}}>
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(16),
            marginLeft: moderateScale(15),
            marginTop: moderateScale(10),
          }}>
          {data.name}
        </Text>
      </View>
      <View
        style={{
          flex: 0.6,
        }}>
        {isSVG ? (
          <SvgUri
          height={moderateScale(70)}
          width={moderateScale(70)}
            style={{
              marginHorizontal: moderateScale(10),
              position: 'absolute',
              right: 0,
              bottom: 0,
            }}
            uri={imageURI}
          />
        ) : (
          <View
            style={{
              flex: 1,
              borderBottomRightRadius: moderateScale(15),
              borderBottomLeftRadius: moderateScale(15),
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
  );
}

const styles = StyleSheet.create({});
