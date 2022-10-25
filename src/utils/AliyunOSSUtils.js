/*
 * @Date: 2022-10-13 18:49:43
 * @Description: ali OSS 上传工具
 */
import {BackHandler} from 'react-native';
import {AliyunOSS} from 'rn-alioss';
import Toast from '~/components/Toast';
import http from '~/services';

AliyunOSS.enableDevMode();

/** @name 上传完成获取链接 */
const uploadDone = ({id, media_duration = 0, status}) => {
    return http.post('/community/upload/done/202209', {id, media_duration, status});
};

/**
 * @name ali-oss上传文件
 * @param file 上传的文件
 * @returns Promise 成功返回链接和id 失败返回false
 *  */
export const upload = async (file) => {
    const fun = () => true;
    BackHandler.addEventListener('hardwareBackPress', fun);
    const loading = Toast.showLoading('上传中...');
    const res = await http.get('/community/upload/prepare/202209', {filename: file.fileName, filetype: file.fileType});
    if (res?.code === '000000') {
        const {bucket, credentials, domain, fullpath, id} = res.result;
        const {AccessKeyId, AccessKeySecret, SecurityToken} = credentials;
        AliyunOSS.initWithSecurityToken(SecurityToken, AccessKeyId, AccessKeySecret, domain.split(`${bucket}.`)[1]);
        const uploadRes = await AliyunOSS.asyncUpload(bucket, fullpath, file.uri);
        if (uploadRes?.includes?.('UploadSuccess') || uploadRes?.includes?.('completed = YES')) {
            const doneRes = await uploadDone({id, media_duration: file.duration, status: 1});
            if (doneRes?.code === '000000') {
                BackHandler.removeEventListener('hardwareBackPress', fun);
                Toast.hide(loading);
                Toast.show('上传成功');
                return doneRes.result;
            } else {
                BackHandler.removeEventListener('hardwareBackPress', fun);
                Toast.hide(loading);
                Toast.show('上传失败');
                return false;
            }
        } else {
            uploadDone({id, status: 2});
            BackHandler.removeEventListener('hardwareBackPress', fun);
            Toast.hide(loading);
            Toast.show('上传失败');
            return false;
        }
    } else {
        BackHandler.removeEventListener('hardwareBackPress', fun);
        Toast.hide(loading);
        Toast.show('上传失败');
        return false;
    }
};
