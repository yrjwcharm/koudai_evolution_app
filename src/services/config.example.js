/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-01-19 21:26:22
 * @Description:环境
 */
const env = 'onlinessl'; //默认
const SERVER_URL = {
    onlinessl: {
        // 正式环境
        HTTP: 'https://kapi-websi.licaimofang.cn/',
        WS: 'wss://kapi-im-ws.licaimofang.cn/',
        IMApi: 'https://kapi-im.licaimofang.cn',
        IMApiSsl: 'https://kapi-imsi.licaimofang.cn',
        H5: 'https://edu.licaimofang.cn',
    },
    online: {
        // 正式环境
        HTTP: 'https://kapi-web.licaimofang.com/',
        WS: 'wss://kapi-im-ws.licaimofang.com/',
        IMApi: 'https://kapi-im.licaimofang.com',
        H5: 'https://edu.licaimofang.cn',
    },
    online1: {
        // 正式环境1
        HTTP: 'https://kapi-web.licaimofang.cn/',
        WS: 'wss://kapi-im-ws.licaimofang.cn/',
        IMApi: 'https://kapi-im.licaimofang.cn',
        H5: 'https://edu.licaimofang.cn',
    },
    online2: {
        HTTP: 'https://47.96.8.20/',
        WS: 'https://47.97.249.88:30152/',
        IMApi: 'https://47.97.249.88:30151',
        H5: 'https://47.97.249.88:30181',
    },
    pre2ssl: {
        HTTP: 'https://kweb2mtls.licaimofang.com/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com',
        IMApi: 'https://kim2mtls.licaimofang.com',
        H5: 'https://evolution-h5-kp2.licaimofang.com',
    },
    pre1: {
        HTTP: 'https://kapi-web-kp1.licaimofang.com/',
        WS: 'wss://kapi-im-ws-kp1.licaimofang.com',
        IMApi: 'https://kapi-im-kp1.licaimofang.com',
        H5: 'https://evolution-h5-kp1.licaimofang.com',
    },
    pre2: {
        HTTP: 'https://kapi-web-kp2.licaimofang.com/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com',
        IMApi: 'https://kapi-im-kp2.licaimofang.com',
        H5: 'https://evolution-h5-kp2.licaimofang.com',
    },
    pre3: {
        HTTP: 'https://kapi-web-kp3.licaimofang.com/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com',
        IMApi: 'https://kapi-im-kp2.licaimofang.com',
        H5: 'https://evolution-h5-kp3.licaimofang.com',
    },
    test: {
        HTTP: 'http://kapi-web.yitao.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
    develop: {
        HTTP: 'http://kapi-web.bae.mofanglicai.com.cn:10080/',
        WS: 'wss://kapi-im-ws-kp2.licaimofang.com/',
        IMApi: 'http://kapi-im-kp2.licaimofang.com',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn:10080',
    },
    lxc: {
        HTTP: 'http://kapi-web.lengxiaochu.mofanglicai.com.cn:10080/',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn:10080',
    },
    wg: {
        HTTP: 'http://kapi-web.wanggang.mofanglicai.com.cn:10080',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.bae.mofanglicai.com.cn:10080',
    },
    ll: {
        HTTP: 'http://kapi-web.ll.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
    hjq: {
        HTTP: 'http://kmapi.huangjianquan.mofanglicai.com.cn:10080',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
    hmm: {
        HTTP: 'http://kapi-web.hmm.mofanglicai.com.cn:10080/',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
    test2: {
        HTTP: 'http://kapi-mapi2.yitao2.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
    lixiaoguang: {
        HTTP: 'http://kapi-web.lixiaoguang.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
    mayue: {
        HTTP: 'http://kapiweb.mayue.mofanglicai.com.cn:10080',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
    ssltest: {
        // 正式环境
        HTTP: 'https://kapi-web.yitao2.mofanglicai.com.cn:39503',
        WS: 'wss://kapi-im-ws.licaimofang.com/',
        IMApi: 'https://kapi-im.licaimofang.com',
        H5: 'https://evolution-h5.licaimofang.com',
    },
    jhy: {
        HTTP: ' http://kapi-web.jinhongyu.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn:10080',
    },
};
const baseURL = SERVER_URL[env];
export {env, SERVER_URL, baseURL};
