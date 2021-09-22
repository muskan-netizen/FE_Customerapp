import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import colors from '../../styles/colors';

export default function HomeLoader() {
  return (
    <ContentLoader
      foregroundColor={'#DFDFDF'}
      backgroundColor={colors.greyNew}
      width={moderateScale(50)}
      height={moderateScaleVertical(200)}>
      <Rect
        x="10"
        y="17"
        rx="4"
        ry="4"
        width={moderateScale(70)}
        height={moderateScaleVertical(120)}
      />
      <Rect
        x="10"
        y={moderateScaleVertical(148)}
        rx="6"
        ry="6"
        width={moderateScale(70)}
        height={textScale(14)}
      />
      {/* <Rect
        x="10"
        y={moderateScaleVertical(170)}
        rx="3"
        ry="3"
        width={moderateScale(70)}
        height={textScale(7)}
      />
      <Rect
        x={'10'}
        y={moderateScaleVertical(185)}
        rx="3"
        ry="3"
        width={moderateScale(50)}
        height={textScale(9)}
      /> */}
    </ContentLoader>
  );
}

// const styles = StyleSheet.create({});
