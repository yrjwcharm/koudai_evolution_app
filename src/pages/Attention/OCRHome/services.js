/*
 * @Date: 2022-06-27 15:33:32
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 16:19:22
 * @Description:
 */
import http from '../../../services';

export const uploadFile = (data, callBack, progressCallBack) => {
    return http.uploadFiles(
        'http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/pic/upload/20220608',
        data,
        callBack,
        progressCallBack
    );
};
