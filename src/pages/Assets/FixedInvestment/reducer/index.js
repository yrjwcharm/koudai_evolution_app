const initState = {
    // 将对象转成immutable对象
    fixedInvestDetail: {},
};

export default function fixedInvestReducer(state = initState, action) {
    switch (action.type) {
        case 'fetchSuccess':
            return {...state, fixedInvestDetail: action.payload};
        default:
            return state;
    }
}
