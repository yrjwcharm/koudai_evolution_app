/*
 * @Date: 2020-11-26 18:36:52
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-12 16:38:10
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
    anti_pop: '', //上传身份证弹窗
    show_vision_tab: true,
    show_find_tab: true,
    showAudioModal: true,
});

export default function userInfo(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.UserInfo:
            return state.merge(fromJS(action.payload));
        default:
            return state;
    }
}
