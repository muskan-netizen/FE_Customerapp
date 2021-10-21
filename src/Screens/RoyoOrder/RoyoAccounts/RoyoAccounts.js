import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';

const RoyoAccounts = (props) => {
  const {navigation} = props;

  const [state, setState] = useState({
    selectedVendor: null,
    vendor_list: [],
    isLoading: false,
    isRefreshing: false,
  });

  const {selectedVendor, vendor_list, isLoading, isRefreshing} = state;
  const {appData, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const {storeSelectedVendor} = useSelector((state) => state?.order);
  useEffect(() => {
    updateState({
      // selectedTab: null,
      selectedVendor: storeSelectedVendor,
      // isLoading: true,
    });
  }, [storeSelectedVendor]);

  useEffect(() => {
    _getListOfVendor();
  }, []);

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: navigationStrings.ROYO_ACCOUNT,
    });
  };
  const _getListOfVendor = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    actions
      ._getListOfVendorOrders(
        `?limit=${1}&page=${1}&selected_vendor_id=${vendordId}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('vendor orders res', res);
        updateState({
          vendor_list: res.data.vendor_list,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
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
        centerTitle={`Accounts | ${selectedVendor?.name} `}
        noLeftIcon
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
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
            <Text style={styles.font16Semibold}>{selectedVendor?.name}</Text>
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
