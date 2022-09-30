# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keep class cn.jiguang.imui.** { *; }
-keep class com.tencent.mm.opensdk.** { *; }
-dontoptimize
-dontpreverify

-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

-dontwarn cn.jpush.**
-keep class cn.jpush.** { *; }
-keep class * extends cn.jpush.android.helpers.JPushMessageReceiver { *; }

-dontwarn cn.jiguang.**
-keep class cn.jiguang.** { *; }
-keep class com.eidlink.**{*;}
-keep class net.sf.**{*;}
-keep class org.eid_bc.**{*;}
-keep class com.licaimofang.readcard.bean** { *; }

#video-qa
-dontwarn com.ttd.qarecordlib.**
-keep class com.ttd.qarecordlib.**{*;}
-keep interface com.ttd.qarecordlib.**{*;}
-keep class com.ttd.frame4open.**{*;}
-keep interface com.ttd.frame4open.**{*;}
-keep class com.ttd.call.**{*;}
-keep interface com.ttd.call.**{*;}
-keep class com.iflytek.**{*;}
-keep interface com.iflytek.**{*;}
-keep class io.agora.rtc.**{*;}
-keep interface io.agora.rtc.**{*;}

#signsdk
-dontwarn com.ttd.signstandardsdk.**
-keep class com.ttd.signstandardsdk.** { *;}
-keep interface com.ttd.signstandardsdk.** { *; }
# Retrofit
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions
-keep class org.ligboy.retrofit2.**{*;}
#rxjava
-dontwarn rx.**
-keep class rx.** { *; }
-keep class io.reactivex.**{*;}
# okhttp
-dontwarn okio.**
-keep class okio.**
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }
-dontwarn javax.annotation.Nullable
-dontwarn javax.annotation.ParametersAreNonnullByDefault
#fastjson
-dontwarn com.alibaba.fastjson.**
-keep class com.alibaba.fastjson.** { *; }
-keepattributes Signature
-dontnote org.apache.http.**
-dontnote android.net.**
#glide
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
**[] $VALUES;
public *;
}
#rxbus
-dontwarn com.hwangjr.rxbus.**
-keep class com.hwangjr.rxbus.** { *;}
-keep interface com.hwangjr.rxbus.** { *; }
#ttd tools
-dontwarn com.ttd.tools.**
-keep class com.ttd.tools.** { *;}
-keep interface com.ttd.tools.** { *; }
#rxlifecycle
-dontwarn com.trello.rxlifecycle.**
-keep class com.trello.rxlifecycle.** { *;}
-keep interface com.trello.rxlifecycle.** { *; }
#fragmentation
-dontwarn me.yokeyword.fragmentation.**
-keep class me.yokeyword.fragmentation.** { *;}
-keep interface me.yokeyword.fragmentation.** { *; }
#BaseRecyclerViewAdapterHelper
-dontwarn com.chad.library.**
-keep class com.chad.library.** { *;}
-keep interface com.chad.library.** { *; }
