import actionTypes from '../../actionTypes';
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
