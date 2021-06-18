/*
 * @Date: 2021-02-27 11:31:53
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-06-18 15:10:31
 * @Description:
 */
import RNFetchBlob from 'rn-fetch-blob';
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
export default upload;
