import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//constants
import imagePath from '../../../constants/imagePath';
//custom components
import GradientButton from '../../../Components/GradientButton';
//styling
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import styleFun from './styles';
//3rd party
import {useDarkMode} from 'react-native-dark-mode';
import Carousel from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import actions from '../../../redux/actions';
import {getImageUrl, showError} from '../../../utils/helperFunctions';
import {isEmpty} from 'lodash';
import FastImage from 'react-native-fast-image';
import Loader from '../../../Components/Loader';
import WrapperContainer from '../../../Components/WrapperContainer';
import RenderHTML from 'react-native-render-html';
import HorizontalLine from '../../../Components/HorizontalLine';
import strings from '../../../constants/lang';
import {tokenConverterPlusCurrencyNumberFormater} from '../../../utils/commonFunction';
import navigationStrings from '../../../navigation/navigationStrings';
import PanoramaView from '@lightbase/react-native-panorama-view';
import {dialCall} from '../../../utils/openNativeApp';

const P2pProductDetail = ({navigation, route}) => {
  const carouselRef = useRef(null);

  const paramData = route?.params;
  const {
    appData,
    currencies,
    languages,
    themeColor,
    themeToggle,
    appStyle,
    themeColors,
  } = useSelector((state) => state?.initBoot);
  const {userData} = useSelector((state) => state?.auth);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences;

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = styleFun({themeColor, themeToggle, fontFamily});
  const [indexSelected, setIndexSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState({});
  const [productAttributeInfo, setProductAttributeInfo] = useState([]);

  useEffect(() => {
    getP2pProductDetail();
  }, []);

  const getP2pProductDetail = () => {
    actions
      .getProductDetailByProductId(
        `/${paramData?.product_id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res, '<===response getProductDetailByProductId');
        setIsLoading(false);
        setProductInfo(res?.data?.products);
        setProductAttributeInfo(res?.data?.product_attribute || []);
      })
      .catch(errorMethod);
  };

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const errorMethod = (error) => {
    console.log(error, '<===error getProductDetailByProductId');
    setIsLoading(false);
    showError(error?.message || error?.error);
  };

  const createRoom = async () => {
    if (!userData?.auth_token) {
      actions.setAppSessionData('on_login');
      return;
    }

    try {
      const apiData = {
        sub_domain: '192.168.101.88', //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: 'user_to_user',
        product_id: String(productInfo?.id),
        vendor_id: String(productInfo?.vendor?.id),
      };

      console.log('sending api data', apiData);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });

      if (!!res?.roomData) {
        onChat(res.roomData);
      }
    } catch (error) {
      console.log('error raised in start chat api', error);
      showError(error?.message);
    }
  };

  const onChat = (item) => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, {data: {...item}});
  };

  const onChatPress = () => {
    if (!!userData?.auth_token) {
      navigation.navigate(navigationStrings.CHAT_ROOM_FOR_VENDOR, {
        service_type: 'p2p',
        vendor_id: productInfo?.vendor?.id,
        product_id: productInfo?.id,
      });
    } else {
      actions.setRedirection('');
      actions.setAppSessionData('on_login');
    }
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <View style={styles.item}>
        {item?.image?.media_type == 4 ? (
          <PanoramaView
            style={{
              height: moderateScale(299),
              width: width,
            }}
            enableTouchTracking={true}
            dimensions={{height: moderateScale(299), width: width}}
            inputType="mono"
            imageUrl={getImageUrl(
              item?.image?.path?.image_fit,
              item?.image?.path?.image_path,
              '400/400',
            )}
          />
        ) : (
          <FastImage
            source={{
              uri: getImageUrl(
                item?.image?.path?.image_fit,
                item?.image?.path?.image_path,
                '400/400',
              ),
            }}
            style={{
              height: moderateScale(299),
              width: width,
            }}
          />
        )}
      </View>
    );
  }, []);

  const renderaAttributeItems = useCallback(
    ({item, index}) => {
      return (
        <View
          style={{
            paddingLeft: moderateScale(10),
            marginTop: moderateScaleVertical(5),
          }}>
          <Text
            style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(12),
              color: isDarkMode ? MyDarkTheme?.colors?.text : colors.black,
            }}>
            {item?.title}:{' '}
            <Text
              style={{
                fontFamily: fontFamily?.regular,
                fontSize: textScale(12),
              }}>
              {item?.value}
            </Text>
          </Text>
        </View>
      );
    },
    [productInfo],
  );

  if (isLoading) {
    return <WrapperContainer isLoading={isLoading} />;
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.statusbarColor,
      }}>
      {!isEmpty(productInfo) && (
        <ScrollView showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
          <View style={{backgroundColor: colors.white}}>
            {!isEmpty(productInfo?.product_media) ? (
              <Carousel
                ref={carouselRef}
                sliderWidth={width}
                sliderHeight={height}
                itemWidth={width}
                data={productInfo?.product_media}
                renderItem={renderItem}
                onSnapToItem={(index) => onSelect(index)}
              />
            ) : (
              <FastImage
                source={{
                  uri: paramData?.product_image,
                }}
                style={{
                  height: moderateScale(250),
                  width: width,
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}>
            <Image source={imagePath.back1} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.heart}>
            <Image source={imagePath.heart2} />
          </TouchableOpacity> */}

          {!isEmpty(productInfo?.product_media) &&
            productInfo?.product_media.length >= 2 && (
              <View
                style={{
                  position: 'absolute',
                  top: moderateScaleVertical(140),
                  zIndex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: width,
                }}>
                <TouchableOpacity
                  onPress={() => carouselRef.current.snapToPrev()}
                  style={{...styles.leftRightBtn, left: moderateScale(15)}}>
                  <Image
                    source={imagePath.backRoyo}
                    style={{
                      tintColor: themeColors.primary_color,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => carouselRef.current.snapToNext()}
                  style={{...styles.leftRightBtn, right: moderateScale(15)}}>
                  <Image
                    source={imagePath.backRoyo}
                    style={{
                      tintColor: themeColors.primary_color,
                      transform: [{rotate: '180deg'}],
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

          <View style={styles.pagination}>
            {!isEmpty(productInfo?.product_media) &&
              productInfo?.product_media?.length >= 2 &&
              productInfo?.product_media?.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.dotStyle,
                      {
                        backgroundColor:
                          index === indexSelected
                            ? colors.orange1
                            : colors.white,
                        width: index === indexSelected ? 20 : 8,
                      },
                    ]}
                  />
                );
              })}
          </View>
          <View style={styles.view}>
            <GradientButton
              btnText={tokenConverterPlusCurrencyNumberFormater(
                Number(productInfo?.variant[0]?.price),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
              btnStyle={styles.btn}
              containerStyle={{alignItems: 'flex-start'}}
              colorsArray={['#FF8D8A', '#FC7049', '#FD312C']}
            />
            <Text style={{...styles.txt1}}>
              {!isEmpty(productInfo?.translation)
                ? productInfo?.translation[0]?.title
                : ''}
            </Text>

            {!isEmpty(productInfo?.translation) && (
              <RenderHTML
                contentWidth={width}
                source={{html: productInfo?.translation[0]?.body_html}}
                tagsStyles={{
                  p: {
                    color: isDarkMode ? colors.white : colors.black,
                    textAlign: 'left',
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(13),
                    opacity: 0.7,
                  },
                }}
              />
            )}
          </View>
          <View style={styles.view1}>
            <Text style={{...styles.txt1, fontSize: textScale(13)}}>
              Posted By
            </Text>
            <View style={styles.view2}>
              <View
                style={{
                  height: moderateScale(70),
                  width: moderateScale(70),

                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: moderateScale(35),
                }}>
                <FastImage
                  source={
                    !!productInfo?.vendor?.logo?.image_fit
                      ? {
                          uri: getImageUrl(
                            productInfo?.vendor?.logo?.image_fit,
                            productInfo?.vendor?.logo?.image_path,
                            '400/400',
                          ),
                        }
                      : imagePath.icProfile
                  }
                  style={{
                    height: moderateScale(60),
                    width: moderateScale(60),
                    borderRadius: moderateScale(30),
                  }}
                />
              </View>
              <Text
                style={{...styles.txt2, marginLeft: 8, color: colors.orange1}}>
                {productInfo?.vendor?.name}
              </Text>
            </View>
            {(appData?.profile?.preferences?.chat_button == 1 ||
              appData?.profile?.preferences?.call_button == 1) && (
              <View style={styles.view3}>
                {appData?.profile?.preferences?.chat_button == 1 && (
                  <GradientButton
                    onPress={() => createRoom()}
                    btnText={'Chat'}
                    isImgWithTxt
                    textImgViewStyle={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    leftImgSrc={imagePath.icChatP2p}
                    textStyle={{...styles.chatBtn, color: colors.orange1}}
                    btnStyle={{...styles.btn1}}
                    source={imagePath.message}
                    containerStyle={{alignItems: 'flex-start'}}
                    colorsArray={
                      isDarkMode
                        ? [
                            MyDarkTheme?.colors?.lightDark,
                            MyDarkTheme?.colors?.lightDark,
                          ]
                        : [colors.white, colors.white]
                    }
                    leftImgStyle={{
                      tintColor: themeColors?.primary_color,
                    }}
                  />
                )}
                {appData?.profile?.preferences?.call_button == 1 && (
                  <GradientButton
                    btnText={'Call'}
                    isImgWithTxt
                    textImgViewStyle={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      if (!userData?.auth_token) {
                        actions.setAppSessionData('on_login');
                        return;
                      }
                      dialCall(productInfo?.vendor?.phone_no);
                    }}
                    leftImgSrc={imagePath.icCallP2p}
                    textStyle={styles.chatBtn}
                    colorsArray={['#FF8D8A', '#FC7049', '#FD312C']}
                    btnStyle={styles.btn2}
                    source={imagePath.call}
                    containerStyle={{alignItems: 'flex-start'}}
                  />
                )}
              </View>
            )}
          </View>
          {!isEmpty(productAttributeInfo) && (
            <View style={{...styles.view1, marginTop: 0}}>
              <Text
                style={{
                  ...styles.txt1,
                  color: isDarkMode ? colors.white : colors.black,
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(13),
                }}>
                Description
              </Text>

              <FlatList
                data={productAttributeInfo}
                renderItem={renderaAttributeItems}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default P2pProductDetail;
