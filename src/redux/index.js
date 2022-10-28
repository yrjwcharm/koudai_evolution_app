/*
 * @Date: 2021-03-25 10:57:56
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-28 17:51:21
 * @Description:
 */
import {applyMiddleware, createStore, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist'; //数据持久化 存到缓存
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import UserReducer from './reducers/userReducer';
import VisionReducer from './reducers/visionReducer';
import AccountReducer from './reducers/accountReducer';
import ModalReducer from './reducers/modalReducer';
import pkProductsReducer from './reducers/pk/pkProductsReducer';
import pkPinningReducer from './reducers/pk/pkPinningReducer';
import ocrFundListReducer from './reducers/ocrFundListReducer';
import AsyncStorage from '@react-native-community/async-storage';
import immutableTransform from 'redux-persist-transform-immutable';
import fixedInvestReducer from '~/pages/Assets/FixedInvestment/reducer'; // 定投reducer
import profitDetailReducer from '~/pages/Assets/ProfitAnalysis/reducer';
const persistConfig = {
    transforms: [immutableTransform()],
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['userInfo', 'vision'],
    timeout: null,
};

//中间件
const middlewares = [thunkMiddleware];
if (__DEV__) {
    middlewares.push(require('redux-logger').createLogger());
}

const reducer = combineReducers({
    userInfo: UserReducer,
    vision: VisionReducer,
    accountInfo: AccountReducer,
    modalInfo: ModalReducer,
    pkProducts: pkProductsReducer,
    pkPinning: pkPinningReducer,
    ocrFund: ocrFundListReducer,
    fixedInvest: fixedInvestReducer,
    profitDetail: profitDetailReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);
// compose 从右往左执行
export default function configureStore() {
    const enhancers = compose(applyMiddleware(...middlewares));
    const store = createStore(persistedReducer, enhancers);

    let persistor = persistStore(store);

    return {store, persistor};
}
