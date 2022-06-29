import actionTypes from '../../actionTypes';

export default function pkProducts(state = null, action) {
    switch (action.type) {
        case actionTypes.pinningProduct:
            return action.payload;
        default:
            return state;
    }
}
