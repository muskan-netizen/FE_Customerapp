import {
  GET_AVAILABLE_ATTRIBUTES,
  SUBMIT_PRODUCT_WITH_ATTRIBUTE,
} from '../../config/urls';
import {apiGet, apiPost} from '../../utils/utils';
import store from '../store';
const {dispatch} = store;

export function getAvailableAttributes(url = '', data = {}, headers = {}) {
  return apiGet(GET_AVAILABLE_ATTRIBUTES + url, data, headers);
}
