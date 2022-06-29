/*
 * @Date: 2022-06-27 15:33:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 18:15:29
 * @Description:
 */
import http from '../../../services';

export const uploadFile = (data, progressCallBack) => {
    return http.uploadFiles(
        'http://kapi-web.wangchunyan.mofanglicai.com.cn:10080/pic/upload/20220608',
        data,
        progressCallBack
    );
};
