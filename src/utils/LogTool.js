/*
 * @Date: 2021-02-23 10:29:30
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-02-23 18:22:14
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
    _params.ctrl = ctrl || ''; //当前页面控件标识
    _params.oid = oid || ''; //当前页面子控件唯一标识
    _params.staytime = staytime || ''; //页面停留时间
    _params.tag = tag || ''; //特殊标记 abtest
    _params.event = event || 'click';
    setTimeout(() => {
        _params.pageid = pid || global.previousRouteName || ''; //点击事件的pid是当前页面的
        _params.ref = ref || ''; //点击事件不传ref
    });

    setTimeout(() => {
        http.get(sUrl, _params);
    }, 200);
};
global.LogTool = LogTool;
