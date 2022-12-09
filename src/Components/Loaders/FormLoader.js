import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {View} from 'react-native';
import colors from '../../styles/colors';
import {width} from '../../styles/responsiveSize';

const FormLoader = () => {
  const MyLoader = () => (
    <ContentLoader
      backgroundColor={colors.greyNew}
      foregroundColor={colors.borderColorD}>
      <Rect x="20" y="17" rx="4" ry="4" width="60" height="18" />
      <Rect x="20" y="40" rx="3" ry="3" width={width / 1.3} height="25" />
    </ContentLoader>
  );
  return (
    <View>
      <MyLoader />
    </View>
  );
};

export default FormLoader;
