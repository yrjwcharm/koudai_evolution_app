import actionTypes from '../../actionTypes';

export default function pkProducts(_state = {1: null, 2: null}, action) {
    const state = _state[global.pkEntry];
    const handler = () => {
        switch (action.type) {
            case actionTypes.pinningProduct:
                return action.payload;
            default:
                return state;
        }
    };
    _state[global.pkEntry] = handler();
    return {..._state};
}
