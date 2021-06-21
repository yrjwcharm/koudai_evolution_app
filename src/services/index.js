import axios from 'axios';
import qs from 'qs';
import {SERVER_URL, env} from './config';
import Storage from '../utils/storage';
import Toast from '../components/Toast';
axios.defaults.timeout = 10000;
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = SERVER_URL[env].HTTP;
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
axios.interceptors.request.use(
    async (config) => {
        config.baseURL = SERVER_URL[global.env || env].HTTP;
        //拦截器处理
        var token = '';
        var uid = '';
        var utid = '';
        let result = await Storage.get('loginStatus');
        let device = await DeviceInfo.getDeviceName();
        if (result) {
            token = result.access_token;
            uid = result.uid;
            utid = result.utid;
        }
        config.headers.Authorization = token;
        config.params = {
            ...config.data,
            app: '4000',
            ts: new Date().getTime(),
            did: DeviceInfo.getUniqueId(),
            uid,
            utid,
            chn: global.channel,
            ver: '6.1.0',
            platform: Platform.OS,
            device: device || '',
            request_id: new Date().getTime().toString() + parseInt(Math.random() * 1e6, 16),
        };
        return config;
    },
    (err) => {
        console.log(JSON.stringify(err));
    }
);
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
        if (
            err.config.url.indexOf('https://tj.licaimofang.com/v.gif') <= -1 &&
            err.config.url.indexOf('/common/device/heart_beat/20210101') <= -1 &&
            err.config.url.indexOf('/health/check') <= -1 &&
            err.config.url.indexOf('/common/user_info/20210101') <= -1
        ) {
            Toast.show('网络异常，请稍后再试~');
        }
        Promise.reject(err);
    }
);
export default class http {
    static async get(url, params, config, showLoading = true) {
        try {
            let query = await qs.stringify(params);
            let res = null;
            if (!params) {
                res = await axios.get(url);
            } else {
                res = await axios.get(url + '?' + query);
            }
            return res;
        } catch (error) {
            console.log('error', error);
            return error;
        }
        // }
    }
    static async post(url, params, showLoading = '') {
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
