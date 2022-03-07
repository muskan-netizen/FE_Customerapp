// export const API_BASE_URL = 'https://sales.royoorders.com/api/v1';
// export const API_BASE_URL = 'https://hmc.royoorders.com/api/v1';
// export const API_BASE_URL = 'https://sales.royoorders.com/api/v1'; //sales demo
// export const API_BASE_URL = 'https://api.rostaging.com/api/v1';
// export const API_BASE_URL = 'https://9303-112-196-88-218.ngrok.io/api/v1';
// export const API_BASE_URL = 'https://releezer.shop/api/v1';
// export const API_BASE_URL = 'https://api.focushires.com/api/v1';
// export const API_BASE_URL = 'http://192.168.97.160:9090/api/v1';//inderjit

// export const API_BASE_URL = 'https://961a-112-196-88-218.ngrok.io/api/v1'; // preet
// export const API_BASE_URL = 'http://192.168.97.123:8020/api/v1'; // sujata
// export const API_BASE_URL = 'http://192.168.96.20:8005/api/v1'; //dinesh sir
// export const API_BASE_URL = 'http://192.168.97.160:9090/api/v1'; //inderjeet sir
// export const API_BASE_URL = 'http://192.168.103.186:8005/api/v1'; // harbans
// export const API_BASE_URL = 'https://876c-114-134-24-242.ngrok.io/api/v1'; // gourav sir
// export const API_BASE_URL = 'http://192.168.96.127:8005/api/v1';
// export const API_BASE_URL = 'https://f6da-114-134-24-242.ngrok.io/api/v1';

//export const API_BASE_URL = 'https://yummiidash.com/api/v1';

// export const API_BASE_URL = 'http://192.168.103.81:8005/api/v1';
// export const API_BASE_URL = 'http://192.168.96.23:8005/api/v1';
// export const API_BASE_URL = 'http://192.168.100.198:8020/api/v1';
// export const API_BASE_URL = 'https://b724-103-72-170-243.ngrok.io/api/v1';
// export const API_BASE_URL = 'https://zuzu.alerthire.com/api/v1';
// export const API_BASE_URL = 'https://click-eat.com/api/v1';
// export const API_BASE_URL = 'https://tranzit.app/api/v1';
// export const API_BASE_URL = 'https://pinkjettaxi.com/api/v1';
// export const API_BASE_URL = 'https://snabbhem.se/api/v1';
//export const API_BASE_URL = 'https://codiner.com/api/v1';
// export const API_BASE_URL = 'https://somame-247.com/api/v1';
// export const API_BASE_URL = 'https://order.africanize.co/api/v1';
// export const API_BASE_URL = 'https://destinationops.com/api/v1';
// export const API_BASE_URL = 'https://bustanfakieh.com/api/v1';
// export const API_BASE_URL = 'https://cabdeliv.com/api/v1';
// export const API_BASE_URL = 'https://helpnowrightnow.com/api/v1';
//export const API_BASE_URL = 'https://orderchekout.com/api/v1';
// export const API_BASE_URL = 'https://hairstonexpressgo.com/api/v1';
// export const API_BASE_URL = 'https://helpnowrightnow.com/api/v1';
// export const API_BASE_URL = 'https://ufood.ca/api/v1';
// export const API_BASE_URL = 'https://app.vici.la/api/v1';
// export const API_BASE_URL = 'https://blipdelivery.com/api/v1';
// export const API_BASE_URL = 'https://africanvillage.market/api/v1';
// export const API_BASE_URL = 'https://govachow.com/api/v1';
// export const API_BASE_URL = 'https://order.drivereeshops.com/api/v1';
// export const API_BASE_URL = 'https://tranzit.app/api/v1';
// export const API_BASE_URL = 'https://orders.halalhmc.org/api/v1';
// export const API_BASE_URL = 'https://tranzonline.com/api/v1';
// export const API_BASE_URL = 'https://hellodeliver.in/api/v1';
// export const API_BASE_URL = 'https://yohopartner.com/api/v1'
// export const API_BASE_URL = 'https://swiftandvalu.com/api/v1';
// export const API_BASE_URL = 'https://baytukom.royoorders.com/api/v1';
//export const API_BASE_URL = 'https://marketplace.verofax.com/api/v1';
// export const API_BASE_URL = 'https://agrionline.ph/api/v1';
// export const API_BASE_URL = 'https://marketplace.verofax.com/api/v1';
// export const API_BASE_URL = 'https://order.loopwhole.ca/api/v1';
// export const API_BASE_URL = 'https://elcheregio.mx/api/v1';
export const API_BASE_URL = 'https://donepacked.com/api/v1';
// export const API_BASE_URL = 'https://cannabusxpress.com/api/v1';
// export const API_BASE_URL = 'https://order-dev.taquick.com/api/v1';
// export const API_BASE_URL = 'https://yeboy.mx/api/v1';
// export const API_BASE_URL = 'https://nadeliver.com/api/v1';
// export const API_BASE_URL = 'https://order-dev.taquick.com/api/v1';
// export const API_BASE_URL = 'https://ritenowdelivery.com/api/v1';
// export const API_BASE_URL = 'https://drusdeliveries.com/api/v1';
// export const API_BASE_URL = 'https://empirehub.com/api/v1';
// export const API_BASE_URL = 'https://rxnowweb.com/api/v1';
// export const API_BASE_URL = 'https://36kel.com.ph/api/v1';

