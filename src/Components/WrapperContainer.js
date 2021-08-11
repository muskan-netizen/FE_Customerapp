import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import colors from '../styles/colors';
import CustomAnimatedLoader from './CustomAnimatedLoader';
import Loader from './Loader';
import {defaultLoader} from '../Components/Loaders/AnimatedLoaderFiles';
import {useSelector} from 'react-redux';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';

const WrapperContainer = ({
  children,
  isLoading,
  isLoadingB,
  bgColor = colors.white,
  statusBarColor = colors.white,
  barStyle = 'dark-content',
  withModal = false,
  source = defaultLoader,
  loadercolor,
  loaderHeightWidth,
  extraStyles = {},
}) => {
  const {themeColors} = useSelector((state) => state?.initBoot);

  const customColor = loadercolor ? loadercolor : themeColors.primary_color;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: statusBarColor,
      }}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
      <View style={{backgroundColor: bgColor, flex: 1}}>{children}</View>
      <Loader isLoading={isLoading} withModal={withModal} />
      <CustomAnimatedLoader
        source={source}
        loaderTitle="Loading"
        containerColor={colors.white}
        loadercolor={customColor}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
          {...loaderHeightWidth},
        ]}
        visible={isLoadingB}
      />
    </SafeAreaView>
  );
};

export default WrapperContainer;
