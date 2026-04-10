import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getCurrentLocation } from '../../utils/helperFunctions';
import {
  chekLocationPermission,
} from '../../utils/permissions';
import { getColorSchema } from '../../utils/utils';
import { enableFreeze } from 'react-native-screens';

enableFreeze(true);

export default function Location({ route, navigation }) {
  const { type, data } = route.params;
  const addressType = route?.params?.addressType;
  const paramsDataForEditDropLocation = data;

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const userData = useSelector((state) => state?.auth?.userData);
  const { appData, appStyle, themeColors } = useSelector((state) => state?.initBoot);

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const { profile } = appData;
  const fontFamily = appStyle?.fontSizeData;

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [savedAddress, setSavedAddress] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const searchTimer = useRef(null);
  const inputRef = useRef(null);

  const primaryColor = themeColors?.primary_color || colors.themeColor;
  const bgColor = isDarkMode ? MyDarkTheme.colors.background : colors.white;
  const textColor = isDarkMode ? MyDarkTheme.colors.text : colors.black;
  const subTextColor = isDarkMode ? colors.whiteOpacity77 : colors.textGreyJ;
  const borderColor = isDarkMode ? colors.whiteOpacity22 : '#F0F0F0';
  const inputBg = isDarkMode ? 'rgba(255,255,255,0.08)' : '#F5F5F7';

  useEffect(() => {
    Geocoder.init(
      Platform.OS === 'ios'
        ? profile?.preferences?.map_key_for_ios_app || profile?.preferences?.map_key
        : profile?.preferences?.map_key_for_app || profile?.preferences?.map_key,
      { language: 'en' },
    );
    if (!!userData?.auth_token) {
      fetchSavedAddresses();
    }
  }, []);

  const fetchSavedAddresses = () => {
    actions
      .getAddress({}, { code: appData?.profile?.code })
      .then((res) => {
        if (res?.data?.length > 0) {
          const valid = res.data.filter((v) => !!v?.latitude && !!v?.longitude);
          setSavedAddress(valid);
        }
      })
      .catch(() => {});
  };

  // Debounced geocoder search
  const onChangeSearch = (text) => {
    setSearchText(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!text.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const result = await Geocoder.from(text);
        const mapped = (result?.results || []).map((item) => ({
          id: item.place_id,
          name: item.address_components?.[0]?.long_name || text,
          address: item.formatted_address,
          latitude: item.geometry?.location?.lat,
          longitude: item.geometry?.location?.lng,
        }));
        setSearchResults(mapped);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  // Navigate back with selected location
  const navigateWithLocation = (locData) => {
    Keyboard.dismiss();
    actions.locationData({
      address: locData.address,
      latitude: locData.latitude,
      longitude: locData.longitude,
    });

    const details = {
      formatted_address: locData.address,
      geometry: {
        location: { lat: locData.latitude, lng: locData.longitude },
      },
    };

    if (paramsDataForEditDropLocation) {
      const all = [...paramsDataForEditDropLocation?.orderDropLocations];
      all[paramsDataForEditDropLocation?.editIndex] = {
        ...all[paramsDataForEditDropLocation?.editIndex],
        address: details.formatted_address,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };
      navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
        ...paramsDataForEditDropLocation,
        orderDropLocations: all,
        showLocationUpdateButton: true,
      });
      return;
    }

    if (type === 'Home1') {
      navigation.navigate(navigationStrings.HOME, { details });
    } else if (type === 'Pickup') {
      navigation.navigate(navigationStrings.PICKUPLOCATION, { details, addressType });
    } else if (type === 'vendorRegistration') {
      navigation.navigate(navigationStrings.WEBLINKS, { details });
    } else {
      navigation.goBack();
    }
  };

  // Use device GPS
  const useCurrentLocation = () => {
    setIsLoadingLocation(true);
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              setIsLoadingLocation(false);
              navigateWithLocation({
                address: res?.address,
                latitude: res?.latitude,
                longitude: res?.longitude,
              });
            })
            .catch(() => setIsLoadingLocation(false));
        } else {
          setIsLoadingLocation(false);
        }
      })
      .catch(() => setIsLoadingLocation(false));
  };

  const getSavedAddressLabel = (item) => {
    if (item?.type === 1 || item?.address_type === 1) return strings.HOME;
    if (item?.type === 2 || item?.address_type === 2) return strings.WORK;
    return item?.type_name || 'Other';
  };

  const getSavedAddressIcon = (item) => {
    const t = item?.type || item?.address_type;
    if (t === 1) return imagePath.homeType;
    if (t === 2) return imagePath.workType;
    return imagePath.RecentLocationImage;
  };

  // Render a single location result row
  const renderResultItem = ({ item, isSaved = false }) => (
    <TouchableOpacity
      style={[styles.resultRow, { borderBottomColor: borderColor }]}
      activeOpacity={0.7}
      onPress={() =>
        navigateWithLocation({
          address: item?.address || item?.formatted_address || item?.vicinity,
          latitude: item?.latitude || item?.geometry?.location?.lat,
          longitude: item?.longitude || item?.geometry?.location?.lng,
        })
      }>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isSaved ? `${primaryColor}18` : inputBg },
        ]}>
        <Image
          source={isSaved ? getSavedAddressIcon(item) : imagePath.redLocation}
          style={[
            styles.rowIcon,
            { tintColor: isSaved ? primaryColor : subTextColor },
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={[styles.rowTitle, { color: textColor, fontFamily: fontFamily?.medium }]}>
          {isSaved
            ? getSavedAddressLabel(item)
            : item?.name || item?.address}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.rowSub, { color: subTextColor, fontFamily: fontFamily?.regular }]}>
          {item?.address || item?.formatted_address || item?.vicinity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const hasSearchResults = searchResults.length > 0;
  const showSaved = !searchText.trim() && savedAddress.length > 0;

  return (
    <WrapperContainer
      statusBarColor={bgColor}
      bgColor={bgColor}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}>
            <Image
              source={imagePath.icBackb}
              style={[
                styles.backIcon,
                {
                  tintColor: textColor,
                  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                },
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Search Input */}
          <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
            <Image
              source={imagePath.search1}
              style={[styles.searchIcon, { tintColor: subTextColor }]}
              resizeMode="contain"
            />
            <TextInput
              ref={inputRef}
              autoFocus
              value={searchText}
              onChangeText={onChangeSearch}
              placeholder={strings.SEARCH_LOCATION || 'Search location...'}
              placeholderTextColor={subTextColor}
              style={[
                styles.input,
                {
                  color: textColor,
                  fontFamily: fontFamily?.regular,
                },
              ]}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
            {!!searchText && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setSearchResults([]);
                  inputRef.current?.focus();
                }}
                style={styles.clearBtn}
                activeOpacity={0.7}>
                <Image
                  source={imagePath.closeButton}
                  style={[styles.clearIcon, { tintColor: subTextColor }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            {isSearching && (
              <ActivityIndicator
                size="small"
                color={primaryColor}
                style={{ marginLeft: moderateScale(4) }}
              />
            )}
          </View>
        </View>

        <FlatList
          data={[]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: moderateScaleVertical(32) }}
          ListHeaderComponent={
            <>
              {/* Use Current Location */}
              <TouchableOpacity
                style={[styles.currentLocBtn, { borderBottomColor: borderColor }]}
                activeOpacity={0.7}
                onPress={useCurrentLocation}
                disabled={isLoadingLocation}>
                <View style={[styles.iconCircle, { backgroundColor: `${primaryColor}18` }]}>
                  {isLoadingLocation ? (
                    <ActivityIndicator size="small" color={primaryColor} />
                  ) : (
                    <Image
                      source={imagePath.redLocation}
                      style={[styles.rowIcon, { tintColor: primaryColor }]}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.rowTitle,
                      { color: primaryColor, fontFamily: fontFamily?.semiBold || fontFamily?.bold },
                    ]}>
                    {isLoadingLocation ? 'Detecting...' : 'Use Current Location'}
                  </Text>
                  <Text style={[styles.rowSub, { color: subTextColor, fontFamily: fontFamily?.regular }]}>
                    Enable GPS to auto-detect your location
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Search Results */}
              {hasSearchResults && (
                <View>
                  <Text style={[styles.sectionLabel, { color: subTextColor, fontFamily: fontFamily?.medium }]}>
                    Search Results
                  </Text>
                  {searchResults.map((item) => (
                    <View key={item.id || item.address}>
                      {renderResultItem({ item })}
                    </View>
                  ))}
                </View>
              )}

              {/* No results message */}
              {!!searchText && !isSearching && searchResults.length === 0 && (
                <View style={styles.emptyState}>
                  <Image
                    source={imagePath.noDataFound}
                    style={styles.emptyIcon}
                    resizeMode="contain"
                  />
                  <Text style={[styles.emptyText, { color: subTextColor, fontFamily: fontFamily?.regular }]}>
                    No locations found for "{searchText}"
                  </Text>
                </View>
              )}

              {/* Saved Addresses */}
              {showSaved && (
                <View>
                  <Text style={[styles.sectionLabel, { color: subTextColor, fontFamily: fontFamily?.medium }]}>
                    {strings.SAVED_ADDRESS || 'Saved Addresses'}
                  </Text>
                  {savedAddress.map((item, i) => (
                    <View key={item.id || i}>
                      {renderResultItem({ item, isSaved: true })}
                    </View>
                  ))}
                </View>
              )}
            </>
          }
          renderItem={() => null}
        />
      </View>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScaleVertical(10),
    borderBottomWidth: 0.5,
  },
  backBtn: {
    padding: moderateScale(6),
    marginRight: moderateScale(6),
  },
  backIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    height: moderateScaleVertical(44),
  },
  searchIcon: {
    width: moderateScale(16),
    height: moderateScale(16),
    marginRight: moderateScale(8),
  },
  input: {
    flex: 1,
    fontSize: textScale(13),
    paddingVertical: 0,
  },
  clearBtn: {
    padding: moderateScale(4),
    marginLeft: moderateScale(4),
  },
  clearIcon: {
    width: moderateScale(14),
    height: moderateScale(14),
  },
  currentLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(14),
    borderBottomWidth: 0.5,
  },
  sectionLabel: {
    fontSize: textScale(11),
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScaleVertical(16),
    paddingBottom: moderateScaleVertical(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(12),
    borderBottomWidth: 0.5,
  },
  iconCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  rowIcon: {
    width: moderateScale(16),
    height: moderateScale(16),
  },
  rowTitle: {
    fontSize: textScale(13),
    marginBottom: moderateScaleVertical(2),
  },
  rowSub: {
    fontSize: textScale(11),
    lineHeight: moderateScaleVertical(16),
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: moderateScaleVertical(40),
    paddingHorizontal: moderateScale(32),
  },
  emptyIcon: {
    width: moderateScale(80),
    height: moderateScale(80),
    marginBottom: moderateScaleVertical(12),
    opacity: 0.4,
  },
  emptyText: {
    fontSize: textScale(13),
    textAlign: 'center',
    lineHeight: moderateScaleVertical(20),
  },
});
