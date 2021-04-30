/*
 * @Date: 2021-02-23 10:29:30
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-04-26 12:03:01
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
    _params.event = event || 'click';
    setTimeout(() => {
        _params.pageid = pid || global.previousRoutePageId || global.currentRoutePageId || ''; //点击事件的pid是当前页面的 注意判断按钮是否是跳转，如果不跳转取当前页面的pid
        _params.ref = ref || ''; //点击事件不传ref
    });
    _params.staytime = staytime || ''; //页面停留时间
    _params.ctrl = ctrl || ''; //当前页面控件标识
    _params.oid = oid || ''; //当前页面子控件唯一标识
    _params.tag = tag || ''; //特殊标记 abtest

    setTimeout(() => {
        http.get(sUrl, _params);
        global.previousRoutePageId = '';
    }, 200);
};
global.LogTool = LogTool;
