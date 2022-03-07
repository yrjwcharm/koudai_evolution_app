/*
 * @Date: 2022-01-17 19:32:47
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-03-04 18:58:36
 * @Description: 
 */
package com.licaimofang.app;
import android.content.Intent;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
import com.facebook.react.ReactActivity;
import android.os.Build;
import android.util.Log;
import android.os.Handler;
import android.text.TextUtils;
import android.webkit.WebView;
import androidx.annotation.NonNull;
import com.licaimofang.readcard.ActivityNavigator;
import com.licaimofang.readcard.utils.PermissionsUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;
public class MainActivity extends ReactActivity {
    public static final String TAG = "DemoHelper12";
    /**消息Id**/
    private static final String KEY_MSGID = "msg_id";
    /**该通知的下发通道**/
    private static final String KEY_WHICH_PUSH_SDK = "rom_type";
    /**通知标题**/
    private static final String KEY_TITLE = "n_title";
    /**通知内容**/
    private static final String KEY_CONTENT = "n_content";
    /**通知附加字段**/
    private static final String KEY_EXTRAS = "n_extras";


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "EvolutionApp";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    //  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) { //webview 调试
    //     WebView.setWebContentsDebuggingEnabled(true);
    // }
      SplashScreen.show(this,R.style.SplashScreenTheme);  // here
      super.onCreate(savedInstanceState);
      handleOpenClick(getIntent());
      ActivityNavigator.navigator().addActivity(this);
  }
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.v(TAG,"onNewIntent");
        handleOpenClick(intent);
    }
    private void handleOpenClick(Intent intent) {
        Log.v(TAG, "handleOpenClick");
        String data = null;
        //获取华为平台附带的jpush信息
        if (intent.getData() != null) {
            data = intent.getData().toString();
        }
        //获取fcm、oppo、vivo、华硕、小米平台附带的jpush信息
        if (TextUtils.isEmpty(data) && intent.getExtras() != null) {
            data = intent.getExtras().getString("JMessageExtra");
        }
        Log.v(TAG, "获取jpush信息");
        if (TextUtils.isEmpty(data)) return;
        Log.v(TAG, "数据不为空");
        try {
            JSONObject jsonObject = new JSONObject(data);
            String msgId = jsonObject.optString(KEY_MSGID);
            byte whichPushSDK = (byte) jsonObject.optInt(KEY_WHICH_PUSH_SDK);
            String title = jsonObject.optString(KEY_TITLE);
            String content = jsonObject.optString(KEY_CONTENT);
            String extras = jsonObject.optString(KEY_EXTRAS);

            WritableMap map = Arguments.createMap();
            map.putString("msgId", msgId);
            map.putString("whichPushSDK", whichPushSDK + getPushSDKName(whichPushSDK));
            map.putString("title", title);
            map.putString("content", content);
            map.putString("extras", extras);
            sendEvent("jdeeplink", map);

            //上报点击事件，厂商通道的点击数据需要用户调用该方法上报
            // JPushInterface.reportNotificationOpened(this, msgId, whichPushSDK);
        } catch (JSONException e) {
            Log.w("", "parse notification error");
        }
    }

    private String getPushSDKName(byte whichPushSDK) {
        String name;
        switch (whichPushSDK) {
            case 0:
                name = "jpush";
                break;
            case 1:
                name = "xiaomi";
                break;
            case 2:
                name = "huawei";
                break;
            case 3:
                name = "meizu";
                break;
            case 4:
                name = "oppo";
                break;
            case 5:
                name = "vivo";
                break;
            case 6:
                name = "asus";
                break;
            case 8:
                name = "fcm";
                break;
            default:
                name = "jpush";
        }
        return name;
    }
    private ReactContext mainreactContext;
    public void sendEvent(String eventName, WritableMap params) {
        Log.v(TAG, "sendEvent");
        if (mainreactContext == null) {
            //可以得到mainreactContext值
            mainreactContext = this.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        }
        if (mainreactContext != null) {
            Log.v(TAG, "mainreactContext != null");
            mainreactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        } else {
            //js模块此时没有加载完成，延时400毫秒
            //主线程中调用：
            Log.v(TAG, "mainreactContext = null");
            new Handler().postDelayed(() -> sendEvent(eventName, params), 2000);
        }
    }
  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    //就多一个参数this
    PermissionsUtils.getInstance().onRequestPermissionsResult(this, requestCode, permissions, grantResults);
  }


}
