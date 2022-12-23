import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import imagePath from '../../../constants/imagePath';
import GradientButton from '../../../Components/GradientButton';
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
import PanoramaView from '@lightbase/react-native-panorama-view';
import {isEmpty} from 'lodash';
import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import RenderHTML from 'react-native-render-html';
import Carousel from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import WrapperContainer from '../../../Components/WrapperContainer';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import {tokenConverterPlusCurrencyNumberFormater} from '../../../utils/commonFunction';
import {getImageUrl, showError} from '../../../utils/helperFunctions';
import {dialCall} from '../../../utils/openNativeApp';
import ReactNativeModal from 'react-native-modal';
import Header from '../../../Components/Header';
import GradientView from '../../../Components/GradientView';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const P2pProductDetail = ({navigation, route}) => {
  const carouselRef = useRef(null);
  const snapPoints = useMemo(() => [height], []);
  const bottomSheetModalRef = useRef(null);
  const paramData = route?.params;
  console.log(paramData, 'paramData....paramData');
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
  const [isLoadingChat, setLoadingChat] = useState(false);
  const [selectedPanoImg, setSelectedPanoImg] = useState(null);

  useEffect(() => {
    getP2pProductDetail();
  }, []);

  console.log(selectedPanoImg, 'selectedPanoImg.....selectedPanoImg');

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

        // logic for grouping same attribute ids
        let finalProductAttribut = [];
        var results = res?.data?.product_attribute.reduce(function (
          results,
          org,
        ) {
          (results[org.attribute_id] = results[org.attribute_id] || []).push(
            org,
          );
          return results;
        },
        {});

        setProductAttributeInfo(Object.values(results) || []);
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
    setLoadingChat(true);
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
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
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
          <View>
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
            <TouchableOpacity
              onPress={() => {
                bottomSheetModalRef.current.present();
                setSelectedPanoImg(item);
              }}
              style={{
                position: 'absolute',
                paddingVertical: moderateScaleVertical(5),
                paddingHorizontal: moderateScale(5),
                backgroundColor: themeColors?.primary_color,
                borderRadius: moderateScale(6),
                right: 0,
                bottom: 50,
                zIndex: 1,
              }}>
              <Text
                style={{
                  fontFamily: fontFamily?.regular,
                  color: colors.white,
                  fontSize: textScale(12),
                }}>
                View in 360°
              </Text>
            </TouchableOpacity>
          </View>
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
          <View
            style={{
              flexDirection: 'row',
            }}>
            {item?.map((item, index) => {
              return (
                <Text
                  style={{
                    fontFamily: fontFamily?.regular,
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme?.colors?.text
                      : colors.black,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily?.bold,
                      fontSize: textScale(12),
                      color: isDarkMode
                        ? MyDarkTheme?.colors?.text
                        : colors.black,
                    }}>
                    {index == 0 ? `${item?.title}: ` : ''}
                  </Text>
                  {index == 0 ? '' : ','} {item?.value}
                </Text>
              );
            })}
          </View>
        </View>
      );
    },
    [productInfo],
  );

  const modalContent = () => {
    return (
      <View
        style={{
          height: height,
          backgroundColor: colors.green,
        }}>
        <WrapperContainer>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              zIndex: 1,
            }}
            onPress={() => {
              bottomSheetModalRef.current.close();
              setSelectedPanoImg(null);
            }}>
            <Image source={imagePath.back1} />
          </TouchableOpacity>
          <PanoramaView
            style={{
              flex: 1,
            }}
            enableTouchTracking={true}
            dimensions={{
              height: height - moderateScaleVertical(40),
              width: width,
            }}
            inputType="mono"
            imageUrl={getImageUrl(
              selectedPanoImg?.image?.path?.image_fit,
              selectedPanoImg?.image?.path?.image_path,
              '400/400',
            )}
          />
        </WrapperContainer>
      </View>
    );
  };

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
                source={imagePath.icDefaultImg}
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
            <GradientView
              title={tokenConverterPlusCurrencyNumberFormater(
                Number(productInfo?.variant[0]?.price),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
              colorsArray={['#FF8D8A', '#FC7049', '#FD312C']}
              btnStyle={{
                marginVertical: moderateScaleVertical(6),
              }}
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
                style={{
                  ...styles.txt2,
                  marginLeft: 8,
                  color: colors.orange1,
                }}>
                {productInfo?.vendor?.name}
              </Text>
            </View>
            {(appData?.profile?.preferences?.chat_button == 1 ||
              appData?.profile?.preferences?.call_button == 1) &&
              productInfo?.vendor?.id !== userData?.vendor_id && (
                <View style={styles.view3}>
                  {appData?.profile?.preferences?.chat_button == 1 && (
                    <GradientButton
                      onPress={() => createRoom()}
                      btnText={'Chat'}
                      isImgWithTxt
                      indicator={isLoadingChat}
                      indicatorColor={themeColors?.primary_color}
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
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          handleComponent={() => <></>}>
          {modalContent()}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default P2pProductDetail;
