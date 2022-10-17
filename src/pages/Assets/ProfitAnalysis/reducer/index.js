const initState = {
    // 将对象转成immutable对象
    type: 200,
};

export default function profitReducer(state = initState, action) {
    switch (action.type) {
        case 'updateType':
            return {...state, type: action.payload};
        default:
            return state;
    }
}
