import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default function CircularProfileLoader({
  backgroundColor = colors.greyNew,
  foregroundColor = '#DFDFDF',
}) {
  return (
    <ContentLoader
      foregroundColor={foregroundColor}
      backgroundColor={backgroundColor}
      width={moderateScale(200)}
      height={moderateScaleVertical(70)}>
      <Circle cx={35} cy={35} r={35} />
      <Rect x="80" y="12" rx="8" ry="8" width="60" height="16" />
      <Rect x="80" y="40" rx="8" ry="8" width="70" height="9" />
      <Rect x="80" y="55" rx="8" ry="8" width="70" height="9" />
    </ContentLoader>
  );
}

const styles = StyleSheet.create({});
