import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
const upload = (params, succ, failed) => {
    const PATH = Platform.OS === 'android' ? params.uri : params.uri.replace('file:///', '');
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
        ]
    )
        .then((resp) => {
            console.log(resp, 'resp');
            succ && succ(resp.data);
        })
        .catch((err) => {
            console.log(err, 'err');
            failed && failed();
        });
};
export default upload;
