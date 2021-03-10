/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2021-03-10 20:38:44
 * @Description:环境
 */
const env = 'develop'; //默认
const SERVER_URL = {
    online: {
        // 正式环境
        SERVER_URL: 'https://polaris-api.licaimofang.com',
    },
    develop: {
        SERVER_URL: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
    },
    pre1: {
        SERVER_URL: 'https://pre1-polaris-api.licaimofang.com',
    },
    wg: {
        SERVER_URL: 'http://polaris-api.wanggang.mofanglicai.com.cn:10080',
    },
    ll: {
        SERVER_URL: 'http://polaris-api.ll.mofanglicai.com.cn:10080',
    },
    hjq: {
        SERVER_URL: 'http://kmapi.huangjianquan.mofanglicai.com.cn:10080',
    },
};
export default SERVER_URL[env];
