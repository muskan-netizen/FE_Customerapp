// import stripe from 'tipsi-stripe';
import {
  CardField,
  createToken,
  initStripe,
  StripeProvider,
} from '@stripe/stripe-react-native';
import queryString from 'query-string';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import RazorpayCheckout from 'react-native-razorpay';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import stylesFun from './styles';

export default function AddMoney({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    amount: '',
    data: [
      {id: 0, amount: 300},
      {id: 1, amount: 5000},
      {id: 2, amount: 4500},
    ],
    allAvailAblePaymentMethods: [],
    selectedPaymentMethod: null,
    isLoadingB: false,
    cardInfo: null,
  });
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);

  const {preferences} = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {
    allAvailAblePaymentMethods,
    selectedPaymentMethod,
    amount,
    isLoadingB,
    cardInfo,
  } = state;
  useEffect(() => {
    getListOfPaymentMethod();
  }, []);

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

  //Get list of all payment method
  const getListOfPaymentMethod = () => {
    actions
      .getListOfPaymentMethod(
        '/wallet',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('payment list options', res.data);
        updateState({isLoadingB: false, isRefreshing: false});
        if (res && res?.data) {
          updateState({allAvailAblePaymentMethods: res?.data});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'errorerrorerror');
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  //Onchange Texinput function
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  //Select Amount
  const chooseAmount = (item) => {
    let addedAmount = item.amount;
    updateState({amount: addedAmount});
  };

  //Render all Available amounts
  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => chooseAmount(item)}>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : '#fff',
            flexDirection: 'row',
            paddingVertical: moderateScaleVertical(8),
          }}>
          <View
            style={
              isDarkMode
                ? [
                    styles.selectAmountCon,
                    {
                      backgroundColor: MyDarkTheme.colors.lightDark,
                      borderColor: MyDarkTheme.colors.text,
                    },
                  ]
                : styles.selectAmountCon
            }>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.chooseAddMoney, {color: MyDarkTheme.colors.text}]
                  : styles.chooseAddMoney
              }>
              {`+ ${currencies?.primary_currency?.symbol}`}{' '}
              {currencyNumberFormatter(item.amount)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const _selectPaymentMethod = (item) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == item?.id
        ? updateState({selectedPaymentMethod: null})
        : updateState({selectedPaymentMethod: item});
    }
  };
  const _renderItemPayments = ({item, index}) => {
    return (
      <>
        <TouchableOpacity onPress={() => _selectPaymentMethod(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: moderateScaleVertical(5),
            }}>
            <Image
              source={
                selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                  ? imagePath.radioActive
                  : imagePath.radioInActive
              }
            />
            <Text
              style={[
                styles.title,
                {
                  color:
                    selectedPaymentMethod &&
                    selectedPaymentMethod?.id == item.id
                      ? isDarkMode
                        ? colors.white
                        : colors.blackC
                      : colors.textGreyJ,
                },
              ]}>
              {item?.title_lng ? item?.title_lng : item?.title}
            </Text>
          </View>
        </TouchableOpacity>

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 4 && (
            <View>
              <CardField
                postalCodeEnabled={false}
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
                  // console.log('cardDetails', cardDetails);
                  _onChangeStripeData(cardDetails);
                }}
                onFocus={(focusedField) => {
                  console.log('focusField', focusedField);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          )}

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 17 && (
            <CheckoutPaymentView
              cardTokenized={(e) => {
                if (e.token) {
                  _checkoutPayment(e.token);
                }
              }}
              cardTokenizationFailed={(e) => {
                setTimeout(() => {
                  updateState({isLoadingB: false});
                  showError(strings.INVALID_CARD_DETAILS);
                }, 1000);
              }}
              onPressSubmit={(res) => {
                updateState({
                  isLoadingB: true,
                });
              }}
              btnTitle={strings.ADD}
              isSubmitBtn
              submitBtnStyle={{
                width: '100%',
                height: moderateScale(40),
              }}
            />
          )}
      </>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  const renderRazorPay = () => {
    let options = {
      description: 'Credits towards consultation',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: preferences?.razorpay_api_key, // Your api key
      amount: amount * 100,
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: {color: themeColors.primary_color},
    };

    RazorpayCheckout.open(options)
      .then((res) => {
        if (res?.razorpay_payment_id) {
          const data = {};
          data['amount'] = amount;
          data['transaction_id'] = res?.razorpay_payment_id;
          actions
            .walletCredit(data, {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            })
            .then((res) => {
              Alert.alert('', strings.PAYMENT_SUCCESS, [
                {
                  text: strings.OK,
                  onPress: () => console.log('Okay pressed'),
                },
              ]);
              navigation.navigate(navigationStrings.WALLET);
            })
            .catch(errorMethod);
        }
      })
      .catch(errorMethod);
  };

  console.log(selectedPaymentMethod, 'selectedPaymentMethod');
  const _addMoneyToWallet = () => {
    if (amount == '') {
      showError(strings.PLEASE_ENTER_OR_SELECT_AMOUNT);
    } else if (!selectedPaymentMethod) {
      showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
    } else {
      if (
        selectedPaymentMethod?.off_site == 0 &&
        selectedPaymentMethod?.id == 10
      ) {
        renderRazorPay();
        return;
      }

      if (selectedPaymentMethod?.off_site == 1) {
        _webPayment();
        return;
      } else {
        _offineLinePayment();
      }
    }
  };

  const _checkoutPayment = (token) => {
    if (amount == '') {
      updateState({isLoadingB: false});
      showError(strings.PLEASE_ENTER_OR_SELECT_AMOUNT);
    } else {
      let selectedMethod = selectedPaymentMethod.title.toLowerCase();
      actions
        .openPaymentWebUrl(
          `/${selectedMethod}?amount=${amount}&payment_option_id=${selectedPaymentMethod?.id}&token=${token}&action=wallet`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          console.log(res, 'resresresresres');
          updateState({isLoadingB: false, isRefreshing: false});
          if (res && res?.status == 'Success' && res?.data) {
            Alert.alert('', strings.PAYMENT_SUCCESS, [
              {
                text: strings.OK,
                onPress: () => console.log('Cancel Pressed'),
                // style: 'destructive',
              },
            ]);
            navigation.navigate(navigationStrings.WALLET);
          }
        })
        .catch(errorMethod);
    }
  };

  const _webPayment = () => {
    let selectedMethod = selectedPaymentMethod.code;
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;

    updateState({isLoadingB: true});
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${amount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${selectedPaymentMethod?.id}&action=wallet`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({isLoadingB: false, isRefreshing: false});
        // const URL = queryString.parseUrl(res.data);
        console.log('res==>>>>', res);
        if (res && res?.status == 'Success' && res?.data) {
          let sendingData = {
            id: selectedPaymentMethod.id,
            title: selectedPaymentMethod.title,
            screenName: navigationStrings.WALLET,
            paymentUrl: res.data,
            action: 'wallet',
          };

          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async () => {
    if (cardInfo) {
      updateState({isLoadingB: true});
      await createToken(cardInfo)
        .then((res) => {
          console.log(res, 'res>>STRIpe');
          if (res && res?.token && res.token?.id) {
            let selectedMethod = selectedPaymentMethod.code.toLowerCase();
            // updateState({isLoadingB: true});
            actions
              .openPaymentWebUrl(
                `/${selectedMethod}?amount=${amount}&payment_option_id=${selectedPaymentMethod?.id}&action=wallet&stripe_token=${res.token?.id}`,
                {},
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
              .then((res) => {
                updateState({isLoadingB: false, isRefreshing: false});
                if (res && res?.status == 'Success' && res?.data) {
                  // updateState({allAvailAblePaymentMethods: res?.data});
                  // alert('Payment successfull');
                  Alert.alert('', strings.PAYMENT_SUCCESS, [
                    {
                      text: strings.OK,
                      onPress: () => console.log('Cancel Pressed'),
                      // style: 'destructive',
                    },
                  ]);
                  navigation.navigate(navigationStrings.WALLET);
                }
              })
              .catch(errorMethod);
          } else {
            updateState({isLoadingB: false});
          }
        })
        .catch(errorMethod);
    }
  };

  const mainView = () => {
    return (
      <>
        <View style={{...commonStyles.headerTopLine}} />
        <View
          style={
            isDarkMode
              ? [
                  styles.addMoneyTopCon,
                  {backgroundColor: MyDarkTheme.colors.background},
                ]
              : styles.addMoneyTopCon
          }>
          <View
            style={
              isDarkMode
                ? [
                    styles.inputAmountCon,
                    {backgroundColor: MyDarkTheme.colors.background},
                  ]
                : styles.inputAmountCon
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={
                  isDarkMode
                    ? [styles.inputAmountText, {color: MyDarkTheme.colors.text}]
                    : styles.inputAmountText
                }>
                {strings.INPUT_AMOUNT}
              </Text>
            </View>

            <View
              style={{
                height: moderateScaleVertical(35),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: moderateScale(3),
                borderBottomWidth: 0.5,
                borderBottomColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyJ,
              }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.currencySymble, {color: MyDarkTheme.colors.text}]
                    : styles.currencySymble
                }>
                {currencies?.primary_currency?.symbol}
              </Text>
              <TextInput
                style={
                  isDarkMode
                    ? [
                        styles.addMoneyInputField,
                        {
                          marginLeft: moderateScale(10),
                          width: width - 50,
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.addMoneyInputField
                }
                value={`${state.amount}`}
                onChangeText={_onChangeText('amount')}
                keyboardType={'numeric'}
                placeholder={strings.ENTER_AMOUNT}
                placeholderTextColor={
                  isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ
                }
              />
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <FlatList
              data={state.data}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal
              ItemSeparatorComponent={(data, index) =>
                index == data.length ? null : (
                  <View style={styles.cartItemLine}></View>
                )
              }
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItem}
            />
          </View>
        </View>
        <View style={{...commonStyles.headerTopLine}} />
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={{flex: 1}}>
            <View
              style={{
                marginTop: moderateScaleVertical(20),
                marginHorizontal: moderateScale(20),
              }}>
              {!!(
                allAvailAblePaymentMethods && allAvailAblePaymentMethods.length
              ) && (
                <Text
                  style={
                    isDarkMode
                      ? [styles.debitFrom, {color: MyDarkTheme.colors.text}]
                      : styles.debitFrom
                  }>
                  {strings.DEBIT_FROM}
                </Text>
              )}
              <FlatList
                data={allAvailAblePaymentMethods}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}
                // horizontal
                style={{marginTop: moderateScaleVertical(10)}}
                keyExtractor={(item, index) => String(index)}
                renderItem={_renderItemPayments}
                ListEmptyComponent={() => (
                  <Text style={{textAlign: 'center'}}>
                    {strings.NO_PAYMENT_METHOD}
                  </Text>
                )}
              />
            </View>
          </View>
        </ScrollView>

        {/* botttom add money button */}
        {selectedPaymentMethod == null || selectedPaymentMethod.id != 17 ? (
          <View style={styles.bottomButtonStyle}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={styles.textStyle}
              onPress={_addMoneyToWallet}
              marginTop={moderateScaleVertical(50)}
              marginBottom={moderateScaleVertical(50)}
              btnText={strings.ADD}
            />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      isLoadingB={isLoadingB}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.ADD_MONEY}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: Colors.white}
        }
      />
      {preferences?.stripe_publishable_key ? (
        <StripeProvider
          publishableKey={preferences?.stripe_publishable_key}
          merchantIdentifier="merchant.identifier">
          {mainView()}
        </StripeProvider>
      ) : (
        mainView()
      )}
    </WrapperContainer>
  );
}
