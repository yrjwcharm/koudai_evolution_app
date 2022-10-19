const initState = {
    type: 200,
    unitType: 'day',
    unitKey: '',
};

export default function profitReducer(state = initState, action) {
    switch (action.type) {
        case 'updateType':
            return {...state, type: action.payload};
        case 'updateUnitType':
            return {...state, unitType: action.payload};

        case 'updateUnitKey':
            return {...state, unitKey: action.payload};
        default:
            return state;
    }
}
