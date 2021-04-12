/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-12 12:07:30
 * @Description:环境
 */
const env = 'test'; //默认
const SERVER_URL = {
    online: {
        // 正式环境
        HTTP: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    pre2: {
        HTTP: 'https://kapi-web-kp2.licaimofang.com/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://evolution-h5-kp2.licaimofang.com',
    },
    test: {
        HTTP: 'http://kapi-web.yitao.mofanglicai.com.cn:10080/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    develop: {
        HTTP: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    lxc: {
        HTTP: 'http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    wg: {
        HTTP: 'http://kapi-web.wanggang.mofanglicai.com.cn:10080',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    ll: {
        HTTP: 'http://kapi-web.ll.mofanglicai.com.cn:10080/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
    },
    hjq: {
        HTTP: 'http://kmapi.huangjianquan.mofanglicai.com.cn:10080',
    },
};

export default SERVER_URL[env];
