/*
 * @Date: 2020-11-26 18:36:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-14 11:10:42
 * @Description:
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({
    // 将对象转成immutable对象
    login: true,
    verifyGesture: false,
    show_wx_login_btn: false,
    hotRefreshData: '', //是否有热更新
    latest_version: '',
});

export default function userInfo(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.UserInfo:
            return state.merge(fromJS(action.payload));
        default:
            return state;
    }
}
