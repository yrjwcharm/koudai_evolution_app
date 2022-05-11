/*
 * @Date: 2021-09-23 11:37:13
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-11 09:17:25
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
            if (action.payload) {
                const modalInfo = state.toJS();
                const {log_id, type} = action.payload;
                const {modals = []} = modalInfo || {};
                return state.merge(
                    fromJS({modals: modals.filter((modal) => modal.log_id !== log_id || modal.type !== type)})
                );
            }
            return fromJS({});
        default:
            return state;
    }
}
