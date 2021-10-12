import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';

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
      onPress: () => navigation.navigate(navigationStrings.ROYO_TRANSACTIONS),
    },

    {
      text: 'Payment Settings',
      image: imagePath.paymentSettinRoyo,
      onPress: () =>
        navigation.navigate(navigationStrings.ROYO_PAYMENT_SETTINGS),
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
      <Header
      headerStyle={{marginVertical: moderateScaleVertical(16)}}
        centerTitle="Accounts | Foodies hub  "
        noLeftIcon
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.cameraBox}>
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
            <Text style={styles.font16Semibold}>Foodies's Hub</Text>
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
                  alignItems: 'center',
                }}>
                <Image source={val.image} />
                <Text style={styles.font15Semibold}>{val.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </WrapperContainer>
  );
};

export default RoyoAccounts;

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScaleVertical(24),
    marginHorizontal: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    padding: moderateScale(12),
    backgroundColor: '#24C3A323',
    borderRadius: moderateScale(5),
    // marginTop: moderateScaleVertical(16),
  },
  cameraBox: {
    marginRight: moderateScale(8),
    backgroundColor: colors.white,
    padding: moderateScale(12),
    alignItems: 'center',
    borderRadius: moderateScale(5),
  },
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    marginBottom: moderateScaleVertical(8),
    color: colors.black,
  },
  font15Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(15),
    color: colors.blackOpacity66,
    marginLeft: moderateScale(16),
  },
});
