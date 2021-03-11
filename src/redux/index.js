import {applyMiddleware, createStore, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist'; //数据持久化 存到缓存
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import UserReducer from './reducers/userReducer';
import AsyncStorage from '@react-native-community/async-storage';
import immutableTransform from 'redux-persist-transform-immutable';

const persistConfig = {
    transforms: [immutableTransform()],
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['userInfo'],
    timeout: null,
};

//中间件
const middlewares = [thunkMiddleware];
if (__DEV__) {
    middlewares.push(require('redux-logger').createLogger());
}

const reducer = combineReducers({
    userInfo: UserReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);
// compose 从右往左执行
export default function configureStore() {
    const enhancers = compose(applyMiddleware(...middlewares));
    const store = createStore(persistedReducer, enhancers);

    let persistor = persistStore(store);

    return {store, persistor};
}
