import axios from 'axios';
import androidHttp from './android.http';
import qs from 'qs';
import {SERVER_URL, env} from './config';
import Storage from '../utils/storage';
import Toast from '../components/Toast';
axios.defaults.timeout = 10000;
import {Platform} from 'react-native';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = SERVER_URL[env].HTTP;
axios.defaults.transformRequest = [
    function (data) {
        //文件上传
        if (JSON.stringify(data)?.indexOf('_parts') > -1) {
            return data;
        } else {
            //普通
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }
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
        if (result) {
            token = result.access_token;
            uid = result.uid;
            utid = result.utid;
        }
        config.headers.Authorization = token;
        config.params = {
            app: '4000',
            ts: new Date().getTime(),
            did: global.did,
            uid,
            utid,
            chn: global.channel,
            ver: global.ver,
            platform: Platform.OS,
            device: global.getDeviceName || '',
            deviceId: global.deviceId,
            brandName: global.brandName,
            systemVersion: global.systemVersion,
            request_id: new Date().getTime().toString() + parseInt(Math.random() * 1e6, 16),
            idfa: global.idfa,
            oaid: global.oaid,
            currentViewPage: global.currentRoutePageId,
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
        if (response?.data?.code == 'A00002') {
            Storage.delete('loginStatus');
            global.getUserInfo();
            setTimeout(() => {
                global.navigation?.navigate('Register');
            }, 1000);
        }
        return response.data.data || response.data;
    },
    (err) => {
        if (
            err.config?.url.indexOf('tj.licaimofang.com/v.gif') <= -1 &&
            err.config?.url.indexOf('/mapi/app/splash/20210628') <= -1 &&
            err.config?.url.indexOf('/common/device/heart_beat/20210101') <= -1 &&
            err.config?.url.indexOf('/health/check') <= -1 &&
            err.config?.url.indexOf('/common/user_info/20210101') <= -1
        ) {
            // Toast.show('网络异常，请稍后再试~');
        }
        Promise.reject(err);
    }
);
export default class http {
    static adapter = Platform.OS === 'ios' || __DEV__ ? axios : androidHttp;
    // static adapter = axios;
    axiosPostRequestCancel = null;

    static async get(url, params, config, showLoading = true) {
        try {
            let query = await qs.stringify(params);
            let res = null;
            if (!params) {
                res = await this.adapter.get(url);
            } else {
                res = await this.adapter.get(url + '?' + query);
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
            if (params?.adapter == 1) {
                this.adapter == axios;
            }
            let res = await this.adapter.post(url, params);
            toast && Toast.hide(toast);
            return res;
        } catch (error) {
            return error;
        }
    }

    static async uploadFiles(url, data, progressCallBack) {
        let formData = new FormData();
        let file = {
            uri: data.uri,
            type: data.type,
            name: data.fileName,
        };
        formData.append('file', file);
        let config = {
            //添加请求头
            // 'Content-Type': 'multipart/form-data',
            timeout: 600000,
            //添加上传进度监听事件
            onUploadProgress: (e) => {
                let completeProgress = (e.loaded / e.total) * 100 || 0;
                progressCallBack && progressCallBack(completeProgress);
            },
            cancelToken: new axios.CancelToken(function executor(c) {
                this.axiosPostRequestCancel = c; // 用于取消上传
            }),
        };
        try {
            let toast = '';
            let res = await axios.post(url, formData, config);
            toast && Toast.hide(toast);
            return res;
        } catch (error) {
            return error;
        }
    }

    /**
     * [cancelAxiosRequest 取消axios post请求]
     */
    static cancelAxiosRequest() {
        this.axiosPostRequestCancel && this.axiosPostRequestCancel('cancel');
        this.axiosPostRequestCancel = null;
    }
}
