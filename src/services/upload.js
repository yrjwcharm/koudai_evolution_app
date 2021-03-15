/*
 * @Date: 2021-02-27 11:31:53
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-13 17:05:52
 * @Description:
 */
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import baseConfig from './config';
const upload = (url, file, otherParams, succ, failed) => {
    const PATH = Platform.OS === 'android' ? file.uri : file.uri.replace('file:///', '');
    try {
        RNFetchBlob.fetch(
            'POST',
            url.indexOf('http') > -1 ? url : `${baseConfig.SERVER_URL}${url}`,
            {
                'Content-Type': 'multipart/form-data',
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
                }
            })
            .catch((err) => {
                console.log(err);
                failed && failed();
            });
    } catch (error) {
        console.log(error);
    }
};
export default upload;
