import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import fontFamily from '../styles/fontFamily';
import { moderateScale, textScale } from '../styles/responsiveSize';
const HeaderComponent = props => {
  let {centerTitle = '', leftIcon = '',centerTextStyle, onPressLeft=()=>{}, containerStyle, centerImage} = props;
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', ...containerStyle}}>
      {leftIcon? (
        <TouchableOpacity onPress={onPressLeft} style={{zIndex: 123}}>
          <Image source={leftIcon} />
        </TouchableOpacity>
      ):null}
      <View style={{flex: 1, alignItems: 'center',justifyContent: 'center', marginLeft: -moderateScale(15), flexDirection: 'row'}}>
        <Text style={{fontFamily: fontFamily.bold, fontSize: textScale(15),...centerTextStyle}}>{centerTitle}</Text>
        <Image source={centerImage}/>
      </View>
    </View>
  );
};

export default HeaderComponent;
