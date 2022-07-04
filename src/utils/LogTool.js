/*
 * @Date: 2021-02-23 10:29:30
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-04 12:06:05
 * @Description:埋点
 *
 */
import http from '../services';
const sUrl = 'https://tj.licaimofang.com/v.gif';
const _ts = 0;
const LogTool = (event, ctrl, oid, pid, ref, staytime, tag) => {
    var _params = {},
        st = new Date().getTime();

    if ((st - _ts) / 1000 < 1) {
        //避免重复发送
        return false;
    }
    _params.event = event !== undefined ? event : 'click';
    setTimeout(() => {
        _params.pageid = pid || global.previousRoutePageId || global.currentRoutePageId || ''; //点击事件的pid是当前页面的 注意判断按钮是否是跳转，如果不跳转取当前页面的pid
        _params.ref = ref !== undefined ? ref : ''; //点击事件不传ref
    });
    _params.staytime = staytime !== undefined ? staytime : ''; //页面停留时间
    _params.ctrl = ctrl !== undefined ? ctrl : ''; //当前页面控件标识
    _params.oid = oid !== undefined ? oid : ''; //当前页面子控件唯一标识
    _params.tag = tag !== undefined ? tag : ''; //特殊标记 abtest
    //为了兼容新增字段
    if (typeof event === 'object') {
        _params = {..._params, ...event};
    }
    setTimeout(() => {
        // if (__DEV__) {
        //     return;
        // }
        http.get(sUrl, _params);
        global.previousRoutePageId = '';
    }, 200);
};
global.LogTool = LogTool;
