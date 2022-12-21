import produce from 'immer';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';
import types from '../types';

const initial_state = {
  appMainData: {},
  location: {
    address: '',
    latitude: '',
    longitude: '',
  },
  profileAddress: {
    addAddress: '',
    updatedAddress: '',
  },
  dineInType: 'p2p',
  constCurrLoc: {
    address: '',
    latitude: '',
    longitude: '',
  },
  pickUpTimeType: 'now',
  isLocationSearched: false,
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.HOME_DATA: {
      const data = action.payload;

      return {
        ...state,
        appMainData: data,
      };
    }

    case types.LOCATION_DATA: {
      const data = action.payload;
      return {
        ...state,
        location: data,
      };
    }
    case types.CONST_CUR_LOC: {
      const data = action.payload;
      return {
        ...state,
        constCurrLoc: data,
      };
    }

    case types.PROFILE_ADDRESS: {
      const data = action.payload;
      return {
        ...state,
        profileAddress: data,
      };
    }
    case types.DINE_IN_DATA: {
      const data = action.payload;
      return {
        ...state,
        dineInType: !!data ? data : 'delivery',
      };
    }

    case types.SAVE_SCHEDULE_TIME: {
      const data = action.payload;
      return {
        ...state,
        pickUpTimeType: data,
      };
    }

    case types.IS_LOCATION_SEARCHED: {
      const data = action.payload;
      return {
        ...state,
        isLocationSearched: data,
      };
    }

    default: {
      return {...state};
    }
  }
}
