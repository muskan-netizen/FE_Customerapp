import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {moderateScale, textScale, width} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';
import {SvgUri} from 'react-native-svg';
import Elevations from 'react-native-elevation';

export default function HomeCategoryCard2({data = {}, onPress = () => {}}) {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const imageURI = getImageUrl(
    data?.icon?.proxy_url,
    data?.icon?.image_path,
    '400/200',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        // shadowOpacity: 0.5,
        width: (width - moderateScale(30)) / 4,
        marginVertical: moderateScale(10),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        {isSVG ? (
          <SvgUri height={50} width={50} uri={imageURI} />
        ) : (
          <View
            style={{
              flex: 1,
              borderBottomRightRadius: moderateScale(15),
              borderBottomLeftRadius: moderateScale(15),
              overflow: 'hidden',
            }}>
            <Image
              style={{height: 82, width: 82}}
              source={{
                uri: imageURI,
              }}
            />
          </View>
        )}
      </View>
      <View style={{flex: 0.4}}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fontFamily.medium,
            fontSize: textScale(10),
            marginTop: moderateScale(10),
          }}>
          {data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