export const getApiUrl = (endpoint) => API_BASE_URL + endpoint;
export const SEND_OTP = getApiUrl('/auth/sendOtp');
export const LOGIN_BY_USERNAME = getApiUrl('/auth/loginViaUsername');
export const VENDOR_LOGIN_BY_USERNAME = getApiUrl('/auth/login');
export const PHONE_LOGIN_OTP = getApiUrl('/auth/verify/phoneLoginOtp');
export const LOGIN_API = getApiUrl('/auth/login');
export const SIGN_UP_API = getApiUrl('/auth/register');
export const FORGOT_API = getApiUrl('/auth/forgotPassword');
export const APP_INITIAL_SETTINGS = getApiUrl('/header');
export const HOMEPAGE_DATA_URL = getApiUrl('/homepage');
export const GET_DATA_BY_CATEGORY = getApiUrl('/category');
export const GET_PRODUCT_DATA_BY_PRODUCTID = getApiUrl('/product');
export const GET_PRODUCT_DATA_BY_VENDORID = getApiUrl('/vendor');
export const GET_PRODUTC_DATA_BY_BRANDID = getApiUrl('/brand');
export const CHECK_VENDORS = getApiUrl('/checkIsolateSingleVendor');
export const GET_WISHLIST_PRODUCT = getApiUrl('/wishlists');
export const ADD_REMOVE_TO_WISHLIST = getApiUrl('/wishlist/update');
export const PROFILE_BASIC_INFO = getApiUrl('/update/profile');
export const UPLOAD_PROFILE_IMAGE = getApiUrl('/update/image');
export const CHANGE_PASSWORD = getApiUrl('/changePassword');
export const CONTACT_US = getApiUrl('/contact-us');
export const VERIFY_ACCOUNT = getApiUrl('/auth/verifyAccount');
export const RESEND_OTP = getApiUrl('/auth/sendToken');
export const INCREASE_ITEM_QNT = getApiUrl('/cart/increaseItem');
export const DECREASE_ITEM_QNT = getApiUrl('/cart/decreaseItem');
export const GET_DATA_BY_CATEGORY_FILTERS = getApiUrl('/category/filters');
export const GET_DATA_BY_VENDOR_FILTERS = getApiUrl('/vendor/filters');
export const GET_PRODUCT_DATA_BASED_VARIANTS = getApiUrl('/productByVariant');
export const GET_PRODUCT_TAGS = getApiUrl('/getAllProductTags');
export const GET_BRANDPRODUCTS_DATA_BASED_VARIANTS =
  getApiUrl('/brand/filters');
