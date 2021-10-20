/*
 * @Date: 2021-02-27 11:31:53
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-23 15:49:31
 * @Description:
 */
import RNFetchBlob from 'rn-fetch-blob';
import {fetch} from 'react-native-ssl-pinning'
import {Platform} from 'react-native';
import {SERVER_URL} from './config';
import Storage from '../utils/storage';

const upload = async (url, file, otherParams, succ, failed) => {
    let result = await Storage.get('loginStatus');
    const PATH = Platform.OS === 'android' ? file.uri : file.uri.replace('file:///', '');
    try {
        RNFetchBlob.fetch(
            'POST',
            url.indexOf('http') > -1 ? url : `${SERVER_URL[global.env].HTTP}${url}`,
            {
                'Content-Type': 'multipart/form-data',
                // eslint-disable-next-line prettier/prettier
                'Authorization': result.access_token,
            },
            [
                {
                    name: 'file',
                    filename: file.fileName || '未命名文件.jpg',
                    type: file.type,
                    data: RNFetchBlob.wrap(PATH),
                },
                ...otherParams,
            ]
        )
            .then((resp) => {
                console.log(resp);
                if (resp?.respInfo?.status == 200) {
                    succ && succ(JSON.parse(resp?.data));
                } else {
                    failed && failed();
                }
            })
            .catch((err) => {
                failed && failed();
                console.log(err);
            });
    } catch (error) {
        failed && failed();
        console.log(error);
    }
};

const androidUpload = async (url, file, otherParams = {}, succ, failed) => {
    try {
        url = url.indexOf('http') > -1 ? url : `${SERVER_URL[global.env].HTTP}${url}`
        const loginStatus = await Storage.get('loginStatus')
        let formData = new FormData()
        formData.append('file',{
            name: 'file',
            filename: file.fileName || '未命名文件.jpg',
            type: file.type,
            uri: file.uri,
        })
        for(let key in otherParams){
          if(otherParams[key]) formData.append(key, JSON.stringify(otherParams[key]))
        }
        console.log(loginStatus?.access_token)
        fetch(url, {
                method:'POST',
                body:formData,
                timeoutInterval: 30000,
                headers: {
                    Accept: "application/x-www-form-urlencoded; charset=utf-8",
                    Authorization: loginStatus?.access_token
                }
            }
        ).then((resp) => {
            console.log('------',resp)
            resp.json().then(res=>{
                if (res.status == 200) {
                    succ && succ(JSON.parse(res.data));
                } else {
                    failed && failed();
                }
            })
        }).catch((err) => {
            failed && failed();
        });
    } catch (error) {
        failed && failed();
    }
};

export default Platform.OS === 'IOS' ? upload : androidUpload
