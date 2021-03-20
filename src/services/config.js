/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-20 16:20:22
 * @Description:环境
 */
const env = 'develop'; //默认
const SERVER_URL = {
    online: {
        // 正式环境
        HTTP: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    develop: {
        HTTP: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    pre1: {
        HTTP: 'https://pre1-polaris-api.licaimofang.com',
    },
    wg: {
        HTTP: 'http://kapi-web.wanggang.mofanglicai.com.cn:10080',
        WS: 'ws://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
    },
    ll: {
        HTTP: 'http://kapi-web.ll.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
    },
    hjq: {
        HTTP: 'http://kmapi.huangjianquan.mofanglicai.com.cn:10080',
    },
};
export default SERVER_URL[env];
