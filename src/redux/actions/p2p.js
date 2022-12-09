import {GET_AVAILABLE_ATTRIBUTES} from '../../config/urls';
import {apiGet} from '../../utils/utils';
import store from '../store';
const {dispatch} = store;

export function getAvailableAttributes(data = {}, headers = {}) {
  return apiGet(GET_AVAILABLE_ATTRIBUTES, data, headers);
}
