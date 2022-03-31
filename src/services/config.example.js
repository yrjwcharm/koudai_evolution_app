/*
 * @Date: 2020-11-06 16:22:50
 * @Author: yhc
 * @LastEditors: dx
 * @LastEditTime: 2022-03-24 14:52:00
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
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
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
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    hjq: {
        HTTP: 'http://kmapi.huangjianquan.mofanglicai.com.cn:10080',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    hmm: {
        HTTP: 'http://kapi-web.hmm.mofanglicai.com.cn:10080/',
        WS: 'ws://192.168.88.68:39503',
        IMApi: 'http://kapi-im.lengxiaochu.mofanglicai.com.cn:10080/',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    test2: {
        HTTP: 'http://kapi-mapi2.yitao2.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    lixiaoguang: {
        HTTP: 'http://kapi-web.lixiaoguang.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    mayue: {
        HTTP: 'http://kapiweb.mayue.mofanglicai.com.cn:10080',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
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
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    test3: {
        HTTP: 'http://kapi-web.shengyitao3.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    wcy: {
        HTTP: 'http://kapi-web.wangchunyan.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
    liuchao: {
        HTTP: 'http://kapi-web.liuchao01.mofanglicai.com.cn:10080/',
        WS: 'ws://kapi-im.yitao.mofanglicai.com.cn:39503/',
        IMApi: 'http://kapi-im.yitao.mofanglicai.com.cn:10080',
        H5: 'http://koudai-evolution-h5.yitao.mofanglicai.com.cn',
    },
};
const baseURL = SERVER_URL[env];
export {env, SERVER_URL, baseURL};
