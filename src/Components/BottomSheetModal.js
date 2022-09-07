import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native-animatable';
import colors from '../styles/colors';
import {height} from '../styles/responsiveSize';

const BottomSheetModal = ({
  children = <></>,
  sheetRef = null,
  snapPoints = [0],
  index = 0,
  enableContentPanningGesture = false,
  handleComponent = () => <></>,
  backgroundStyle = {},
}) => {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      index={index}
      enableContentPanningGesture={enableContentPanningGesture}
      handleComponent={handleComponent}
      detached={true}
      backgroundStyle={{
        backgroundColor: colors.blackOpacity10,
        ...backgroundStyle,
      }}>
      {children}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({});
export default React.memo(BottomSheetModal);
