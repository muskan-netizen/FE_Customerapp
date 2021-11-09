import React, {useRef, useState} from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import WrapperContainer from '../../../Components/WrapperContainer';
import Header from '../../../Components/Header';
import {MyDarkTheme} from '../../../styles/theme';
import strings from '../../../constants/lang';
import imagePath from '../../../constants/imagePath';
import {useDarkMode} from 'react-native-dark-mode';
import colors from '../../../styles/colors';
import ScaledImage from 'react-native-scalable-image';
import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from './styles';
import BannerWithText from '../../../Components/BannerWithText';
import GradientButton from '../../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../../Components/ButtonComponent';

export default function OrbitOuterScreen() {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
  });

  const {slider1ActiveSlide, newCategoryData, isVendorColumnList} = state;

  const {
    appData,
    currencies,
    themeColors,
    languages,
    shortCodeStatus,
    appStyle,
  } = useSelector((state) => state?.initBoot);
  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const {bannerRef} = useRef();

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      //   isLoadingB={isLoading}
      //   source={loaderOne}
    >
      <View
        style={{
          ...styles.headerContainer,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {!!(profileInfo && profileInfo?.logo) ? (
            <ScaledImage
              width={width / 4.2}
              height={moderateScaleVertical(80)}
              resizeMode="contain"
              source={
                profileInfo && profileInfo?.logo
                  ? {
                      uri: getImageUrl(
                        profileInfo.logo.image_fit,
                        profileInfo.logo.image_path,
                        '1000/1000',
                      ),
                    }
                  : imagePath.logo
              }
            />
          ) : null}

          <View style={styles.languageContainer}>
            <Text style={styles.selectedLanguageText}>EN</Text>
          </View>
        </View>

        {/* <Modal
          isVisible={isModalVisible}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          onBackdropPress={() => updateState({isModalVisible: false})}>
          <View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => updateState({isModalVisible: false})}>
              <Image source={imagePath.crossC} resizeMode="contain" />
            </TouchableOpacity>

            <View
              style={[
                styles.modalMainViewContainer,
                {
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.background
                    : colors.white,
                },
              ]}>
             

              
              
            </View>
          </View>
        </Modal> */}
      </View>

      <View style={{flex: 0.94}}>
        <View style={{flex: 0.7}}>
          <BannerWithText
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={appData?.banners}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={(index) => updateState({slider1ActiveSlide: index})}
            // onPress={(item) => bannerPress(item)}
            isDarkMode={isDarkMode}
          />
        </View>
        <View
          style={{
            flex: 0.3,
            paddingHorizontal: moderateScale(10),
          }}>
          <View style={{marginVertical: moderateScaleVertical(20)}}>
            <GradientButton btnStyle={{borderRadius: 30}} btnText={'Login'} />
          </View>
          <TransparentButtonWithTxtAndIcon
            btnStyle={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              borderRadius: 30,
              flexDirection: 'row',
              backgroundColor: colors.white,
              borderWidth: 2,
              borderColor: themeColors?.primary_color,
            }}
            containerStyle={{
              backgroundColor: colors.white,
            }}
            textStyle={{color: themeColors?.primary_color}}
            btnText={"I'm new,sign me up"}
          />
        </View>
      </View>
    </WrapperContainer>
  );
}
