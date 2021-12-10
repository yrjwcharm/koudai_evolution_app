import {fetch} from 'react-native-ssl-request';
import qs from 'qs';
import {SERVER_URL, env} from './config';
import Storage from '../utils/storage';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

const HTTP = async (method, url, body = {}) => {
    const loginStatus = await Storage.get('loginStatus');

    const device = await DeviceInfo.getDeviceName();
    url = (url.slice(0, 8).includes('//') ? '' : SERVER_URL[env].HTTP) + url;
    url =
        url +
        (url.includes('?') ? '&' : '?') +
        qs.stringify({
            app: '4000',
            ts: new Date().getTime(),
            did: DeviceInfo.getUniqueId(),
            uid: loginStatus?.uid,
            utid: loginStatus?.utid,
            chn: global.channel,
            ver: global.ver,
            platform: Platform.OS,
            device: device || '',
            deviceId: DeviceInfo.getDeviceId(),
            systemVersion: DeviceInfo.getSystemVersion(),
            request_id: new Date().getTime().toString() + parseInt(Math.random() * 1e6, 16),
        });
    try {
        let options = {
            method,
            headers: {
                Accept: 'application/x-www-form-urlencoded; charset=utf-8',
                Authorization: loginStatus?.access_token,
            },
            timeoutInterval: 10000,
        };
        if (method == 'POST') options.body = JSON.stringify(body);
        // if(body) options.body = {
        //   formData: Object.entries(body).reduce((memo,cur)=>{
        //     if(cur[1]) memo.append(cur[0], cur[1])
        //     return memo
        //   } ,new FormData())
        // }

        let response = await fetch(url, options);

        let data = null;
        try {
            data = await response.json();
        } catch (error) {
            return void 0;
        }

        //请求返回数据处理
        if (data?.code == 'A00001') {
            Storage.delete('loginStatus');
            global.getUserInfo();
            setTimeout(() => {
                global.navigation?.navigate('Login');
            }, 1000);
        }

        return data;
    } catch (error) {
        return Promise.reject(error);
    }
};

const androidHttp = {
    get: (url) => {
        return HTTP('GET', url);
    },
    post: (url, body) => {
        return HTTP('POST', url, body);
    },
};

export default androidHttp;
