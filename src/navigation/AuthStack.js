import React from 'react';
import {useSelector} from 'react-redux';
import {
  ForgotPassword2,
  Location,
  Login,
  OtpVerification,
  OuterScreen,
  OuterScreen2,
  ResetPassword,
  Signup,
  Signup2,
  VerifyAccount,
} from '../Screens';
import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
import Login2 from '../Screens/Login/Login2';
import LoginLayoutFour from '../Screens/Login/LoginLayoutFour';
import OuterScreen3 from '../Screens/OuterScreen/OuterScreen3';
import SignupTemplateThree from '../Screens/Signup/SignupTemplateThree';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

export default function (Stack) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);
  console.log(appStyle)
  return (
    <>
      <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        // component={appStyle?.homePageLayout === 2 ? OuterScreen2 : OuterScreen}
        component={OuterScreen3}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        // component={appStyle?.homePageLayout === 2 ? Signup2 : Signup}
        component={SignupTemplateThree}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        // component={appStyle?.homePageLayout === 2 ? Login2 : Login}
        component={LoginLayoutFour}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.OTP_VERIFICATION}
        component={OtpVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.FORGOT_PASSWORD}
        component={
          appStyle?.homePageLayout === 2 ? ForgotPassword2 : ForgotPassword
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        component={ResetPassword}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name={navigationStrings.SHORT_CODE}
        component={ShortCode}
        options={{headerShown: false}}
      /> */}
    </>
  );
}
