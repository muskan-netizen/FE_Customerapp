import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize';

const RoyoAccounts = (props) => {
  const {navigation} = props;

  const onShare = async () => {
    try {
      const result = await Share.share({
        title:
          'Share link of your digital store on social media to connect with more customers.',
        url: 'www.google.com',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const data = [
    
    {
      text: 'Transactions',
      image: imagePath.transactionsRoyo,
      //   onPress: () => navigation.navigate(navigationStrings.Transactions),
    },
    
    {
      text: 'Payment Settings',
      image: imagePath.paymentSettinRoyo,
      //   onPress: () => navigation.navigate(navigationStrings.PaymentSettings),
    },
    
    {
      text: 'Signout',
      image: imagePath.signoutRoyo,
      onPress: () => {
        alert('Signout');
      },
    },
  ];

  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <View style={styles.container}>
      {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: moderateScaleVertical(16)
          }}>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: textScale(15),
              textAlign: 'center',
            }}>
            Accounts | Foodies hub {'  '}
          </Text>
          <Image source={imagePath.dropDownNew} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: moderateScale(12),
            backgroundColor: '#24C3A323',
            borderRadius: moderateScale(5),
            marginTop: moderateScaleVertical(16),
          }}>
          <View
            style={{
              marginRight: moderateScale(8),
              backgroundColor: colors.white,
              padding: moderateScale(12),
              alignItems: 'center',
              borderRadius: moderateScale(5),
            }}>
            <Image source={imagePath.cameraRoyo} />
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: textScale(10),
                color: colors.blackOpacity43,
              }}>
              Add Logo
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: fontFamily.medium,
                fontSize: 14,
                marginBottom: moderateScaleVertical(8),
                color: colors.black,
              }}>
              My Shop
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: fontFamily.regular,
                color: colors.blackOpacity66,
              }}>
              CDCL, Sector 28b, Chandigarh
            </Text>
          </View>
          <Image style={{alignSelf: 'center'}} source={imagePath.edit1Royo} />
        </View>
        <View style={{marginTop: moderateScaleVertical(16)}}>
          {data.map((val, index) => {
            return (
              <TouchableOpacity
                onPress={val.onPress}
                key={index}
                style={{
                  flexDirection: 'row',
                  marginVertical: moderateScaleVertical(15),
                  alignItems: 'center'
                }}>
                <Image source={val.image} />
                <Text
                  style={{
                    fontFamily: fontFamily.semiBold,
                    fontSize: textScale(15),
                    color: colors.blackOpacity66,
                    marginLeft: moderateScale(16),
                  }}>
                  {val.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View> */}
      </View>
    </WrapperContainer>
  );
};

export default RoyoAccounts;

const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScaleVertical(24),
    marginHorizontal: moderateScale(16),
  },
});
