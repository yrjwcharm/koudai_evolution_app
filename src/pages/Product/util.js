const {Platform} = require('react-native');
import Clipboard from '@react-native-community/clipboard';
import http from '~/services';
//上报剪切板内容
const postClipBordText = (value, callback) => {
    if (value && value?.indexOf('vmark') == 0) {
        http.post('/common/device/heart_beat/20210101', {polaris_favor: value}).then((result) => {
            if (result.code === '000000') {
                // 刷新
                callback();
                Clipboard.setString('');
            }
        });
    }
};
// 获取剪切板内容
export const getClipboard = async (callback) => {
    if (Platform.OS == 'android') {
        const res = await Clipboard.getString();
        postClipBordText(res, callback);
    } else {
        const hasContent = await Clipboard.hasString();
        if (hasContent) {
            const res = await Clipboard.getString();
            postClipBordText(res, callback);
        }
    }
};
