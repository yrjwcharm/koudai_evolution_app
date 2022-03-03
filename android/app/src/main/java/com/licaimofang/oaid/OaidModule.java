package com.licaimofang.oaid;

import android.util.Log;

import androidx.annotation.NonNull;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import org.jetbrains.annotations.NotNull;

import com.github.gzuliyujiang.oaid.DeviceIdentifier;
import com.github.gzuliyujiang.oaid.DeviceID;

public class OaidModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    public OaidModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return "OAIDModule";
    }

    @ReactMethod
    public void getOaid(Callback successCallback){
        DeviceIdentifier.register(getCurrentActivity().getApplication());
        Boolean supported = DeviceID.supportedOAID(reactContext);
       if(supported){
           String _oaid = DeviceIdentifier.getOAID(reactContext);
           successCallback.invoke(_oaid);
       }else{
           successCallback.invoke(null);
       }
    }
}
