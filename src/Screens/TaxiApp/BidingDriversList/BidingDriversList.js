import { View, Text, FlatList, Animated, Image, Easing } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { moderateScale, moderateScaleVertical, textScale, width } from '../../../styles/responsiveSize'

import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import { getColorCodeWithOpactiyNumber, showError } from '../../../utils/helperFunctions';

import imagePath from '../../../constants/imagePath';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import BidAcceptRejectCard from '../../../Components/BidAcceptRejectCard';
import { useIsFocused } from "@react-navigation/native";
import useInterval from '../../../utils/useInterval';
import actions from '../../../redux/actions';
import navigationStrings from '../../../navigation/navigationStrings';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import Header from '../../../Components/Header';
import { isEmpty } from 'lodash';
import { UIActivityIndicator } from 'react-native-indicators';


export default function BidingDriversList(props) {
  const { route, navigation } = props

  const paramData = route?.params?.data?.paramData
  const {
    appData,
    currencies,
    languages,
    themeColors,
    appStyle,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const isFocused = useIsFocused();

  const [allDriverBidesList, setAllDriverBidesList] = useState([])
  const [bidExpiryTime, setBidExpiryTime] = useState(null)

  const [textAnimatedValue, setTextAnimatedValue] = useState(new Animated.Value(0))



  useInterval(
    () => {
      _onOrderBidRideDetails()
    }, isFocused ? 10000 : null
  );


  const _onOrderBidRideDetails = () => {
    const data = {
      order_id: !!paramData?.apiResponseData?.id ? paramData?.apiResponseData?.id : null,
      task_type: 'bid_ride_request'
    }

    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    actions.orderRideBidDetails(data, headerData).then((res) => {
      console.log(res, "response for bid ride");
      setAllDriverBidesList(res?.data?.biddata)
      setBidExpiryTime(res?.data?.bid_expire_time_limit_seconds)

    }).catch((error) => {
      showError(error?.message)
    })
  }


  const _onDeclineRideBid = (id) => {
    const apiData = {
      bid_id: id
    }
    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }
    actions.declineRideBid(apiData, headerData).then((res) => {
      _onOrderBidRideDetails()
    }).catch((error) => {
      showError(error?.message)
    })
  }

  const _onAcceptRideBid = (bidData) => {
    console.log(bidData,"apiDat>>>>");
    const apiData = {
      bid_id: bidData?.id,
    }
    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }
  
    actions.acceptRideForBid(apiData, headerData).then((res) => {
      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        ...paramData,
        bidData: bidData,
        showPaymentModal: true,
      });
    }).catch((error) => {
      showError(error?.message)
    })
   
  }



  const renderDriverListCard = useCallback(({ item, index }) => {
    return (
      <BidAcceptRejectCard
        data={item}
        bidExpiryDuration={bidExpiryTime}
        _onDeclineBid={_onDeclineRideBid}
        _onAcceptRideBid={_onAcceptRideBid}
      />
    )
  }, [allDriverBidesList, bidExpiryTime])



  return (
    <WrapperContainer>
      <Header
        leftIcon={imagePath.backArrow}
        centerTitle={'All Bids'}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
      />
      {isEmpty(allDriverBidesList) &&
        <View style={{
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: getColorCodeWithOpactiyNumber(themeColors?.primary_color.substring(1), 20),
          paddingVertical:moderateScaleVertical(5)
        }}>
          <Text
            style={{
              color: themeColors?.primary_color,
              fontFamily: fontFamily?.bold,
            }}
          >
            Waiting for driver bids
          </Text>
          <UIActivityIndicator size={20} color={themeColors?.primary_color} style={{ flex: 0.2 }} />
        </View>

      }

      <FlatList
        showsVerticalScrollIndicator={false}
        data={allDriverBidesList}
        renderItem={renderDriverListCard}
        ListFooterComponent={() => (
          <View style={{ marginLeft: moderateScale(16) }} />
        )}
        ListHeaderComponent={() => (
          <View style={{ marginRight: moderateScale(16) }} />
        )}
      />
    </WrapperContainer>
  )
}