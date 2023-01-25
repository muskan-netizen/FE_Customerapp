import { View, Text, FlatList, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { moderateScale, moderateScaleVertical, textScale, width } from '../../../styles/responsiveSize'

import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import { getColorCodeWithOpactiyNumber } from '../../../utils/helperFunctions';

import imagePath from '../../../constants/imagePath';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import BidAcceptRejectCard from "../../../Components/Loaders/BidAcceptRejectCard";

export default function BidingDriversList() {

    const [allDriversList,setAllDriversList] = useState([{
      id:1,driver_name:'Pavan Sharma',bidAmount:200,expireIn:10,rating:4.5,distance:"2km",address:'CDCL Building Chandigrah'},
      {id:2,driver_name:'Pavan Sharma',bidAmount:10,expireIn:8,rating:4.5,distance:"4km",address:'CDCL Building Chandigrah'},
      {id:3,driver_name:'Pavan Sharma',bidAmount:2200,expireIn:10,rating:4.5,distance:"6km",address:'CDCL Building Chandigrah'}])


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





    const renderDriverListCard = useCallback(({item,index})=>{
        return (
        <BidAcceptRejectCard 
        data={item}  
         bidExpiryDuration={20}
        _onDeclineBid={()=>{}}
         _onAcceptRideBid={()=>{}}  />
        )
    },[allDriversList])



  return (
   <WrapperContainer bgColor={getColorCodeWithOpactiyNumber(colors.textGreyLight.substring(1),20)}>
       <FlatList 
        showsVerticalScrollIndicator={false}
        data={allDriversList}
        renderItem={renderDriverListCard}
        //keyExtractor={awesomeChildListKeyExtractor}
        ListFooterComponent={() => (
          <View style={{marginLeft: moderateScale(16)}} />
        )}
        ListHeaderComponent={() => (
          <View style={{marginRight: moderateScale(16)}} />
        )}
      />
   </WrapperContainer>
  )
}