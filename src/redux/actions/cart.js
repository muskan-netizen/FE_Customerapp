import {
  GET_CART_DETAIL,
  REMOVE_CART_PRODUCTS,
  UPDATE_CART,
  CLEAR_CART,
  GET_ALL_PROMO_CODES,
  VERIFY_PROMO_CODE,
  REMOVE_PROMO_CODE,
  PLACE_ORDER,
  LIST_OF_PAYMENTS,
  GETWEBURL,
  GET_ALL_PROMO_CODES_CAB_ORDER,
  VERIFY_PROMO_CODE_CAB_ORDER,
} from '../../config/urls';
import {
  apiGet,
  apiPost,
  removeItem,
  saveSelectedAddress,
  setItem,
} from '../../utils/utils';
import store from '../store';
import types from '../types';
const {dispatch} = store;

export const saveAddress = (data) => {
  saveSelectedAddress(data).then((suc) => {
    dispatch({
      type: types.SELECTED_ADDRESS,
      payload: data,
    });
  });
};

//Get Cart Detail
export function getCartDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_CART_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//add delete product from cart
export const increaseDecreaseItemQty = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const cartItemQty = (data) => {
  setItem('cartItemCount', data).then((suc) => {
    dispatch({
      type: types.CART_ITEM_COUNT,
      payload: data,
    });
  });
};

export const cartItemType = (data) => {
  setItem('cartItemtype', data).then((suc) => {
    dispatch({
      type: types.CART_ITEM_TYPE,
      payload: data,
    });
  });
};
export const cartItemTypeRemove = (data = {}) => {
  console.log('cartItemTypeRemove');
  removeItem('cartItemtype').then((suc) => {
    dispatch({
      type: types.CART_ITEM_TYPE_REMOVE,
      payload: data,
    });
  });
};
//remove product from cart
export const removeProductFromCart = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(REMOVE_CART_PRODUCTS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//remove product from cart
export const clearCart = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(CLEAR_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get all promo codes
export const getAllPromoCodes = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PROMO_CODES, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get all promo codes for cab
export const getAllPromoCodesForCaB = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PROMO_CODES_CAB_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Verify Promo code

export const verifyPromocode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VERIFY_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Verify Promo code for cab orders

export const verifyPromocodeForCabOrders = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VERIFY_PROMO_CODE_CAB_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Remove Promo code

export const removePromoCode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(REMOVE_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Plce order code

export const placeOrder = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(PLACE_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get List of payment method
export function getListOfPaymentMethod(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(LIST_OF_PAYMENTS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get List of payment method
export function openPaymentWebUrl(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GETWEBURL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
