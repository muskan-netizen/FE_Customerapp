import React from 'react';
import {
  Login,
  OtpVerification,
  OuterScreen,
  ResetPassword,
  Signup,
  VerifyAccount,
  WebLinks
} from '../Screens';
import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
import navigationStrings from './navigationStrings';

export default function (Stack, appStyle, appData) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        component={OuterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.OTP_VERIFICATION}
        component={OtpVerification}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.FORGOT_PASSWORD}
        component={ForgotPassword}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        component={ResetPassword}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{ headerShown: false }}
      />

    </>
  );
}
