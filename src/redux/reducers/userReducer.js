/*
 * @Date: 2020-11-26 18:36:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-05-31 13:53:09
 * @Description:
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({
    // 将对象转成immutable对象
    verifyGesture: false,
    show_wx_login_btn: false,
});

export default function userInfo(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.UserInfo:
            return state.merge(fromJS(action.payload));
        default:
            return state;
    }
}
