import React from 'react';
import {Text, View, SafeAreaView, Image} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import stylesFun from './styles';

import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';

export default function ListEmptyOffers({
  isLoading = false,
  containerStyle = {},
  textStyle = {},
  text = strings.NOOFFERS,
}) {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={width - moderateScale(32)}
        height={moderateScaleVertical(209)}
        listSize={5}
        containerStyle={{marginLeft: moderateScale(16)}}
      />
    );
  }
  return (
    <SafeAreaView style={styles.containerStyle}>
      <View>
        <Image source={imagePath.noOffers} />
        <Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>
      </View>
    </SafeAreaView>
  );
}
