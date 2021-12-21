package com.licaimofang.readcard;

import android.Manifest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;


import com.eidlink.face.sdk.OnIdocrGetResultListener;
import com.eidlink.face.sdk.bean.EidInitParams;
import com.eidlink.face.sdk.bean.RequestParams;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.licaimofang.readcard.utils.BitmapUtil;
import com.licaimofang.readcard.utils.FaceUtil;
import com.licaimofang.readcard.utils.PermissionsUtils;

import org.jetbrains.annotations.NotNull;


public class FaceLivingModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static String IP_FACE;
    private static String APPID_FACE;
    private static String PORT_FACE;
    private final String[] permissions;

    public FaceLivingModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        permissions = new String[]{Manifest.permission.CAMERA};

    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return "FaceLivingManager";
    }

    /**
     *
     * @param appId 令牌云分配的appId
     * @param ip 令牌云分配的Ip
     * @param port 令牌云分配的port
     */
    @ReactMethod
    public void init(String appId, String ip, String port) {
        APPID_FACE = appId;
        IP_FACE = ip;
        PORT_FACE = port;
    }

    /**
     *
     * @param reqId 通过nfc读卡sdk获取到的reqId
     */
    @ReactMethod
    public void showFaceLivingActivity(String reqId) {
        EidInitParams eidInitParams = new EidInitParams(IP_FACE, PORT_FACE);
        RequestParams requestParams = new RequestParams(APPID_FACE, reqId);
        FaceUtil.cloudReaderFace(ActivityNavigator.navigator().getLastActivity(), eidInitParams, requestParams, new OnIdocrGetResultListener() {
            @Override
            public void onSuccess(String msg) {
                WritableMap params = Arguments.createMap();
                params.putString("reqId", msg);
                sentMessageToJs(reactContext, "faceDetectSuccess", params);

            }

            @Override
            public void onFailed(String s, String s1) {
                WritableMap params = Arguments.createMap();
                params.putString("errorCode", s);
                params.putString("errorMessage", s1);
                sentMessageToJs(reactContext, "faceDetectFailed", params);
            }

        });
    }

    @ReactMethod
    public void applyCameraPermission(Callback passPermissons,Callback forbitPermissons){
        PermissionsUtils.getInstance().chekPermissions(ActivityNavigator.navigator().getLastActivity(), permissions, new PermissionsUtils.IPermissionsResult() {
            @Override
            public void passPermissons() {
                passPermissons.invoke();
            }

            @Override
            public void forbitPermissons() {
                forbitPermissons.invoke();
            }
        });
    }
    /**
     * 发送消息事件到js页面
     *
     * @param reactContext ReactContext 对象
     * @param eventName    事件名称
     * @param params       事件携带的参数
     */
    private void sentMessageToJs(ReactContext reactContext,
                                 String eventName,
                                 @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
