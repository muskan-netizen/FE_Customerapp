import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  TextInput,
  Alert,
} from 'react-native';
import React, {useCallback, useState} from 'react';
//custom components
import WrapperContainer from '../../../Components/WrapperContainer';
import SearchBar2 from '../../../Components/NewComponents/SearchBar2';
import TopBar from '../../../Components/NewComponents/TopBar';
import GradientButton from '../../../Components/GradientButton';
import TopHeader from '../../../Components/NewComponents/TopHeader';
//styling
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import colors from '../../../styles/colors';
import styleFun from './styles';
import {MyDarkTheme} from '../../../styles/theme';
//constants
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
//3rd party
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dark-mode';
import _ from 'lodash';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Header from '../../../Components/Header';
import Modal from 'react-native-modal';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '8694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const P2pProducts = ({route, navigation}) => {
  const {location} = useSelector((state) => state?.home);
  const {themeColor, themeToggle} = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();

  const showModal = true;

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clicked, setClicked] = useState();
  const [products, setProducts] = React.useState(DATA);
  const [items, setItems] = useState([
    {label: 'Abu Dhabi', value: 'Abu Dhabi'},
    {label: 'Banana', value: 'banana'},
  ]);

  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  // const { themeColor } = useSelector((state) => state?.initBoot);
  const styles = styleFun({themeColor, themeToggle});

  const handleChange = (id) => {
    let temp = products.map((product) => {
      if (id === product.id) {
        return {...product, isChecked: !product.isChecked};
      }
      return product;
    });
    setProducts(temp);
  };

  let selected = products.filter((product) => product.isChecked);

  const modalPress = () => {
    setModalVisible(!modalVisible);
  };

  const TextWithCheck = (item) => {
    return (
      <View style={styles.checkView}>
        <Text style={styles.checkText}>Alfa Romeo</Text>
        <TouchableOpacity onPress={() => handleChange(item?.item?.id)}>
          <Image
            source={
              !!item?.item?.isChecked
                ? imagePath.icCheckBoxActive
                : imagePath.icCheckBoxInactive
            }
            style={{tintColor: colors.orange}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.statusbarColor
      }
      isLoading={isLoading}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
        <Header
          leftIcon={imagePath.back2}
          centerTitle={''}
          headerStyle={{
            marginVertical: moderateScaleVertical(8),
          }}
        />

        <SearchBar2
          navigation={navigation}
          placeHolderTxt={'Search here.....'}
          showFilter={true}
          modalPress={modalPress}
        />
        <View style={styles.view2}>
          {DATA.map((item, index) => {
            return (
              <View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate(navigationStrings.LISTDETAIL)
                  }>
                  <ImageBackground
                    style={styles.imgBack}
                    source={imagePath.tiago}
                    imageStyle={{borderRadius: moderateScale(10)}}>
                    <View style={styles.view1}>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Image
                          source={imagePath.facebook}
                          style={styles.btn1}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Image source={imagePath.heart2} style={styles.btn1} />
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                <Text style={styles.txt1}>Range Rover</Text>
                <Text style={styles.txt2}>Range Rover Sport HSE 2014</Text>
                <Text style={styles.txt2}>
                  Reliable Is the 2014 Land Rover Range Rover Sport? The 2014
                  Land Rover.
                </Text>
                <GradientButton
                  btnText={'AED 15000'}
                  btnStyle={styles.btn}
                  containerStyle={{alignItems: 'flex-start'}}
                />
              </View>
            );
          })}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          style={{
            overflow: 'hidden',
            marginHorizontal: 0,
            marginBottom: 0,
          }}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flexGrow: 1}}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TopHeader modalPress={modalPress} />
                <Text style={styles.txt3}>Brands</Text>
                {products.map((item, index) => {
                  return <TextWithCheck item={item} />;
                })}
                <Text style={styles.txt3}>Price</Text>
                <View style={{marginVertical: 18}} />
                <MultiSlider
                  values={[0, 1000]}
                  sliderLength={width / 1.1}
                  min={0}
                  max={1000}
                  step={1}
                  allowOverlap={false}
                  enableLabel
                  selectedStyle={{
                    ...styles.selectedStyle,
                    backgroundColor: colors.blackOpacity66,
                  }}
                  customMarker={() => (
                    <View
                      style={{
                        ...styles.customMarker,
                        backgroundColor: colors.white,
                      }}
                    />
                  )}
                />
                <View style={styles.commonStyle}>
                  <Text style={styles.text4}>AED 100</Text>
                  <Text style={styles.text4}>AED 1000</Text>
                </View>
                <Text style={styles.txt3}>Category</Text>
                {products.map((item, index) => {
                  return <TextWithCheck item={item} />;
                })}
                <Text style={styles.txt3}>Year</Text>

                <Text style={styles.txt3}>Make</Text>
                {products.map((item, index) => {
                  return <TextWithCheck item={item} />;
                })}
                <Text style={styles.txt3}>Model</Text>
                {products.map((item, index) => {
                  return <TextWithCheck item={item} />;
                })}
                <Text style={styles.txt3}>Country</Text>
                {products.map((item, index) => {
                  return <TextWithCheck item={item} />;
                })}
                <Text style={styles.txt3}>City</Text>
                {products.map((item, index) => {
                  return <TextWithCheck item={item} />;
                })}
                <View style={styles.btnStyle}>
                  <GradientButton
                    colorsArray={['#FC7049', '#FD312C']}
                    btnText="APPLY FILTER"
                    containerStyle={{width: '48%'}}
                  />
                  <TouchableOpacity style={styles.rowBtn} activeOpacity={0.7}>
                    <Text style={styles.rowTxt}>CLEAR FILTER</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </ScrollView>
      {!!showModal && (
        <Modal isVisible={false} hasBackdrop={true}>
          <View style={styles.successModal}>
            <Image source={imagePath.check3} />
            <Text style={styles.success}>Car Uploaded Successfully</Text>
            <GradientButton
              btnText={'Ok'}
              containerStyle={{width: '50%'}}
              colorsArray={['#FC7049', '#FD312C']}
            />
          </View>
        </Modal>
      )}
    </WrapperContainer>
  );
};

export default P2pProducts;
