import Toast from '~/components/Toast';
import {addPkProducts, deletePkProducts} from '~/pages/PK/pages/SelectProduct/services';
import actionTypes from '../../actionTypes';

export default function pkProducts(state = [], action) {
    switch (action.type) {
        case actionTypes.addProduct:
            let code = action.payload?.code || action.payload;
            let isHigh = action.payload?.isHigh;
            if (state.includes(code)) {
                Toast.show('已经选择过该产品了');
                return state;
            }
            if (state.length < 6) {
                let params = {fund_code: code};
                // 是否优选基金
                if (isHigh) params.source = 1;
                addPkProducts(params);
                return [...state, code];
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
