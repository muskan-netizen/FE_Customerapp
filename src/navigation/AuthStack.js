import React from 'react';
import {getBundleId} from 'react-native-device-info';
import {
  Location,
  Login,
  OtpVerification,
  OuterScreen,
  Signup,
  VerifyAccount,
  ResetPassword,
  OuterScreen2,
  Signup2,
} from '../Screens';
import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
import Login2 from '../Screens/Login/Login2';
import ShortCode from '../Screens/ShortCode/ShortCode';
import {appIds} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        component={
          getBundleId() === appIds.capcorp ? OuterScreen2 : OuterScreen
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        component={getBundleId() === appIds.capcorp ? Signup2 : Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={getBundleId() === appIds.capcorp ? Login2 : Login}
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
        component={ForgotPassword}
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
