import React from 'react';
import {
  ForgotPassword2,
  Location,
  Login3,
  OtpVerification,
  OuterScreen5,
  ResetPassword,
  Signup4,
  VerifyAccount,
  WebLinks,
} from '../Screens';
import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';

import navigationStrings from './navigationStrings';

export default function (Stack, appStyle) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        component={OuterScreen5}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        component={Signup4}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={Login3}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.OTP_VERIFICATION}
        component={OtpVerification}
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

      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{headerShown: false}}
      />
    </>
  );
}
