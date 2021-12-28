package com.licaimofang.readcard.utils;


import android.util.Log;

import com.licaimofang.app.BuildConfig;


public class MLog {
    private static final boolean DEBUG = BuildConfig.DEBUG ? true : false;

    public static final void d(String tag, String msg) {
        if (DEBUG) {
            Log.d(tag, msg);
        }
    }

    public static final void e(String tag, String msg) {
        if (DEBUG) {
            Log.e(tag, msg);
        }
    }

    public static void v(String tag, String msg) {
        if (DEBUG) {
            Log.v(tag, msg);
        }
    }
}
