import actionTypes from '../../actionTypes';

export const pinningProduct = (payload) => {
    return {
        type: actionTypes.pinningProduct,
        payload,
    };
};
