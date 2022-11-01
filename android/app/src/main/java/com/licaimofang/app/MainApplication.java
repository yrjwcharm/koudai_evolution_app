/*
 * @Date: 2020-12-28 11:53:04
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 17:04:48
 * @Description:
 */

package com.licaimofang.app;

import android.app.Application;
import android.content.Context;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.licaimofang.SignEngine.SignPackage;
import com.licaimofang.TtdRecord.RecordPackage;
import com.theweflex.react.WeChatPackage;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import cn.jiguang.plugins.push.JPushModule;
import com.licaimofang.readcard.ReadCardPackage;
import com.licaimofang.oaid.OaidPackage;
import com.ttd.signstandardsdk.Base;
public class MainApplication extends Application implements ReactApplication {
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            packages.add(new WeChatPackage());
            packages.add(new ReadCardPackage());
            packages.add(new OaidPackage());
            packages.add(new SignPackage());
            packages.add(new RecordPackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
        //调用此方法：点击通知让应用从后台切到前台
        JPushModule.registerActivityLifecycle(this);
        Fresco.initialize(this);
        //签署sdk初始化
        Base.initialize(this);
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("com.licaimofang.app.ReactNativeFlipper");
                aClass
                        .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }
}
