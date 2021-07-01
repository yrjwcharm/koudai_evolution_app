/*
 * @Date: 2020-11-26 18:36:52
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-07-01 11:15:44
 * @Description:
 */
import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';
const defaultState = fromJS({
    // 将对象转成immutable对象
    recommend: {},
    initTab: 0,
    visionTabUpdate: '', //视野上部tab更新
    visionUpdate: '', //视野tab更新
    album_update: '', //专辑更新
    refreshing: false,
    readList: [], //已阅读的文章
    albumList: [], //专辑列表
    albumListendList: [], //已听完的专辑列表
});

export default function Vision(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.Vision:
            return state.merge(fromJS(action.payload));
        case actionTypes.ResetVision:
            return fromJS({
                // 将对象转成immutable对象
                recommend: {},
                visionTabUpdate: '', //视野上部tab更新
                visionUpdate: '', //视野tab更新
                refreshing: false,
                initTab: 0,
                readList: [], //已阅读的文章
                albumList: [], //专辑列表
                albumListendList: [], //已听完的专辑列表
            });
        default:
            return state;
    }
}
