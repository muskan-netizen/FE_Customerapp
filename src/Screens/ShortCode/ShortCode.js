import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import {getBundleId} from 'react-native-device-info';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import store from '../../redux/store';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {appIds, shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import {getItem} from '../../utils/utils';
import styles from './styles';

import {bottomsUpConfig, iosConfig} from '../../utils/constants/FirebaseConfig';
import firebase from '@react-native-firebase/app';

export default function ShortCode({route, navigation}) {
  const shortCodeParam = route?.params?.shortCodeParam;
  console.log(shortCodeParam, 'shortCodeParam');
  // alert(shortCodeParam)
  const [state, setState] = useState({
    email: '',
    password: '',
    shortCode: null,
    isShortcodePrefilled: true,
    isBtnDisabled: true,
    isLoading: false,
    changeInShortCode: false,
  });
  const {dispatch} = store;

  const {
    shortCode,
    changeInShortCode,
    isBtnDisabled,
    isLoading,
    isShortcodePrefilled,
  } = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );

  const homePageLayout = appStyle?.homePageLayout;

  useEffect(() => {
    (async () => {
      const saveShortCode = await getItem('saveShortCode');
      switch (getBundleId()) {
        case appIds.royoorder:
          // if (shortCodeParam) {
          //   updateState({shortCode: '', isShortcodePrefilled: false});
          // } else {
          //   updateState({shortCode: '245bae', isShortcodePrefilled: true});
          // }

          if (saveShortCode && !shortCodeParam) {
            updateState({
              shortCode: saveShortCode,
              isShortcodePrefilled: true,
            });
          } else {
            // updateState({shortCode: '', isShortcodePrefilled: false});
            if (shortCodeParam) {
              updateState({shortCode: '', isShortcodePrefilled: false});
            } else {
              updateState({shortCode: '245bae', isShortcodePrefilled: true});
            }
          }
          break;
        case appIds.tranzit:
          updateState({
            shortCode: shortCodes.tranzit,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.runrun:
          updateState({
            shortCode: shortCodes.runrun,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hmoobhub:
          updateState({
            shortCode: shortCodes.hmoobhub,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.capcorp:
          updateState({
            shortCode: shortCodes.capcorp,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.masa:
          updateState({shortCode: shortCodes.masa, isShortcodePrefilled: true});
          break;
        case appIds.yogofood:
          updateState({
            shortCode: shortCodes.yogofood,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.spidbi:
          updateState({
            shortCode: shortCodes.spidbi,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.clicktoeat:
          updateState({
            shortCode: shortCodes.clicktoeat,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.instamobile:
          updateState({
            shortCode: shortCodes.instamobile,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bottomsup:
          // if (!firebase.apps.length) {
          //   firebase.initializeApp(bottomsUpConfig);
          // }
          updateState({
            shortCode: shortCodes.bottomsup,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.helpnowrightnow:
          // if (!firebase.apps.length) {
          //   firebase.initializeApp(iosConfig);
          // }
          updateState({
            shortCode: shortCodes.helpnowrightnow,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.africanvillagemarket:
          updateState({
            shortCode: shortCodes.africanvillagemarket,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ufood:
          updateState({
            shortCode: shortCodes.ufood,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.martinionwheels:
          updateState({
            shortCode: shortCodes.martinionwheels,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.blip:
          updateState({
            shortCode: shortCodes.blip,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.cannabus:
          updateState({
            shortCode: shortCodes.cannabus,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.govachow:
          updateState({
            shortCode: shortCodes.govachow,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.bustanfakieh:
          updateState({
            shortCode: shortCodes.bustanfakieh,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.shariff:
          updateState({
            shortCode: shortCodes.shariff,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.gajamove:
          updateState({
            shortCode: shortCodes.gajamove,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.getme:
          updateState({
            shortCode: shortCodes.getme,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.orbit:
          updateState({
            shortCode: shortCodes.orbit,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.carlitoo:
          updateState({
            shortCode: shortCodes.carlitoo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.specialhalal:
          updateState({
            shortCode: shortCodes.specialhalal,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.thehouse:
          updateState({
            shortCode: shortCodes.thehouse,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.tasmeem:
          updateState({
            shortCode: shortCodes.tasmeem,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.klickmat:
          updateState({
            shortCode: shortCodes.klickmat,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.lastminutedress:
          updateState({
            shortCode: shortCodes.lastminutedress,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.rerak:
          updateState({
            shortCode: shortCodes.rerak,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yummiidash:
          updateState({
            shortCode: shortCodes.yummiidash,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yoho:
          updateState({
            shortCode: shortCodes.yoho,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.glamsouq:
          updateState({
            shortCode: shortCodes.glamsouq,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.doctatransportation:
          updateState({
            shortCode: shortCodes.doctatransportation,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.washvalley:
          updateState({
            shortCode: shortCodes.washvalley,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.equamd:
          updateState({
            shortCode: shortCodes.equamd,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hellodeliver:
          updateState({
            shortCode: shortCodes.hellodeliver,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hoganchef:
          updateState({
            shortCode: shortCodes.hoganchef,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.servze:
          updateState({
            shortCode: shortCodes.servze,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.travo:
          updateState({
            shortCode: shortCodes.travo,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.cabdelivr:
          updateState({
            shortCode: shortCodes.cabdelivr,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.drus:
          updateState({
            shortCode: shortCodes.drus,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.yahu:
          updateState({
            shortCode: shortCodes.yahu,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.zuzuclean:
          updateState({
            shortCode: shortCodes.zuzuclean,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.towtrek:
          updateState({
            shortCode: shortCodes.towtrek,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.arenagrub:
          updateState({
            shortCode: shortCodes.arenagrub,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.jet:
          updateState({
            shortCode: shortCodes.jet,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.africanize:
          updateState({
            shortCode: shortCodes.africanize,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.markita:
          updateState({
            shortCode: shortCodes.markita,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.sirvu:
          updateState({
            shortCode: shortCodes.sirvu,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.ublue:
          updateState({
            shortCode: shortCodes.ublue,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.mstechy:
          updateState({
            shortCode: shortCodes.mstechy,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.senshive:
          updateState({
            shortCode: shortCodes.senshive,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.ridemate:
          updateState({
            shortCode: shortCodes.ridemate,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.codiner:
          updateState({
            shortCode: shortCodes.codiner,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.housekeeper:
          updateState({
            shortCode: shortCodes.housekeeper,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.hairstonexpress:
          updateState({
            shortCode: shortCodes.hairstonexpress,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.diamonddashers:
          updateState({
            shortCode: shortCodes.diamonddashers,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.destinationOps:
          updateState({
            shortCode: shortCodes.destinationOps,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.loopwhole:
          updateState({
            shortCode: shortCodes.loopwhole,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.vici:
          updateState({
            shortCode: shortCodes.vici,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.carhop:
          updateState({
            shortCode: shortCodes.carhop,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.yogolift:
          updateState({
            shortCode: shortCodes.yogolift,
            isShortcodePrefilled: true,
          });
          break;

        case appIds.fleety:
          updateState({
            shortCode: shortCodes.fleety,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.flyinghorse:
          updateState({
            shortCode: shortCodes.flyinghorse,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.errand:
          updateState({
            shortCode: shortCodes.errand,
            isShortcodePrefilled: true,
          });
          break;
        case appIds.partnerproject:
          updateState({
            shortCode: shortCodes.partnerproject,
            isShortcodePrefilled: true,
          });
          break;
      }
    })();
  }, []);

  useEffect(() => {
    if (shortCode && isShortcodePrefilled) {
      checkScreen();
    }
  }, [shortCode, isShortcodePrefilled]);

  const checkScreen = () => {
    initApiHit();

    updateState({isShortcodePrefilled: true});
  };

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {});
  };

  //i did added in this fun signup page replace with tabroutes
  const _onSubmitShortCode = () => {
    updateState({isLoading: true});
    setTimeout(() => {
      initApiHit();
    }, 1000);
  };

  const initApiHit = () => {
    actions
      .initApp(
        {},
        {
          code: shortCode,
        },
      )
      .then((res) => {
        updateState({changeInShortCode: false});
        if (getBundleId() == appIds.royoorder) {
          actions.saveShortCode(shortCode);
        }
        homeData(res.data);
      })
      .catch((error) => {
        updateState({
          isLoading: false,
          changeInShortCode: false,
          shortCode: '',
        });
        showError(error?.message || error?.error);
      });
  };

  //get home data

  //Home data

  const homeData = (res) => {
    actions
      .homeData(
        {},
        {
          code: res?.profile?.code,
          currency: res?.currencies?.find((x) => x.is_primary).currency_id,
          language: res?.languages?.find((x) => x.is_primary).language_id,
        },
      )
      .then((res) => {
        updateState({isLoading: false});
        navigation.push(navigationStrings.DRAWER_ROUTES);
      })
      .catch((error) => {
        updateState({isLoading: false});
        navigation.push(navigationStrings.DRAWER_ROUTES);
      });
  };

  const onOtpInput = (code) => {
    (async () => {
      updateState({
        isLoading: true,
        shortCode: code,
        changeInShortCode: true,
      });
      //
    })();
  };

  useEffect(() => {
    (async () => {
      if (changeInShortCode) {
        const saveShortCode = await getItem('saveShortCode');
        if (saveShortCode && shortCode != saveShortCode) {
          actions.userLogout();
          actions.cartItemQty('');
          actions.saveAddress(null);
          actions.saveAllUserAddress([]);
        }
        initApiHit();
      }
    })();
  }, [changeInShortCode]);

  useEffect(() => {
    if (shortCode?.length === 6) {
      updateState({isBtnDisabled: false});
    } else {
      updateState({isBtnDisabled: true});
    }
  }, [shortCode, isLoading]);

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      {isShortcodePrefilled ? (
        <View style={{flex: 1}}></View>
      ) : (
        <View
          style={{
            paddingHorizontal: moderateScale(24),
            flex: 1,
            marginTop: width / 3,
          }}>
          <Image style={{alignSelf: 'center'}} source={imagePath.logo} />
          <View style={{height: moderateScaleVertical(50)}} />
          <Text style={styles.enterShortCode}>{strings.ENTER_SHORT_CODE}</Text>
          <View style={{height: 10}} />
          <Text style={styles.enterShortCode2}>
            {strings.ENTERSHORTCODEBELOW}
          </Text>

          <View style={{height: 10}} />

          {/* <CodeInput
            // ref="codeInputRef2"
            secureTextEntry
            activeColor={colors.blueBackGroudB}
            inactiveColor={colors.blueBackGroudB}
            autoFocus={false}
            inputPosition="center"
            size={moderateScale(40)}
            keyboardType={'default'}
            codeLength={6}
            borderType={'underline'}
            onFulfill={(code) => onOtpInput(code)}
            containerStyle={{margin: 10}}
            codeInputStyle={{
              borderBottomWidth: 1,
              color: colors.blueBackGroudB,
            }}
          /> */}

          <SmoothPinCodeInput
            containerStyle={{alignSelf: 'center'}}
            password
            mask={
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 25,
                  backgroundColor: 'blue',
                }}></View>
            }
            cellSize={width / 10}
            codeLength={6}
            cellSpacing={10}
            editable={true}
            cellStyle={{
              borderBottomWidth: 1,
              borderColor: 'gray',
            }}
            cellStyleFocused={{
              borderColor: 'black',
            }}
            textStyle={{
              fontSize: 24,
              color: colors.textBlue,
            }}
            textStyleFocused={{
              color: colors.textBlue,
            }}
            // autoCapitalize={'none'}
            inputProps={{
              autoCapitalize: 'none',
            }}
            value={shortCode}
            autoFocus={false}
            keyboardType={'default'}
            onTextChange={(shortCode) => updateState({shortCode})}
            onFulfill={(code) => onOtpInput(code)}
          />

          <View style={{height: 20}} />

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <ButtonWithLoader
              // isLoading={isLoading}
              color={colors.black}
              disabled={isBtnDisabled}
              btnStyle={{
                ...styles.guestBtn,
                ...{
                  backgroundColor: isBtnDisabled
                    ? colors.blueBackGroudB
                    : colors.blueBackGroudB,
                },
              }}
              btnTextStyle={{color: colors.textBlue}}
              onPress={_onSubmitShortCode}
              btnText={strings.SUBMIT}
              btnTextStyle={{
                color: isBtnDisabled ? colors.white : colors.white,
              }}
            />
          </View>

          <View style={{height: 20}} />
        </View>
        // </KeyboardAwareScrollView>
      )}

      {/* </ScrollView> */}
    </WrapperContainer>
  );
}
