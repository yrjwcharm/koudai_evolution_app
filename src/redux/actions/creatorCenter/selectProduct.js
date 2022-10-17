/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 12:27:11
 */
import actionTypes from '../../actionTypes';

export const selectProduct = (payload) => {
    return {
        type: actionTypes.selectProduct,
        payload,
    };
};
