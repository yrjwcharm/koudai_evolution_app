import actionTypes from '../../actionTypes';
import {getPkCartList} from '~/pages/PK/pages/SelectProduct/services';

export const addProduct = (payload) => {
    return {
        type: actionTypes.addProduct,
        payload,
    };
};

export const delProduct = (payload) => {
    return {
        type: actionTypes.delProduct,
        payload,
    };
};

export const cleanProduct = (payload) => {
    return {
        type: actionTypes.cleanProduct,
        payload,
    };
};

export const initCart = (payload) => {
    return {
        type: actionTypes.initCart,
        payload,
    };
};

export const getCartData = () => {
    return (dispatch) => {
        getPkCartList().then((res) => {
            if (res.code === '000000') {
                dispatch(initCart(res.result));
            }
        });
    };
};
