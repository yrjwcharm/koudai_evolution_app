/*
 * @Date: 2021-12-21 10:27:48
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-12-21 11:39:23
 * @Description: 
 */
package com.licaimofang.readcard.utils;

import android.app.Activity;

import com.eidlink.face.sdk.EidLinkSdkFactory;
import com.eidlink.face.sdk.IdocrFaceSdkManager;
import com.eidlink.face.sdk.OnIdocrGetResultListener;
import com.eidlink.face.sdk.bean.EidInitParams;
import com.eidlink.face.sdk.bean.RequestParams;


/**
 * @author zl
 * @create 2021/5/15
 * @description:
 */
public class FaceUtil {
    public static void cloudReaderFace(Activity activity, EidInitParams eidInitParams,RequestParams requestParams, OnIdocrGetResultListener listener){


        IdocrFaceSdkManager faceManager = EidLinkSdkFactory.getSdkManager(eidInitParams);
        faceManager.setModel(false, false, true, false, 1);
        faceManager.start(activity, requestParams, new OnIdocrGetResultListener() {
            @Override
            public void onSuccess(String reqId) {
                listener.onSuccess(reqId);
            }

            @Override
            public void onFailed(String errorCode, String message) {
                listener.onFailed(errorCode,message);
            }
        });
    }
}
