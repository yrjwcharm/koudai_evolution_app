const initState = {
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
