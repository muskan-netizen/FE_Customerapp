import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import commonStylesFun from '../styles/commonStyles';

const TransparentButtonWithTxtAndIcon = ({
  containerStyle,
  icon,
  onPress,
  btnText,
  btnStyle,
  borderRadius,
  marginTop = 0,
  marginBottom = 0,
  textStyle = {},
}) => {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  return (
    <TouchableOpacity
      style={{
        ...commonStyles.buttonRectCommonButton,
        borderWidth: 0,
        marginTop,
        marginBottom,
        ...containerStyle,
      }}
      onPress={onPress}>
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          borderRadius,
          flexDirection: 'row',
          ...btnStyle,
        }}>
        {icon && <Image source={icon} />}
        <Text style={{...commonStyles.buttonTextWhite, ...textStyle}}>
          {btnText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransparentButtonWithTxtAndIcon;
