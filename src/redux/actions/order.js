import {
  ACCEPT_REJECT_ORDER,
  GET_ALL_ORDERS,
  GET_ALL_VENDOR_ORDERS,
  GET_ORDER_DETAIL,
  GET_RATING_DETAIL,
  GIVE_RATING_REVIEWS,
  GET_VENDOR_REVENUE,
} from '../../config/urls';
import {apiGet, apiPost} from '../../utils/utils';
import store from '../store';
const {dispatch} = store;

//Get Cart Detail
export function getOrderDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_ORDER_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//add delete product from cart
export const getOrderListing = (query = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///VENDOR ORDERS ACTIONS

//get all orders of specific vendor
export const _getListOfVendorOrders = (query = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_VENDOR_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//give order rating
export const giveRating = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GIVE_RATING_REVIEWS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//accept Reject order

export const updateOrderStatus = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPT_REJECT_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get order ratings

export const getRating = (query = '', data = {}, headers = {}) => {
  console.log(query, data, headers, 'IN ORDER>JS');
  return new Promise((resolve, reject) => {
    apiGet(GET_RATING_DETAIL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get revenue data
export const getRevenueData = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_REVENUE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get Cart Detail
export function getOrderDetailPickUp(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
