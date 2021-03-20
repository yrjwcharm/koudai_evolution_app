/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-19 17:04:06
 * @Description:环境
 */
const env = 'develop'; //默认
const SERVER_URL = {
    online: {
        // 正式环境
        HTTP: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
    },
    develop: {
        HTTP: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
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
