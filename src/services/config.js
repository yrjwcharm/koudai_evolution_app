/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2020-12-28 10:40:51
 * @Description:环境
 */
const env = 'online'; //默认
const SERVER_URL = {
    online: {
        // 正式环境
        SERVER_URL: 'https://polaris-api.licaimofang.com',
    },
    pre1: {
        SERVER_URL: 'https://pre1-polaris-api.licaimofang.com',
    },
    wg: {
        SERVER_URL: 'http://polaris-api.wanggang.mofanglicai.com.cn:10080',
    },
    lff: {
        SERVER_URL: 'http://polaris.lifangfang.mofanglicai.com.cn:10080',
    },
    develop: {
        SERVER_URL: 'http://polaris-api.bae.mofanglicai.com.cn:10080',
    },
    ll: {
        SERVER_URL: 'http://polaris-api.ll.mofanglicai.com.cn:10080',
    },
};
export default SERVER_URL[env];
