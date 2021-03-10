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
    // Storage.delete('loginStatus');
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
        ver: '5.3.0',
        Authorization: token,
    };
    return config;
});
axios.interceptors.response.use(
    (response) => {
        //请求返回数据处理
        if (response.data.code == 'A00001') {
            Storage.delete('loginStatus');
        }
        return response.data.data || response.data;
    },
    (err) => {
        // NetInfo.fetch().then((state) => {
        //     if (state.isConnected) {
        //         //判断网络是否链接
        //         // setTimeout(() => {
        //         //   Toast.showInfo('服务器开小差了...')
        //         // }, 100)
        //     } else {
        //         if (err && err.stack.indexOf('timeout') > -1) {
        //             // setTimeout(() => {
        //             //   Toast.showInfo('您的网络环境不稳定...')
        //             // }, 100)
        //         } else {
        //             // setTimeout(() => {
        //             //   Toast.showInfo('网络请求失败,请检查您的网络')
        //             // }, 100)
        //         }
        //     }
        // });
        Promise.reject(err);
    }
);
export default class http {
    static async get(url, params, config, showLoading = true) {
        try {
            if (showLoading) {
                // Toast.showLoading('加载中...');
            }
            if (!url.indexOf('http') > -1) {
                axios.defaults.baseURL = baseConfig.SERVER_URL; // 改变 axios 实例的 baseURL
            }
            let query = await qs.stringify(params);
            let res = null;
            if (!params) {
                res = await axios.get(url);
                if (showLoading) {
                    // Toast.hide();
                }
            } else {
                res = await axios.get(url + '?' + query);

                if (showLoading) {
                    // Toast.hide();
                }
            }
            return res;
        } catch (error) {
            return error;
        }
        // }
    }
    static async post(url, params, showLoading = '') {
        if (!url.indexOf('http') > -1) {
            axios.defaults.baseURL = baseConfig.SERVER_URL; // 改变 axios 实例的 baseURL
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
