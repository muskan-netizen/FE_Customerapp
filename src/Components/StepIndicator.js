import React from 'react';
import {Image} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import imagePath from '../constants/imagePath';

export default function StepIndicators({
  containerStyle = {},
  placeholder = '',
  labels = [],
  currentPosition,
  themeColor,
  stepCount = 4,
}) {
  const thirdIndicatorStyles = {
    stepIndicatorSize: 24,
    currentStepIndicatorSize: 24,
    separatorStrokeWidth: 5,
    currentStepStrokeWidth: 0,
    stepStrokeCurrentColor: '#7eaec4',
    stepStrokeWidth: 4,
    stepStrokeFinishedColor: themeColor.primary_color,
    stepStrokeUnFinishedColor: '#dedede',
    separatorFinishedColor: themeColor.primary_color,
    separatorUnFinishedColor: '#dedede',
    stepIndicatorFinishedColor: themeColor.primary_color,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: themeColor.primary_color,
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: themeColor.primary_color,
  };

  const getSourceImage = ({position, stepStatus}) => {
    if (stepStatus == 'finished') {
      return imagePath.tick;
    }
  };

  const renderStepIndicator = ({position, stepStatus}) => {
    //console.log(position, 'position', stepStatus, 'stepStatus');
    return <Image source={getSourceImage({position, stepStatus})} />;
  };

  return (
    <StepIndicator
      stepCount={stepCount}
      customStyles={thirdIndicatorStyles}
      currentPosition={currentPosition}
      renderStepIndicator={renderStepIndicator}
      labels={labels}
    />
  );
}
