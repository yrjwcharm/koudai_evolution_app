/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-10-16 13:01:46
 */
import actionTypes from '../../actionTypes';

export default function selectProduct(state = {selections: []}, action) {
    switch (action.type) {
        case actionTypes.selectProduct:
            return action.payload;
        default:
            return state;
    }
}
