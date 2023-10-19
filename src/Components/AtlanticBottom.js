//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import GradientButton from './GradientButton';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import colors from '../styles/colors';
import strings from '../constants/lang';
import fontFamily from '../styles/fontFamily';

// create a component
const AtlanticBottom = ({
  Totalprice,
  total,
  Pricedetails,
  details,
  btnText,
  textStyle,
    onPress,
  buttonLoader=false
}) => {
  return (
    <View style={styles.buttonview}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{fontSize: textScale(16), fontFamily: fontFamily.semiBold}}>
          {Totalprice}
        </Text>
        <Text
          style={{
            fontSize: textScale(16),
            color: colors.atlanticgreen,
            fontFamily: fontFamily.semiBold,
          }}>
          {total}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: moderateScaleVertical(6),
        }}>
        <TouchableOpacity>
          <Text style={{fontSize: textScale(12), color: colors.orangerental}}>
            {Pricedetails}
          </Text>
        </TouchableOpacity>
        <Text style={{fontSize: textScale(12), color: colors.atlanticgreen}}>
          {details}
        </Text>
      </View>
      <GradientButton
        onPress={onPress}
        btnStyle={styles.button}
        btnText={btnText}
        textStyle={textStyle}
        disabled={!!buttonLoader?true:false}
        indicator={buttonLoader}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  buttonview: {
    padding: moderateScale(16),
    // height: moderateScaleVertical(120),
    width: width,
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
  },
  button: {
    height: moderateScaleVertical(40),
    borderRadius: moderateScale(4),
    // marginTop: moderateScaleVertical(16),
  },
});

//make this component available to the app
export default AtlanticBottom;
