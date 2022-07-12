import { START_CHAT, USER_CHAT, VENDOR_CHAT } from "../../config/urls";
import { apiGet, apiPost } from "../../utils/utils";

export function onStartChat(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(START_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchUserChat(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(USER_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchVendorChat(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(VENDOR_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

