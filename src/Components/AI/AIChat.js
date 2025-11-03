import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform, ActivityIndicator, Animated, Image, KeyboardAvoidingView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import BorderTextInput from '../BorderTextInput';
import { height, moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize';
import colors from '../../styles/colors';
import actions from '../../redux/actions';
import { useSelector } from 'react-redux';
import { showSuccess, showError, isColorDark } from '../../utils/helperFunctions';
import navigationStrings from '../../navigation/navigationStrings';
import { getValuebyKeyInArray } from '../../utils/commonFunction';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';

// Animated Typing Indicator Component
const TypingIndicator = ({ fontFamily }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation = Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ]);

    animation.start();

    return () => animation.stop();
  }, [dot1, dot2, dot3]);

  const dotStyle = (dot) => ({
    opacity: dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -5],
        }),
      },
    ],
  });

  return (
    <View style={{ paddingHorizontal: moderateScale(16), marginBottom: moderateScale(6) }}>
      <View style={{
        alignSelf: 'flex-start',
        backgroundColor: colors.lightGreyBg,
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Animated.Text style={[{
          fontFamily: fontFamily?.bold,
          fontSize: textScale(16),
          color: colors.textGreyLight,
          marginHorizontal: moderateScale(2),
        }, dotStyle(dot1)]}>
          •
        </Animated.Text>
        <Animated.Text style={[{
          fontFamily: fontFamily?.bold,
          fontSize: textScale(16),
          color: colors.textGreyLight,
          marginHorizontal: moderateScale(2),
        }, dotStyle(dot2)]}>
          •
        </Animated.Text>
        <Animated.Text style={[{
          fontFamily: fontFamily?.bold,
          fontSize: textScale(16),
          color: colors.textGreyLight,
          marginHorizontal: moderateScale(2),
        }, dotStyle(dot3)]}>
          •
        </Animated.Text>
      </View>
    </View>
  );
};

export default function AIChat({
  themeColors,
  fontFamily,
  openLabel = 'AI',
  title = 'Shopping Assistant',
  subtitle = 'Ask me for categories, vendors, products',
  location,
  shortcode,
  appData,
  navigation,
  onOpen,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', from: 'agent', text: `Hi! ${userData?.name || 'Guest'} Let me help you find what you need...` },
  ]);
  const [quickReplies, setQuickReplies] = useState([]);
  const [currentType, setCurrentType] = useState('category');
  const [categoryId, setCategoryId] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const appStyle = useSelector((state) => state?.initBoot?.appStyle);

  const userData = useSelector((state) => state?.auth?.userData);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const languages = useSelector((state) => state?.initBoot?.languages);
  const dineInType = useSelector((state) => state?.home?.dineInType);
  const reloadData = useSelector(state => state?.reloadData?.reloadData);
  const reset = () => {
    setMessages([
      { id: 'm1', from: 'agent', text: `Hi! ${userData?.name || 'Guest'} Let me help you find what you need...` },
    ]);
    setQuickReplies([]);
    setCurrentType('category');
    setCategoryId(null);
    setVendorId(null);
    setSelectedProduct(null);
    // Call initial API to fetch categories again
    callAIAPI({ type: 'category' });
  };

  const open = () => {
    setIsVisible(true);
    onOpen && onOpen();
    // Reset state and fetch categories
    reset();
  };

  const close = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  const append = (msg) => setMessages(prev => [...prev, { id: `m${prev.length + 1}`, ...msg }]);

  // auto-scroll to latest message
  const listRef = useRef(null);
  useEffect(() => {
    // Add a small delay to ensure footer is rendered before scrolling
    const timer = setTimeout(() => {
      if (listRef.current && listRef.current.scrollToEnd) {
        listRef.current.scrollToEnd({ animated: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, isTyping, quickReplies]);

  const callAIAPI = async (payload) => {
    setIsTyping(true);
    try {
      const data = {
        lat: location?.latitude || 30.7333,
        lng: location?.longitude || 76.7794,
        shortcode: shortcode || appData?.profile?.code || '2d98b5',
        ...payload,
      };

      const response = await actions.sendAIChatMessage(data);
      console.log(response, 'response')

      setIsTyping(false);

      if (response?.message) {
        append({ from: 'agent', text: response.message });
      }

      if (response?.quick_replies && Array.isArray(response.quick_replies)) {
        setQuickReplies(response.quick_replies);
      } else {
        setQuickReplies([]);
      }
      if (currentType === 'similar_products') {
        setSelectedProduct(null);
      }
    } catch (error) {
      setIsTyping(false);
      append({ from: 'agent', text: 'Sorry, something went wrong. Please try again.' });
      console.error('AI API Error:', error);
    }
  };

  const onQuickReply = (item) => {
    if (item?.id == 0) {
      append({ from: 'agent', text: 'Thank you for using our AI chatbot. Have a great day!' });
      close();
      // Navigate to cart if navigation is available
      if (navigation) {
        setTimeout(() => {
          navigation.navigate(navigationStrings.CART);
        }, 1000);
      }
      return;
    }
    // Display user selection
    append({ from: 'user', text: item.title || item.label || item.name || 'Selected' });

    // Prepare next API call based on current type
    if (currentType === 'category') {
      setCategoryId(item.id || item.category_id);
      setCurrentType('vendor');
      callAIAPI({
        type: 'vendor',
        category_id: item.id || item.category_id
      });
    } else if (currentType === 'vendor') {
      setVendorId(item.id || item.vendor_id);
      setCurrentType('product');
      callAIAPI({
        type: 'product',
        category_id: categoryId,
        vendor_id: item.id || item.vendor_id
      });
    } else if (currentType === 'product') {
      // Product selected - store product details for add to cart
      setSelectedProduct(item);
      append({ from: 'agent', text: `Great choice! "${item.title || item.name}" is ready to add to your cart.` });
      setQuickReplies([]);
      setCurrentType('similar_products');
    } else if (currentType === 'similar_products') {
      setSelectedProduct(item);
      append({ from: 'agent', text: `Great choice! "${item.title || item.name}" is ready to add to your cart.` });
      setCurrentType('no_next');
      setQuickReplies([]);
    }
  };

  const addToCart = async () => {
    if (!selectedProduct) {
      showError('Please select a product first');
      return;
    }

    setIsAddingToCart(true);

    try {
      const data = {
        sku: selectedProduct.sku,
        quantity: 1,
        product_variant_id: selectedProduct.product_variant_id || selectedProduct.variant_id || selectedProduct.id,
        type: dineInType || 'delivery',
      };

      const response = await actions.addProductsToCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      });

      setIsAddingToCart(false);

      if (response) {
        actions.cartItemQty(response);
        actions.reloadData(!reloadData);
        append({ from: 'agent', text: 'Product added to cart successfully!' });
        if (currentType === 'no_next') {
          close();

          // Navigate to cart if navigation is available
          if (navigation) {
            setTimeout(() => {
              navigation.navigate(navigationStrings.CART);
            }, 1000);
          }
        } else {
          callAIAPI({ type: 'similar_products', product_id: selectedProduct.id, category_id: categoryId, vendor_id: vendorId });
        }

      }
    } catch (error) {
      setIsAddingToCart(false);
      showError(error?.message || error?.error || 'Failed to add product to cart');
      console.error('Add to cart error:', error);
    }
  };

  const onSend = () => {
    const text = (userInput || '').trim();
    if (!text) { return; }
    setUserInput('');
    append({ from: 'user', text });

    // Send user text to API with current context
    const payload = {
      type: currentType,
      message: text,
    };

    if (categoryId) {
      payload.category_id = categoryId;
    }
    if (vendorId) {
      payload.vendor_id = vendorId;
    }

    callAIAPI(payload);
  };

  return (
    <>
      {dineInType === 'delivery' && getValuebyKeyInArray(
        'ai_ordering',
        appData?.profile?.preferences?.additional_preferences,
      ) ? <View style={{ position: 'absolute', bottom: appStyle?.tabBarLayout === 2 ? moderateScaleVertical(120) : moderateScaleVertical(40), right: moderateScale(20) }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={open}
          style={{
            width: moderateScale(56),
            height: moderateScale(56),
            borderRadius: 28,
            backgroundColor: themeColors?.primary_color,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.black,
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Image source={imagePath.AiBot} style={{ width: moderateScale(48), height: moderateScale(48) }} resizeMode='contain' />
          {/* <Text style={{ color: isColorDark(themeColors.primary_color) ? colors.white : colors.black, fontFamily: fontFamily?.bold }}>{openLabel}</Text> */}
        </TouchableOpacity>
      </View> : null}

      <Modal isVisible={isVisible} onBackdropPress={close} style={{ margin: 0, justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <View style={{
            height: '80%',
            backgroundColor: colors.white,
            borderTopLeftRadius: moderateScale(12),
            borderTopRightRadius: moderateScale(12),
            padding: moderateScale(16)
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              // marginVertical: moderateScale(12),
              borderTopLeftRadius: moderateScale(12),
              borderTopRightRadius: moderateScale(12),
              backgroundColor: colors.white,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderColor,
              paddingBottom: moderateScale(12),
              marginBottom: moderateScale(12)
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fontFamily?.bold, fontSize: textScale(16), marginBottom: moderateScale(4) }}>{title}</Text>
                  <Text style={{ fontFamily: fontFamily?.regular, fontSize: textScale(12), color: colors.textGreyLight }}>{subtitle}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={close} style={{ padding: 6 }}>
                <Text style={{ color: themeColors?.primary_color, fontFamily: fontFamily?.medium }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: moderateScale(20) }}
              onContentSizeChange={() => {
                setTimeout(() => {
                  listRef.current?.scrollToEnd?.({ animated: true });
                }, 100);
              }}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: item.from === 'agent' ? 'row' : 'row-reverse',
                  alignItems: 'flex-end',
                  marginVertical: moderateScale(4),
                }}>
                  {/* Avatar */}
                  <View style={{
                    width: moderateScale(28),
                    height: moderateScale(28),
                    borderRadius: moderateScale(14),
                    backgroundColor: item.from === 'agent' ? (themeColors?.primary_color) : colors.backGroundGreyD,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: item?.from === 'agent' ? moderateScale(8) : 0,
                    marginLeft: item?.from === 'agent' ? 0 : moderateScale(8),
                  }}>
                    {item?.from === 'agent' ?
                      <Image source={imagePath.AiBot} style={{ width: moderateScale(28), height: moderateScale(28) }} resizeMode='contain' /> :
                      <Text style={{ color: item.from === 'agent' ? colors.white : colors.black, fontFamily: fontFamily?.bold, fontSize: textScale(10) }}>
                        {userData?.name?.charAt(0) || 'G'}
                      </Text>}
                  </View>

                  {/* Bubble */}
                  <View style={{
                    alignSelf: item.from === 'agent' ? 'flex-start' : 'flex-end',
                    backgroundColor: item.from === 'agent' ? colors.lightGreyBg : (themeColors?.primary_color ? themeColors?.primary_color + '20' : colors.lightGreyBg),
                    paddingHorizontal: moderateScale(12),
                    paddingVertical: moderateScale(8),
                    borderRadius: moderateScale(14),
                    maxWidth: '78%',
                    shadowColor: colors.black,
                    shadowOpacity: 0.06,
                    shadowOffset: { width: 0, height: 1 },
                    shadowRadius: 2,
                  }}>
                    <Text style={{ fontFamily: fontFamily?.regular, fontSize: textScale(12), color: colors.black }}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              )}
              ListFooterComponent={() => (
                <View
                  style={{ paddingHorizontal: moderateScale(12), paddingBottom: moderateScale(20) }}
                  onLayout={() => {
                    // Scroll to end when footer layout changes (e.g., quick replies appear)
                    setTimeout(() => {
                      listRef.current?.scrollToEnd?.({ animated: true });
                    }, 100);
                  }}
                >
                  {quickReplies.length > 0 && !isTyping && (
                    currentType === 'product' || currentType === 'similar_products' ? (
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={quickReplies}
                        keyExtractor={(it, idx) => `${it.id || it.product_variant_id || idx}`}
                        contentContainerStyle={{ paddingVertical: moderateScale(4) }}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => onQuickReply(item)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginRight: moderateScale(10),
                              marginTop: moderateScale(8),
                              backgroundColor: colors.white,
                              borderRadius: moderateScale(12),
                              borderWidth: 1,
                              borderColor: colors.borderColor,
                              shadowColor: colors.black,
                              shadowOpacity: 0.06,
                              shadowOffset: { width: 0, height: 1 },
                              shadowRadius: 3,
                              overflow: 'hidden',
                              padding: moderateScale(8)
                            }}
                          >
                            {!!item?.image && (
                              <Image
                                source={{ uri: item?.image }}
                                style={{ width: moderateScale(32), height: moderateScale(32), backgroundColor: colors.lightGreyBg, marginRight: moderateScale(10), borderRadius: moderateScale(16) }}
                                resizeMode={'cover'}
                              />
                            )}
                            <View>
                              <Text
                                numberOfLines={2}
                                style={{ fontFamily: fontFamily?.medium, fontSize: textScale(12), color: colors.black }}
                              >
                                {item.title || item.name || 'Product'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    ) : (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {quickReplies.map((item, index) => (
                          <TouchableOpacity
                            key={item.id || `quick-${index}`}
                            disabled={isAddingToCart || isTyping}
                            onPress={() => onQuickReply(item)}
                            style={{
                              paddingHorizontal: moderateScale(14),
                              paddingVertical: moderateScale(8),
                              borderRadius: moderateScale(18),
                              backgroundColor: (themeColors?.primary_color ? themeColors?.primary_color + '12' : colors.lightGreyBg),
                              borderWidth: 1,
                              borderColor: themeColors?.primary_color,
                              marginRight: moderateScale(8),
                              marginTop: moderateScale(8),
                              shadowColor: colors.black,
                              shadowOpacity: 0.05,
                              shadowOffset: { width: 0, height: 1 },
                              shadowRadius: 2,
                            }}
                          >
                            <Text style={{ fontFamily: fontFamily?.medium, color: colors.black, fontSize: textScale(12) }}>
                              {item.title || item.label || item.name || 'Option'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )
                  )}

                  {quickReplies.length === 0 && messages.length > 2 && !isTyping && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScale(8) }}>
                      <TouchableOpacity
                        onPress={reset}
                        style={{
                          paddingHorizontal: moderateScale(12),
                          paddingVertical: moderateScale(12),
                          borderRadius: moderateScale(8),
                          borderWidth: 1,
                          borderColor: colors.borderColor,
                          marginRight: moderateScale(10)
                        }}
                      >
                        <Text style={{ fontFamily: fontFamily?.regular, color: colors.black }}>Start Over</Text>
                      </TouchableOpacity>

                      {selectedProduct ? (
                        <TouchableOpacity
                          onPress={addToCart}
                          disabled={isAddingToCart}
                          style={{
                            paddingHorizontal: moderateScale(16),
                            paddingVertical: moderateScale(12),
                            borderRadius: moderateScale(8),
                            backgroundColor: themeColors?.primary_color,
                            opacity: isAddingToCart ? 0.7 : 1,
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isAddingToCart ? (
                            <ActivityIndicator size="small" color={colors.white} />
                          ) : (
                            <Text style={{ color: colors.white, fontFamily: fontFamily?.bold }}>Add to Cart</Text>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={close}
                          style={{
                            paddingHorizontal: moderateScale(12),
                            paddingVertical: moderateScale(8),
                            borderRadius: moderateScale(8),
                            backgroundColor: themeColors?.primary_color
                          }}
                        >
                          <Text style={{ color: colors.white, fontFamily: fontFamily?.medium }}>{strings.DONE}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}
            />

            {isTyping && <TypingIndicator fontFamily={fontFamily} />}

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: moderateScale(12),
              paddingVertical: moderateScale(10),
            }}>
              <BorderTextInput
                value={userInput}
                onChangeText={setUserInput}
                placeholder={'Type a message'}
                returnKeyType={'send'}
                onSubmitEditing={onSend}
                containerStyle={{
                  flex: 1,
                  marginBottom: 0,
                  borderRadius: moderateScale(24),
                  borderColor: colors.borderColor,
                  backgroundColor: colors.lightGreyBg,
                  minHeight: moderateScaleVertical(38),
                }}
              />
              <TouchableOpacity
                onPress={onSend}
                style={{
                  marginLeft: moderateScale(8),
                  backgroundColor: (userInput || '').trim() ? (themeColors?.primary_color) : colors.lightGreyBg,
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScale(10),
                  borderRadius: moderateScale(22),
                  shadowColor: colors.black,
                  shadowOpacity: 0.08,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 3,
                }}
                disabled={!(userInput || '').trim()}
              >
                <Text style={{ color: isColorDark(themeColors?.primary_color) && (userInput || '').trim() ? colors.white : colors.black, fontFamily: fontFamily?.bold }}>
                  {(userInput || '').trim() ? '➤' : 'Send'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}


