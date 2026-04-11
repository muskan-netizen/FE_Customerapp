import React from 'react';
import navigationStrings from './navigationStrings';

export default function (Stack, appStyle, appData) {
  return (
    <>
      {/* <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        component={OuterScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name={navigationStrings.LOGIN}
        getComponent={() => require('../Screens/Login/Login').default}
        initialParams={{ fromStart: true }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        getComponent={() => require('../Screens/Signup/Signup').default}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.OTP_VERIFICATION}
        getComponent={() =>
          require('../Screens/OtpVerification/OtpVerification').default
        }
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.FORGOT_PASSWORD}
        getComponent={() =>
          require('../Screens/ForgotPassword/ForgotPassword').default
        }
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        getComponent={() =>
          require('../Screens/ResetPassword/ResetPassword').default
        }
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        getComponent={() => require('../Screens/WebLinks/WebLinks').default}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        getComponent={() =>
          require('../Screens/VerifyAccount/VerifyAccount').default
        }
        options={{ headerShown: false }}
      />

    </>
  );
}
