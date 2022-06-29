import Toast from '~/components/Toast';
import actionTypes from '../../actionTypes';

export default function pkProducts(state = [], action) {
    switch (action.type) {
        case actionTypes.addProduct:
            if (state.length < 6) {
                return [...state, action.payload];
            } else {
                Toast.show('您PK的基金过多，最多选择6只');
                return state;
            }
        case actionTypes.delProduct:
            return state.filter((item) => item != action.payload);
        case actionTypes.cleanProduct:
            return [];
        default:
            return state;
    }
}
