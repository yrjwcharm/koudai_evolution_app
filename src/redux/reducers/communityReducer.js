/*
 * @Date: 2022-12-05 10:43:13
 * @Description: 社区reducer
 */
import {fromJS} from 'immutable';
import actionTypes from '../actionTypes';

const defaultState = fromJS({
    communityFollowNews: false,
    communityRecommendNews: false,
});

export default function CommunityReducer(state = defaultState, {payload, type}) {
    switch (type) {
        case actionTypes.Community:
            return state.merge(fromJS(payload));
        default:
            return state;
    }
}
