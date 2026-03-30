import { appleAuth } from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';

//
export const googleLogin = async () => {
  GoogleSignin.configure({
    scopes: ['profile', 'email'],
  });
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
    }
    const userInfo = await GoogleSignin.signIn();
    console.log('Google sign-in success', userInfo);
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('SIGN_IN_CANCELLED');
      throw error;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('IN_PROGRESS');
      throw error;
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('PLAY_SERVICES_NOT_AVAILABLE');
      throw error;
    } else {
      console.log('GOOGLE_SIGNIN_ERROR', error);
      throw error;
    }
  }
};

export const fbLogin = (resCallback) => {
  LoginManager.logOut();
  return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
    (result) => {
      if (
        result.declinedPermissions &&
        result.declinedPermissions.includes('email')
      ) {
        resCallback({message: 'Email is required'});
      }
      if (result.isCancelled) {
      } else {
        const infoRequest = new GraphRequest(
          '/me?fields=email,name,picture,friends',
          null,
          resCallback,
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      }
    },
    function (error) {},
  );
};

//Apple Login
export const handleAppleLogin = async () => {
  return await new Promise(async (resolve, reject) => {
    const checkAppleSupport = appleAuth.isSupported;
    if (checkAppleSupport) {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      //   /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('checking apple login >>> ', appleAuthRequestResponse);
        // user is authenticated
        resolve(appleAuthRequestResponse);
      } else {
        reject(credentialState);
      }
    } else {
      reject('Apple login is not supproted to this device');
    }
  });
};
