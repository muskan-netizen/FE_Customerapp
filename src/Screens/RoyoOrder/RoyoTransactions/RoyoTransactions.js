import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import MultiScreen from '../../../Components/MultiScreen';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import {FlatList} from 'react-native';
import Header from '../../../Components/Header';

const RoyoTransactions = (props) => {
  const {navigation} = props;

  const [state, setState] = useState({activeIndex: 0});
  const {activeIndex} = state;
  const updateState = (data) =>
    setState((state) => {
      return {...state, ...data};
    });

  const data = [
    imagePath.cabImage,
    imagePath.contactIllustration,
    imagePath.listViewIcon,
    // imagePath.icoTimeOrder,
  ];

  const selectedOrder = (index) => {
    updateState({activeIndex: index});
  };

  const transactions = (data) => {
    return (
      <View style={styles.transactionContainer}>
        <View style={{minWidth: moderateScale(30 + data?.length * 11),...styles.transactionBody}}>
          {data?.map((val, index) => (
            <Image
              key={index}
              source={val}
              style={{
                ...styles.transactionImage,
                zIndex: -index,
                marginLeft: moderateScale(11 * index),
              }}
            />
          ))}
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.font14Medium}>Order #836372</Text>
          <Text style={styles.font12Regular}>9 oct; 11: 11 pm</Text>
        </View>
        <Text style={styles.font16Semibold}>+ $112</Text>
      </View>
    );
  };
  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      
      <Header
        leftIcon={imagePath.backRoyo}
        centerTitle="Transactions | Foodies hub   "
        showImageAlongwithTitle
        imageAlongwithTitle={imagePath.dropdownTriangle}
      />
      <View style={styles.headerBox}>
        <Text style={styles.font28Semibold}>$ 20,890</Text>
        <Text style={styles.font14Semibold}>AMMOUNT RECIEVED</Text>
      </View>

      <View style={styles.transactionTimeBox}>
        <Text style={styles.font14Regular}>Transactions time :</Text>
        <Text style={styles.font14Regular} onPress={() => alert('hi')}>
          {' '}
          Lifetime
        </Text>
        <Image
          style={{alignItems: 'center', tintColor: colors.blackOpacity66}}
          source={imagePath.dropdownTriangle}
        />
      </View>
      <View style={styles.container}>
        <MultiScreen
          screenName={['Completed', 'Pending', 'Refunds', '', '']}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
        />
        {activeIndex == 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={['Cash']}
            renderItem={({item, index}) => transactions(data)}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 1 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={['Cash', 'Card']}
            renderItem={({item, index}) => transactions(data)}
            keyExtractor={(item, key) => key}
          />
        ) : null}
        {activeIndex == 2 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={['Cash']}
            renderItem={({item, index}) => transactions(data)}
            keyExtractor={(item, key) => key}
          />
        ) : null}
      </View>
    </WrapperContainer>
  );
};

export default RoyoTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: moderateScaleVertical(16),
    marginTop: moderateScaleVertical(16),
    paddingBottom: moderateScaleVertical(10),
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScaleVertical(10),
  },
  transactionBody: {
    
    paddingTop: moderateScaleVertical(24),
    justifyContent: 'center',
  },
  transactionImage: {
    backgroundColor: colors.white,
    position: 'absolute',
    width: moderateScale(27),
    height: moderateScale(27),
    borderRadius: moderateScale(27),
  },
  transactionTimeBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: moderateScaleVertical(13),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },
  headerBox: {
    marginTop: moderateScaleVertical(24),
    alignItems: 'center',
    paddingVertical: moderateScaleVertical(30),
    backgroundColor: '#25C7A7',
  },
  font14Medium: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginVertical: moderateScaleVertical(3),
  },
  font14Regular: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.blackOpacity66,
  },
  font12Regular: {
    fontFamily: fontFamily.regular,
    fontSize: textScale(12),
    color: colors.blackOpacity66,
  },
  font16Semibold: {
    color: colors.themeColor2,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
  font28Semibold: {
    fontFamily: fontFamily.semiBold,
    marginBottom: moderateScaleVertical(8),
    fontSize: textScale(28),
    lineHeight: textScale(35),
    color: colors.white,
  },
  font14Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.white,
  },
});
