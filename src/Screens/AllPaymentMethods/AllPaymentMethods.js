import {CardField, createToken, initStripe} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  showError,
} from '../../utils/helperFunctions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';

export default function AllPaymentMethods({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, appStyle, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const selectedPaymentMethodHandler = route?.params?.data;
  // console.log(selectedPaymentMethodHandler, 'selectedPaymentMethod');

  const [state, setState] = useState({
    isLoading: false,
    // payementMethods: [
    //   {
    //     id: -1,
    //     title: 'Cash on Delivery',
    //     off_site: 2,
    //   },
    // ],
    payementMethods: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    tokenInfo: null,
  });
  const {
    payementMethods,
    cardInfo,
    tokenInfo,
    selectedPaymentMethod,
    isLoading,
  } = state;

  useEffect(() => {
    console.log(selectedPaymentMethod, 'selectedPaymentMethod>>');
  }, [selectedPaymentMethod]);
  //Update states in screen
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {preferences} = appData?.profile;

  useEffect(() => {
    if (
      preferences &&
      preferences?.stripe_publishable_key != '' &&
      preferences?.stripe_publishable_key != null
    ) {
      initStripe({
        publishableKey: preferences?.stripe_publishable_key,
        merchantIdentifier: 'merchant.identifier',
      });
    }
  }, []);

  useEffect(() => {
    updateState({isLoading: true});
    getListOfPaymentMethod();
  }, []);

  //Get list of all payment method
  const getListOfPaymentMethod = () => {
    actions
      .getListOfPaymentMethod(
        '/cart',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>pay');
        updateState({isLoading: false, isRefreshing: false});
        if (res && res?.data) {
          updateState({payementMethods: res?.data});
          // updateState({allAvailAblePaymentMethods: res?.data});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //Change Payment method/ Navigate to payment screen
  const selectPaymentOption = async () => {
    if (selectedPaymentMethod) {
      updateState({isLoading: true});

      if (
        selectedPaymentMethod?.id == 4 &&
        selectedPaymentMethod?.off_site == 0
      ) {
        if (cardInfo) {
          await createToken(cardInfo)
            .then((res) => {
              console.log(res, 'res>>');
              if (res && res?.token && res.token?.id) {
                updateState({isLoading: false});
                navigation.navigate(navigationStrings.CART, {
                  selectedMethod: selectedPaymentMethod,
                  cardInfo: cardInfo,
                  tokenInfo: res.token?.id,
                });
              } else {
                updateState({isLoading: false});
              }
            })
            .catch((err) => {
              updateState({isLoading: false});
              console.log(err, 'err>>');
            });
        } else {
          updateState({isLoading: false});
          showError(
            'You have not added the cart detail for the selected payment method',
          );
        }
      } else {
        setTimeout(() => {
          updateState({isLoading: false});
          navigation.navigate(navigationStrings.CART, {
            selectedMethod: selectedPaymentMethod,
            cardInfo: cardInfo,
          });
        }, 1000);
      }
    } else {
      showError(strings.SELECTPAYEMNTMETHOD);
    }
  };

  //Select/ Update payment method
  const selectPaymentMethod = (data, inx) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == data?.id
        ? updateState({selectedPaymentMethod: null})
        : updateState({selectedPaymentMethod: data});
    }
  };

  //upadte box style on click
  const getAndCheckStyle = (item) => {
    // return {}
    if (selectedPaymentMethod && selectedPaymentMethod.id == item.id) {
      return {
        borderColor: themeColors.primary_color,
      };
    } else {
      return {
        backgroundColor: 'transparent',
        borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      };
    }
  };

  const _renderItemPayments = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => selectPaymentMethod(item, index)}
          key={index}
          style={[
            styles.caseOnDeliveryView,
            //  {...getAndCheckStyle(item)}
          ]}>
          <Image
            source={
              selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          {/* {strings.CASE_ON_DELIVERY} */}
          <Text
            style={
              isDarkMode
                ? [styles.caseOnDeliveryText, {color: MyDarkTheme.colors.text}]
                : styles.caseOnDeliveryText
            }>
            {item?.title_lng ? item?.title_lng : item?.title}
          </Text>
        </TouchableOpacity>
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id != 1
        ) && (
          <CardField
            postalCodeEnabled={true}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 10,
            }}
            onCardChange={(cardDetails) => {
              console.log('cardDetails', cardDetails);
              _onChangeStripeData(cardDetails);
            }}
            onFocus={(focusedField) => {
              console.log('focusField', focusedField);
            }}
            onBlur={() => {
              Keyboard.dismiss();
            }}
          />
        )}
      </>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: {
          brand: cardDetails.brand,
          complete: true,
          expiryMonth: cardDetails?.expiryMonth,
          expiryYear: cardDetails?.expiryYear,
          last4: cardDetails?.last4,
          postalCode: cardDetails?.postalCode,
        },
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
        centerTitle={strings.PAYMENT}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.backgroundGrey}
        }
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: moderateScaleVertical(20)}}>
        <FlatList
          data={payementMethods}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          // horizontal
          style={{marginTop: moderateScaleVertical(10)}}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItemPayments}
          ListEmptyComponent={() =>
            !isLoading && (
              <Text style={{textAlign: 'center'}}>
                {'No Payment method found'}
              </Text>
            )
          }
        />
      </KeyboardAwareScrollView>

      <View
        style={{marginHorizontal: moderateScaleVertical(20), marginBottom: 65}}>
        <GradientButton
          textStyle={styles.textStyle}
          onPress={selectPaymentOption}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(10)}
          btnText={strings.SELECT}
        />
      </View>
    </WrapperContainer>
  );
}
