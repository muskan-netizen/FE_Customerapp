import types from '../types';

const initial_state = {
  cartItemCount: {},
  cartItemType: '',
  selectedAddress: null,
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.CART_ITEM_COUNT: {
      const data = action.payload;
      return {
        ...state,
        cartItemCount: data,
      };
    }

    case types.SELECTED_ADDRESS: {
      const data = action.payload;
      return {
        ...state,
        selectedAddress: data,
      };
    }

    default: {
      return {...state};
    }
  }
}
