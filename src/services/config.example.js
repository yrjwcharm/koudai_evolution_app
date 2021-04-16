/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-16 23:09:43
 * @Description:环境
 */
const env = 'online'; //默认
const SERVER_URL = {
    online: {
        // 正式环境
        HTTP: 'https://kapi-web.licaimofang.com/',
        WS: 'wss://kapi-im-ws.licaimofang.com/',
        IMApi: 'https://kapi-im.licaimofang.com',
        H5: 'https://evolution-h5.licaimofang.com',
    },
    pre2: {
        HTTP: 'https://kapi-web-kp2.licaimofang.com/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com',
        IMApi: 'https://kapi-im-kp2.licaimofang.com',
        H5: 'http://evolution-h5-kp2.licaimofang.com',
    },
    test: {
        HTTP: 'http://kapi-web.yitao.mofanglicai.com.cn:10080/',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
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
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    wg: {
        HTTP: 'http://kapi-web.wanggang.mofanglicai.com.cn:10080',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn',
    },
    ll: {
        HTTP: 'http://kapi-web.ll.mofanglicai.com.cn:10080/',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
    },
    hjq: {
        HTTP: 'http://kmapi.huangjianquan.mofanglicai.com.cn:10080',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
    },
};

export default SERVER_URL[env];