export const MY_WALLET = getApiUrl('/myWallet');
export const SOCAIL_LOGIN_API = getApiUrl('/social/login');
export const ADD_PRODUCT_TO_CART = getApiUrl('/cart/add');
export const GET_CART_DETAIL = getApiUrl('/cart/list');
export const REMOVE_CART_PRODUCTS = getApiUrl('/cart/remove');
export const UPDATE_CART = getApiUrl('/cart/updateQuantity');
export const SEARCH = getApiUrl('/search/all');
export const CLEAR_CART = getApiUrl('/cart/empty');
export const ADD_ADDRESS = getApiUrl('/user/address');
export const SEARCH_BY_CATEGORY = getApiUrl('/search/category');
export const SEARCH_BY_VENDOR = getApiUrl('/search/vendor');
export const SEARCH_BY_BRAND = getApiUrl('/search/brand');
export const UPDATE_ADDRESS = getApiUrl('/user/address');
export const GET_ALL_PROMO_CODES = getApiUrl('/promo-code/list');
export const GET_ALL_PROMO_CODES_FOR_PRODUCTLIST = getApiUrl(
  '/promo-code/vendor_promo_code',
);
export const VERIFY_PROMO_CODE = getApiUrl('/promo-code/verify');
export const RESET_PASSWORD = getApiUrl('/auth/resetPassword');
export const REMOVE_PROMO_CODE = getApiUrl('/promo-code/remove');
export const GET_ALL_CELEBRITY = getApiUrl('/celebrity');
export const GET_ADDRESS = getApiUrl('/addressBook');
export const DELETE_ADDRESS = getApiUrl('/delete/address');
export const SET_PRIMARY_ADDRESS = getApiUrl('/primary/address');
export const GET_PRODUCTS_BASED_ON_CELEBRITYFILTER =
  getApiUrl('/celebrity/filters');
export const GET_PRODUCTS_BASED_ON_CELEBRITY = getApiUrl('/celebrityProducts');
export const PLACE_ORDER = getApiUrl('/place/order');
export const GET_ORDER_DETAIL = getApiUrl('/order-detail');
export const GET_ORDER_DETAIL_FOR_BILLING = getApiUrl(
  '/order/orderDetails_for_notification/',
);
export const GET_ALL_ORDERS = getApiUrl('/orders');
export const GET_VENDOR_DETAIL = getApiUrl('/vendor/category/list');
export const SEND_REFFERAL_CODE = getApiUrl('/send/referralcode');
export const GIVE_RATING_REVIEWS = getApiUrl('/rating/update-product-rating');
export const GET_RATING_DETAIL = getApiUrl('/rating/get-product-rating');
export const ACCEPT_REJECT_ORDER = getApiUrl('/update/order/status');

export const GET_ALL_CAR_AND_PRICE = getApiUrl(
  '/pickup-delivery/get-list-of-vehicles',
);

export const PLACE_DELIVERY_ORDER = getApiUrl('/pickup-delivery/create-order');
export const LIST_OF_PAYMENTS = getApiUrl('/payment/options');
export const LIST_OF_CMS = getApiUrl('/cms/page/list');
export const CMS_PAGE_DETAIL = getApiUrl('/cms/page/detail');

export const GET_VENDOR_REVENUE = getApiUrl('/store/revenue');
export const GET_VENDOR_TRANSACTIONS = getApiUrl('/get-vendor-transactions');
export const GET_VENDOR_REVENUE_DASHBOARD_DATA = getApiUrl(
  '/vendor-dasboard-data',
);
export const GET_VENDOR_PROFILE = getApiUrl('/get-vendor-profile');
export const GETWEBURL = getApiUrl('/payment');
export const GET_ALL_PROMO_CODES_CAB_ORDER = getApiUrl(
  '/pickup-delivery/promo-code/list',
);
export const VERIFY_PROMO_CODE_CAB_ORDER = getApiUrl(
  '/pickup-delivery/promo-code/verify',
);

export const GET_ALL_SUBSCRIPTION_PLANS = getApiUrl('/user/subscription/plans');
export const SELECT_SPECIFIC_PLAN = getApiUrl('/user/subscription/selectPlan');
export const PURCHASE_SPECIFIC_PLAN = getApiUrl('/user/subscription/purchase');
export const CANCEL_SPECIFIC_PLAN = getApiUrl('/user/subscription/cancel');
// export const RENEW_SPECIFIC_PLAN = getApiUrl('/user/subscription/cancel');

export const GET_LOYALTY_INFO = getApiUrl('/user/loyalty/info');
export const GET_RETURN_ORDER_DETAIL = getApiUrl(
  '/return-order/get-order-data-in-model',
);
export const GET_RETURN_PRODUCT_DETAIL = getApiUrl(
  '/return-order/get-return-products',
);

