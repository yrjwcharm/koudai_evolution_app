/*
 * @Date: 2021-02-27 11:31:53
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-27 14:37:09
 * @Description:
 */
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import Toast from '../components/Toast';
const upload = (params, succ, failed) => {
    const PATH = Platform.OS === 'android' ? params.uri : params.uri.replace('file:///', '');
    RNFetchBlob.fetch(
        'POST',
        '/mapi/identity/upload/20210101',
        {
            'Content-Type': 'multipart/form-data',
        },
        [
            {
                name: 'file',
                filename: params.fileName || '未命名文件.jpg',
                type: params.type,
                data: RNFetchBlob.wrap(PATH),
            },
        ]
    )
        .then((resp) => {
            console.log(resp, 'resp');
            succ && succ(JSON.parse(resp.data));
        })
        .catch((err) => {
            Toast.show(err);
            failed && failed();
        });
};
export default upload;
