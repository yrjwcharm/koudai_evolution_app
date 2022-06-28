/*
 * @Date: 2021-09-23 11:37:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 23:12:11
 * @Description:
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({
    ocrOwernList: [], //持仓基金
    ocrOptionalList: [], //自选基金
});

export default function ocrFundList(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.OcrFundList:
            return state.merge(fromJS(action.payload));

        default:
            return state;
    }
}
