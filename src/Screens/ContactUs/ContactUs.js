import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFun from './styles';
export default function ContactUs({navigation}) {
  const currentTheme = useSelector((state) => state.appTheme);

  const [state, setState] = useState({
    callingCode: '1',
    cca2: 'US',
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const {message, phoneNumber, cca2, name, email} = state;
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});
  //Update states
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //select the country
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  //validate form
  const isValidData = () => {
    const error = validations({
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      message: message,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };
  //Save user info
  const saveUserInfo = () => {
    const {callingCode} = state;
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    let data = {
      name: name,
      email: email,
      phone_number: '+' + callingCode + phoneNumber,
      message: message,
    };
    actions
      .contactUs(data, {
        code: appData?.profile?.code,
      })
      .then((res) => {})
      .catch((err) => {});
  };
  // Basic information tab
  const basicInfoView = () => {
    return (
      <View
        style={{
          marginTop: moderateScaleVertical(40),
          marginHorizontal: moderateScale(24),
        }}>
        <BorderTextInput
          onChangeText={_onChangeText('name')}
          placeholder={strings.YOUR_NAME}
          value={name}
        />
        <BorderTextInput
          onChangeText={_onChangeText('email')}
          placeholder={strings.YOUR_EMAIL}
          value={email}
        />
        <PhoneNumberInput
          onCountryChange={_onCountryChange}
          placeholder={strings.YOUR_PHONE_NUMBER}
          onChangePhone={(phoneNumber) =>
            updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
          }
          cca2={cca2}
          phoneNumber={phoneNumber}
          callingCode={state.callingCode}
        />
        <View style={{height: moderateScaleVertical(20)}} />
        <BorderTextInput
          onChangeText={_onChangeText('message')}
          placeholder={strings.MESSSAGE_FOR_US}
          value={message}
          containerStyle={{height: moderateScaleVertical(108), padding: 5}}
          // textInputStyle={{height:moderateScaleVertical(108)}}
          textAlignVertical={'top'}
          multiline={true}
        />
        <GradientButton
          textStyle={styles.textStyle}
          onPress={saveUserInfo}
          marginTop={moderateScaleVertical(50)}
          marginBottom={moderateScaleVertical(50)}
          btnText={strings.SUBMIT}
        />
      </View>
    );
  };
  return (
    <WrapperContainer bgColor={colors.white} statusBarColor={colors.white}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={strings.CONTACT_USS}
        headerStyle={{backgroundColor: colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />
      {/* top section user general info */}
      <KeyboardAwareScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={styles.userProfileView}>
            <Image source={imagePath.contactIllustration} />
          </View>
        </View>
        <View style={styles.bottomSection}>{basicInfoView()}</View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
