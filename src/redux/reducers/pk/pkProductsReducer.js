import Toast from '~/components/Toast';
import {addPkProducts, deletePkProducts} from '~/pages/PK/pages/SelectProduct/services';
import actionTypes from '../../actionTypes';

export default function pkProducts(state = [], action) {
    switch (action.type) {
        case actionTypes.addProduct:
            if (state.includes(action.payload)) {
                Toast.show('已经选择过该产品了');
                return state;
            }
            if (state.length < 6) {
                addPkProducts({fund_code: action.payload});
                return [...state, action.payload];
            } else {
                Toast.show('您PK的基金过多，最多选择6只');
                return state;
            }
        case actionTypes.delProduct:
            deletePkProducts({fund_code: action.payload});
            return state.filter((item) => item != action.payload);
        case actionTypes.cleanProduct:
            return [];
        case actionTypes.initCart:
            return action.payload;
        default:
            return state;
    }
}
