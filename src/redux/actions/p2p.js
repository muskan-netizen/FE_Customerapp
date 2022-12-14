import {
  GET_AVAILABLE_ATTRIBUTES,
  GET_P2P_CATEGORIES,
  GET_PRODUCT_BY_P2P_CATEGORY,
  HOMEPAGE_DATA_URL,
  SUBMIT_PRODUCT_WITH_ATTRIBUTE,
} from '../../config/urls';
import {apiGet, apiPost} from '../../utils/utils';
import store from '../store';
const {dispatch} = store;

export function getP2pCategories(data = {}, headers = {}) {
  return apiGet(GET_P2P_CATEGORIES, data, headers);
}

export function getAvailableAttributes(url = '', data = {}, headers = {}) {
  return apiGet(GET_AVAILABLE_ATTRIBUTES + url, data, headers);
}

export function submitProductWithAttributes(data = {}, headers = {}) {
  return apiPost(SUBMIT_PRODUCT_WITH_ATTRIBUTE, data, headers);
}

export function getProductByP2pCategoryId(url = '', data = {}, headers = {}) {
  return apiPost(GET_PRODUCT_BY_P2P_CATEGORY + url, data, headers);
}
