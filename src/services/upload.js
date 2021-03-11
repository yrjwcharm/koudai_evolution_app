/*
 * @Date: 2021-02-27 11:31:53
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-10 16:08:39
 * @Description:
 */
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import Toast from '../components/Toast';
import baseConfig from './config';
const upload = (params, succ, failed) => {
    const PATH = Platform.OS === 'android' ? params.uri : params.uri.replace('file:///', '');
    try {
        RNFetchBlob.fetch(
            'POST',
            `${baseConfig.SERVER_URL}/mapi/identity/upload/20210101`,
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
                {
                    name: 'desc',
                    data: params.desc,
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
    } catch (error) {
        console.log(error);
    }
};
export default upload;