export const UPLOAD_PRODUCT_IMAGE = getApiUrl('/upload-file');
export const REPEAT_ORDER = getApiUrl('/repeatOrder');

export const SUBMIT_RETURN_ORDER = getApiUrl(
  '/return-order/update-product-return',
);

export const VENDOR_TABLE_CART = getApiUrl('/add/vendorTable/cart');

export const SCHEDULE_ORDER = getApiUrl('/cart/schedule/update');
export const MY_PENDING_ORDERS = getApiUrl('/my_pending_orders');
export const DISPATCHER_URL = getApiUrl(
  '/pickup-delivery/order-tracking-details',
);
export const CART_PRODUCT_SCHEDULE = getApiUrl('/cart/product-schedule/update');
export const TIP_AFTER_ORDER = getApiUrl('/orders/tip-after-order');
export const VALIDATE_PROMO_CODE = getApiUrl('/promo-code/validate_promo_code');
export const UPLOAD_PHOTO = getApiUrl('/upload-image-pickup');
export const LAST_ADDED = getApiUrl('/cart/product/lastAdded');
export const DIFFERENT_ADD_ONS = getApiUrl(
  '/cart/product/variant/different-addons',
);
export const WALLET_CREDIT = getApiUrl('/myWallet/credit');
export const VENDOR_REGISTER = getApiUrl('/vendor/register');
export const DRIVER_REGISTER = getApiUrl('/driver/register');
export const CANCEL_ORDER = getApiUrl('/return-order/vendor-order-for-cancel');
export const WALLET_USER_VERIFY = getApiUrl('/wallet/transfer/user/verify');
export const WALLET_TRANSFER_CONFIRM = getApiUrl('/wallet/transfer/confirm');
export const VENDOR_SLOTS = getApiUrl('/vendor/slots');
export const NEW_VENDOR_FILTER = getApiUrl('/vendor/vendorProductsFilter');
export const GETALLTEMPLCARDS = getApiUrl('/get/edited-orders');
export const ACCEPTREJECTDRIVERUPDATE = getApiUrl('/edit-order/approve/reject');

// Vendor App collection
export const GET_ALL_VENDOR_ORDERS = getApiUrl('/mystore');
export const GET_ALL_PRODUCTSBY_STORE_ID = getApiUrl('/mystore/product/list');
export const GET_ALL_PRODUCTSBY_VENDOR_ID = getApiUrl(
  '/mystore/vendor/product/list',
);
export const ADD_VENDOR_PRODUCT = getApiUrl('/mystore/product/add');
export const GET_VENDOR_CATEGORY = getApiUrl('/mystore/vendor/category');
export const GET_PRODUCT_DETAIL = getApiUrl('/mystore/product/detail');
export const CREATE_PRODUCT_VARIANT = getApiUrl(
  '/mystore/product/createvariant',
);
export const DELETE_PRODUCT_VARIANT = getApiUrl(
  '/mystore/product/deletevariant',
);
export const UPDATE_PRODUCT_STATUS = getApiUrl(
  '/mystore/product/status-update',
);
export const DELETE_VENDOR_PRODUCT = getApiUrl('/mystore/product/delete');
export const UPDATE_VENDOR_PRODUCT = getApiUrl('/mystore/product/update');
export const ADD_PRODUCT_IMAGE = getApiUrl('/mystore/product/addProductImage');
export const GET_PRODUCT_IMAGE = getApiUrl('/mystore/product/getProductImages');
export const DELETE_PRODUCT_IMAGE = getApiUrl('/mystore/product/deleteimage');
export const VENDOR_ALL = getApiUrl('/vendor/all');

//new optamize apis
export const VENDOR_OPTIMIZE = getApiUrl('/vendor-optimize');
export const VENDOR_OPTIMIZE_FILTERS = getApiUrl('/vendor-optimize-filters');

export const GETALLVENDORS = getApiUrl('/vendor/all');
export const USER_REGISTRATION_DOCUMENT = getApiUrl(
  '/user/registration/document',
);
export const GET_USER_PROFILE = getApiUrl('/getProfile');
export const VENDOR_PRODUCTS_OPTIMIZE_FILTERS = getApiUrl('/vendor/vendorProductsFilterOptimize');
