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
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

export default function (Stack) {
  const {appData} = useSelector((state) => state?.initBoot);
  return (
    <>
      <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        component={
          appData?.profile?.code === shortCodes.capcorp
            ? OuterScreen2
            : OuterScreen
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        component={
          appData?.profile?.code === shortCodes.capcorp ? Signup2 : Signup
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={
          appData?.profile?.code === shortCodes.capcorp ? Login2 : Login
        }
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
          appData?.profile?.code === shortCodes.capcorp
            ? ForgotPassword2
            : ForgotPassword
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
