/*
 * @Date: 2021-09-23 11:37:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 23:09:45
 * @Description:
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({});

export default function userInfo(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.Account:
            return state.merge(fromJS(action.payload));
        default:
            return state;
    }
}
