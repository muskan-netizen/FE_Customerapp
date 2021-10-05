import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import commonStyles from '../styles/commonStyles';
import { moderateScale } from '../styles/responsiveSize';
const HeaderComponent = props => {
  let {centerTitle = '', leftIcon = '', onPressLeft=()=>{}, containerStyle} = props;
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', ...containerStyle}}>
      {leftIcon? (
        <TouchableOpacity onPress={onPressLeft} style={{zIndex: 123}}>
          <Image source={leftIcon} />
        </TouchableOpacity>
      ):null}
      <View style={{flex: 1, alignItems: 'center', marginLeft: -moderateScale(15)}}>
        <Text style={{...commonStyles.font18SemiBold}}>{centerTitle}</Text>
      </View>
    </View>
  );
};

export default HeaderComponent;
