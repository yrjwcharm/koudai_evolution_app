/*
 * @Date: 2020-11-26 18:38:13
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-09 16:42:29
 * @Description:
 */
import actionTypes from '../actionTypes';
import http from '../../services';
import Storage from '../../utils/storage';
export const updateUserInfo = (userInfo) => {
    return {
        type: actionTypes.UserInfo,
        payload: userInfo,
    };
};

export function getUserInfo(repeat = 3) {
    return (dispatch) => {
        http.get('/common/user_info/20210101').then(async (data) => {
            if (data?.code === '000000') {
                dispatch(updateUserInfo(data.result));
            }
            if (!data) {
                let result = await Storage.get('loginStatus');
                let userInfo = {
                    is_login: !!result.access_token,
                };
                dispatch(updateUserInfo(userInfo));
                if (repeat-- > 0) {
                    dispatch(getUserInfo(repeat));
                }
            }
        });
    };
}

export async function isLogin() {
    let res = await Storage.get('loginStatus');
    return res?.access_token.length() > 0;
}

export const updateVerifyGesture = (verifyGesture) => {
    return {
        type: actionTypes.UserInfo,
        payload: {verifyGesture},
    };
};

export function getVerifyGesture(verifyGesture) {
    return (dispatch) => {
        dispatch(updateVerifyGesture(verifyGesture));
    };
}
export function getAppConfig() {
    return (dispatch) => {
        http.get('/mapi/app/config/20210101').then((result) => {
            dispatch(updateUserInfo(result.result));
            //版本更新显示小红点逻辑
            if (global.ver < result?.result?.latest_version) {
                Storage.keys().then((_res) => {
                    if (_res?.length > 0) {
                        let version_list = _res.filter((_item) => {
                            return _item.includes('version');
                        });
                        //查看是否有较上次未更新 更新的版本
                        if (
                            version_list?.length > 0 &&
                            version_list[0]?.slice(7, 12) < result?.result?.latest_version
                        ) {
                            //有更加新的版本 删除本地缓存 显示小红点
                            _res.forEach((item) => {
                                if (item?.includes('version')) {
                                    Storage.delete(item);
                                }
                            });
                        }
                    }
                });
            }
        });
    };
}
