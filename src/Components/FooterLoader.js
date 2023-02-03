import React from 'react';
import colors from '../styles/colors';
import {ActivityIndicator} from 'react-native-paper';

const FooterLoader = ({style = {
  size:30,
  color:colors.themeColor
}}) => {
  return (
    <ActivityIndicator size={style?.size} color={style?.color}/>
  );
};

export default React.memo(FooterLoader);
