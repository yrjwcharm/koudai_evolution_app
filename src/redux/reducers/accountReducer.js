/*
 * @Date: 2021-03-26 12:54:22
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-26 13:59:44
 * @Description:
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({
    // 将对象转成immutable对象
});

export default function accountInfo(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.AccountInfo:
            return state.merge(fromJS(action.payload));
        default:
            return state;
    }
}
