import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();

export default function () {
  const { appStyle } = useSelector(state => state?.initBoot);
  const { lastBidInfo, dineInType } = useSelector(state => state?.home);

  const rendervendorScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return require('../Screens/Vendors/Vendors').default;
      case 2:
        return require('../Screens/Vendors/Vendors2').default;
      default:
        return require('../Screens/Vendors/Vendors3').default;
    }
  };

  const renderVendorDetailsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return require('../Screens/VendorDetail/VendorDetail').default;
      case 2:
        return require('../Screens/VendorDetail/VendorDetail2').default;
      default:
        return require('../Screens/VendorDetail/VendorDetail3').default;
    }
  };

  const renderBrandProductsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return require('../Screens/BrandProducts/BrandProducts').default;
      default:
        return require('../Screens/BrandProducts/BrandProducts2').default;
    }
  };

  // const checkSearchProductVendorItemLayout = (layout) => {
  //   switch (appStyle?.homePageLayout) {
  //     case 1:
  //       return SearchProductVendorItem;
  //     case 8:
  //       return SearchProductVendorItem3V2;
  //     case 10:
  //       return SearchProductVendorItem3V2;
  //     default:
  //       return SearchProductVendorItem3V2;
  //   }
  // };

  const getHomeScreen = (homeScreen) => {
    switch (dineInType) {
      case 'pick_drop':
        return require('../Screens/Home/TaxiHomeScreen/TaxiHomeScreen').default;
      case 'delivery':
        return require('../Screens/Home/Home(V2_API)').default;
      default:
        return require('../Screens/Home/Home(V2_API)').default;
    }
  };
  const checkSearchProductVendorItemLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return require('../Screens/SearchProductVendorItem/SearchProductVendorItem').default;
      case 8:
        return require('../Screens/SearchProductVendorItem/SearchProductVendorItem3(V2_API)').default;
      default:
        return require('../Screens/SearchProductVendorItem/SearchProductVendorItem3(V2_API)').default;
    }
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      {!!lastBidInfo && <Stack.Screen
        name={navigationStrings.BIDINGDRIVERSLIST}
        getComponent={() =>
          require('../Screens/TaxiApp/BidingDriversList/BidingDriversList').default
        }
        options={{ headerShown: false }}
      />}
      <Stack.Screen
        name={
          appStyle?.homePageLayout === 4
            ? navigationStrings.TAXIHOMESCREEN
            : navigationStrings.HOME
        }
        getComponent={getHomeScreen}
        options={{ tabBarVisible: false }}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        // component={Addaddress}
        getComponent={() =>
          require('../Screens/TaxiAppNewDesign/Addaddress/Addaddress2').default
        }
      />

      <Stack.Screen
        name={navigationStrings.DELIVERY}
        getComponent={() => require('../Screens/Delivery/Delivery').default}
      />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET}
        getComponent={() =>
          require('../Screens/Supermarket/Supermarket').default
        }
      />
      <Stack.Screen
        name={navigationStrings.VENDOR_DETAIL}
        getComponent={renderVendorDetailsScreens}
      />
      {/* <Stack.Screen : >>>>>> move to Routes
        name={navigationStrings.PRODUCT_LIST}
        component={renderProductListScreen()}
      /> */}

      <Stack.Screen
        name={navigationStrings.ADD_VEHICLE_DETAILS}
        getComponent={() =>
          require('../Screens/AddVehicleDetails/AddVehicleDetails').default
        }
      />

      <Stack.Screen
        name={navigationStrings.TRACKING}
        getComponent={() => require('../Screens/Tracking/Tracking').default}
      />

      <Stack.Screen
        name={navigationStrings.TRACKDETAIL}
        getComponent={() => require('../Screens/TrackDetail/TrackDetail').default}
      />
      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        getComponent={() => require('../Screens/SendProduct/SendProduct').default}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        getComponent={() => require('../Screens/BuyProduct/BuyProduct').default}
      />
      <Stack.Screen
        name={navigationStrings.CONFIRM_DETAILS_BUY}
        getComponent={() =>
          require('../Screens/ConfirmDetails/ConfirmDetailsBuy').default
        }
      />
      {/* <Stack.Screen : >>>>>> move to Routes
        name={navigationStrings.PRODUCTDETAIL}
        component={renderProductDetailsScreens()}
      /> */}
      {/* <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={checkSearchProductVendorItemLayout()}
        options={verticalAnimation}
      /> */}

      <Stack.Screen
        name={navigationStrings.LOCATION}
        getComponent={() => require('../Screens/Location/Location').default}
      />

      <Stack.Screen
        name={navigationStrings.FILTER}
        getComponent={() => require('../Screens/Filter/Filter').default}
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        getComponent={renderBrandProductsScreens}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT}
        getComponent={() => require('../Screens/Payment/Payment').default}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT_SUCCESS}
        getComponent={() =>
          require('../Screens/PaymentSuccess/PaymentSuccess').default
        }
      />

      <Stack.Screen
        name={navigationStrings.SHIPPING_DETAILS}
        getComponent={() =>
          require('../Screens/ShippingDetails/ShippingDetails').default
        }
      />

      <Stack.Screen
        name={navigationStrings.VIEW_ALL_DATA}
        getComponent={() => require('../Screens/ViewAllData/ViewAllData').default}
      />
      <Stack.Screen
        name={navigationStrings.CATEGORY_BRANDS}
        getComponent={() =>
          require('../Screens/CategoryBrands/CategoryBrands').default
        }
      />
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN}
        getComponent={() =>
          dineInType === 'p2p'
            ? require('../Screens/P2pOnDemnadBid/P2pChat/ChatScreen/ChatScreen')
                .default
            : require('../Screens/ChatScreen/ChatScreen').default
        }
        options={{ gestureEnabled: true }}
      />
      <Stack.Screen
        name={navigationStrings.SCROLLABLE_CATEGORY}
        getComponent={() =>
          require('../Screens/ScrollableCategory/ScrollableCategory').default
        }
      />
      <Stack.Screen
        name={navigationStrings.LAUNDRY_AVAILABLE_VENDORS}
        getComponent={() =>
          require('../Screens/LaundryAvailableVendors/LaundryAvailableVendors')
            .default
        }
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM}
        getComponent={() =>
          dineInType === 'p2p'
            ? require('../Screens/P2pOnDemnadBid/P2pChat/ChatRoom/ChatRoom')
                .default
            : require('../Screens/ChatRoom/ChatRoom').default
        }
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
        getComponent={() =>
          require('../Screens/ChatRoom/ChatRoomForVendor').default
        }
      />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        getComponent={() =>
          require('../Screens/Subscriptions/Subscriptions2').default
        }
      />
      <Stack.Screen
        name={navigationStrings.SUBCATEGORY_VENDORS}
        getComponent={() =>
          appStyle?.homePageLayout === 10
            ? require('../Screens/SubCategoryItems/SubCategoryItems').default
            : require('../Screens/SubcategoryVendor/SubcategoryVendor').default
        }
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCTS}
        getComponent={() =>
          require('../Screens/P2pOnDemnadBid/P2pOndemandProducts/P2pOndemandProducts')
            .default
        }
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCT_DETAIL}
        getComponent={() =>
          require(
            '../Screens/P2pOnDemnadBid/P2pOndemandProductDetail/P2pOndemandProductDetail'
          ).default
        }
      />

      <Stack.Screen
        name={navigationStrings.SPOTDEALPRODUCTSANDSELECTEDPRODUCTS}
        getComponent={() =>
          require(
            '../Screens/SpotdealProductAndSelectedProducts/SpotdealProductAndSelectedProducts'
          ).default
        }
      />
      <Stack.Screen
        name={navigationStrings.FREELANCER_SERVICE}
        getComponent={() =>
          require('../Screens/FreelancerService/FreelancerService').default
        }
      />
      <Stack.Screen
        name={navigationStrings.AVAILABLE_TECHNICIANS}
        getComponent={() =>
          require(
            '../Screens/FreelancerService/AvailableTechnicians/AvailableTechnicians'
          ).default
        }
      />
      <Stack.Screen
        name={navigationStrings.TECHNICIAN_PROFILE}
        getComponent={() =>
          require(
            '../Screens/FreelancerService/TechnicianProfile/TechnicianProfile'
          ).default
        }
      />

      <Stack.Screen
        name={navigationStrings.WISHLIST}
        getComponent={() => require('../Screens/Wishlist/Wishlist2').default}
      />
      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        getComponent={() => require('../Screens/WebLinks/WebLinks').default}
      />

      {/* <Stack.Screen
        name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
        component={ViewAllSearchItems}
      /> */}

      <Stack.Screen
        name={navigationStrings.HOME_TEMP_3}
        getComponent={() => require('../Screens/Home/HomeTemplate3').default}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_AGAIN}
        getComponent={() =>
          require('../Screens/EcomTemps/EcomOrderAgain/EcomOrderAgain').default
        }
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_POWER_CONSUMPTION}
        getComponent={() =>
          require('../Screens/ProductPowerConumption/ProductPowerConumption')
            .default
        }
      />
      <Stack.Screen
        name={navigationStrings.CATEGORY}
        getComponent={() => require('../Screens/Category/Category').default}
      />
      {/* car rental stacks  */}

      <Stack.Screen
        name={navigationStrings.CAR_RENTAL_HOME}
        getComponent={() =>
          require('../Screens/CarRentHomeScreen/CarRentHomeScreen').default
        }
      />

      <Stack.Screen
        name={navigationStrings.AVAILABLE_CARS}
        getComponent={() => require('../Screens/AvailableCars/AvailableCars').default}
      />

      <Stack.Screen
        name={navigationStrings.ALL_CATEGORIES}
        getComponent={() =>
          require('../Screens/P2pOnDemnadBid/AllCategories/AllCategories')
            .default
        }
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_PRICE_DETAILS}
        getComponent={() =>
          require(
            '../Screens/P2pOnDemnadBid/ProductPriceDetails/ProductPriceDetails'
          ).default
        }
      />

      {/* <Stack.Screen
        name={navigationStrings.PAYMENT_SCREEN}
        component={P2pPayment}
      /> */}

      <Stack.Screen
        name={navigationStrings.NOTIFICATION}
        getComponent={() =>
          require('../Screens/Notifications/Notifications').default
        }
      />

      <Stack.Screen
        name={navigationStrings.WALLET}
        getComponent={() => require('../Screens/Wallet/Wallet').default}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        getComponent={rendervendorScreen}
      />
      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        getComponent={checkSearchProductVendorItemLayout}
      />
    </Stack.Navigator>
  );
}
