import axios from 'axios';
import qs from 'qs';
import baseConfig from './config';
import Storage from '../utils/storage';
import Toast from '../components/Toast';
axios.defaults.timeout = 10000;
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers = {
//     'Content-Type': 'application/x-www-form-urlencoded',
// };
//监控网络变化
// NetInfo.addEventListener((state) => {
//     if (!state.isConnected) {
//         // Toast.showInfo('网络已断开,请检查您的网络');
//     }
// });
let showError = true;
axios.defaults.transformRequest = [
    function (data) {
        let ret = '';
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        return ret;
    },
];
// // axios拦截器
axios.interceptors.request.use(async (config) => {
    //拦截器处理
    var token = '';
    var uid = '';
    var utid = '';
    let result = await Storage.get('loginStatus');
    if (result) {
        token = result.access_token;
        uid = result.uid;
        utid = result.utid;
    }
    config.headers.Authorization = token;
    config.params = {
        ...config.data,
        app: 'p_a',
        ts: new Date().getTime(),
        did: DeviceInfo.getUniqueId(),
        uid,
        utid,
        chn: global.channel,
        ver: DeviceInfo.getVersion(),
        request_id: new Date().getTime().toString() + parseInt(Math.random() * 1e6, 16),
    };
    return config;
});
axios.interceptors.response.use(
    (response) => {
        //请求返回数据处理
        if (response?.data?.code == 'A00001') {
            Storage.delete('loginStatus');
            global.getUserInfo();
            setTimeout(() => {
                global.navigation?.navigate('Login');
            }, 1000);
        }
        return response.data.data || response.data;
    },
    (err) => {
        Toast.show('网络异常，请稍后再试~');
        // showError && Toast.show('网络异常，请稍后再试~');
        // NetInfo.fetch().then((state) => {
        //     if (state.isConnected) {
        //         Toast.show('服务器开小差了...');
        //     } else {
        //         if (err && err.stack.indexOf('timeout') > -1) {
        //             Toast.show('您的网络环境不稳定...');
        //         } else {
        //             Toast.show('网络请求失败,请检查您的网络');
        //         }
        //     }
        // });
        Promise.reject(err);
    }
);
export default class http {
    static async get(url, params, config, showLoading = true) {
        if (url.indexOf('tj.licaimofang.com/v.gif') > -1) {
            showError = false;
        }
        try {
            if (showLoading) {
                // Toast.showLoading('加载中...');
            }
            if (!url.indexOf('http') > -1) {
                axios.defaults.baseURL = baseConfig.HTTP; // 改变 axios 实例的 baseURL
            }
            let query = await qs.stringify(params);
            let res = null;
            if (!params) {
                res = await axios.get(url);
            } else {
                res = await axios.get(url + '?' + query);
            }
            return res;
        } catch (error) {
            return error;
        }
        // }
    }
    static async post(url, params, showLoading = '') {
        if (!url.indexOf('http') > -1) {
            axios.defaults.baseURL = baseConfig.HTTP; // 改变 axios 实例的 baseURL
        }
        try {
            let toast = '';
            if (showLoading) {
                toast = Toast.showLoading(showLoading);
            }
            let res = await axios.post(url, params);
            toast && Toast.hide(toast);
            return res;
        } catch (error) {
            return error;
        }
    }
}
