/*
 * @Date: 2021-09-23 11:37:13
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-01 15:00:46
 * @Description: 弹窗内容
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({});

export default function userInfo(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.Modal:
            return state.merge(fromJS(action.payload));
        case actionTypes.DeleteModal:
            return fromJS({});
        default:
            return state;
    }
}
