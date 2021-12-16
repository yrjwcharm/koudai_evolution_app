/*
 * @Date: 2021-03-25 10:57:56
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-11-01 15:01:34
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
import AsyncStorage from '@react-native-community/async-storage';
import immutableTransform from 'redux-persist-transform-immutable';
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
});

const persistedReducer = persistReducer(persistConfig, reducer);
// compose 从右往左执行
export default function configureStore() {
    const enhancers = compose(applyMiddleware(...middlewares));
    const store = createStore(persistedReducer, enhancers);

    let persistor = persistStore(store);

    return {store, persistor};
}
