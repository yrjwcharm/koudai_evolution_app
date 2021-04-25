/*
 * @Date: 2020-11-26 18:36:52
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-17 20:56:42
 * @Description:
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({
    // 将对象转成immutable对象
    verifyGesture: false,
});

export default function userInfo(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.UserInfo:
            return state.merge(fromJS(action.payload));
        default:
            return state;
    }
}
