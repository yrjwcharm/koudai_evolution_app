/*
 * @Date: 2021-02-27 11:31:53
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-11 16:10:50
 * @Description:
 */
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import baseConfig from './config';
const upload = (params, succ, failed) => {
    const PATH = Platform.OS === 'android' ? params.uri : params.uri.replace('file:///', '');
    console.log(`${baseConfig.SERVER_URL}mapi/identity/upload/20210101`);
    try {
        RNFetchBlob.fetch(
            'POST',
            'http://kapi-web.wanggang.mofanglicai.com.cn:10080/mapi/identity/upload/20210101',
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
