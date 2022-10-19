const initState = {
    fixedInvestDetail: {},
};

export default function fixedInvestReducer(state = initState, action) {
    switch (action.type) {
        case 'fetchSuccess':
            return {...state, ...action.payload};
        default:
            return state;
    }
}
