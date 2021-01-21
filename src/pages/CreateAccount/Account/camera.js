/*
 * @Date: 2021-01-18 20:37:31
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 11:25:35
 * @Description: 相机扫描
 */
import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { px as px2dp, deviceWidth as width, deviceHeight as height, px } from '../../../utils/appUtil'
const color = '#61A8FF'
export default class camera extends Component {
    render() {
        return (
            <View style={{flex:1}}> 
                  <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    captureAudio={false}
                    autoFocus={RNCamera.Constants.AutoFocus.on}/*自动对焦*/
                    style={{width,height}}
                    type={RNCamera.Constants.Type.back}/*切换前后摄像头 front前back后*/
                    flashMode={RNCamera.Constants.FlashMode.off}/*相机闪光模式*/
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                      }}
                ></RNCamera>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                    <View style={{ height: px2dp(120), backgroundColor: 'rgba(30, 31, 32, 0.8)' }}>
                         <Text style={{ fontSize: px2dp(16),textAlign:'center', marginTop: px2dp(80),color:'#fff' }}>请将身份证放在扫描框内</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ height: px2dp(186), width: (width - px2dp(300)) / 2, backgroundColor: 'rgba(30, 31, 32, 0.8)' }} />
                        <View style={{ height: px2dp(186), width: px2dp(300) }} >
                            <View style={{ position: 'absolute', left: 0, top: 0 }}>
                                <View style={{ height: 2, width: px2dp(40), backgroundColor: color }} />
                                <View style={{ height: px2dp(40), width: 2, backgroundColor: color }} />
                            </View>
                            <View style={{ position: 'absolute', right: 1, top: -1, transform: [{ rotate: '90deg' }] }}>
                                <View style={{ height: 2, width: px2dp(40), backgroundColor: color }} />
                                <View style={{ height: px2dp(40), width: 2, backgroundColor: color }} />
                            </View>
                            <View style={{ position: 'absolute', left: 1, bottom: -1, transform: [{ rotateZ: '-90deg' }] }}>
                                <View style={{ height: 2, width: px2dp(40), backgroundColor: color }} />
                                <View style={{ height: px2dp(40), width: 2, backgroundColor: color }} />
                            </View>
                            <View style={{ position: 'absolute', right: 0, bottom: 0, transform: [{ rotateZ: '180deg' }] }}>
                                <View style={{ height: 2, width: px2dp(40), backgroundColor: color }} />
                                <View style={{ height: px2dp(40), width: 2, backgroundColor: color }} />
                            </View>

                        </View>
                        <View style={{ height: px2dp(186), width: (width - px2dp(300)) / 2, backgroundColor: 'rgba(30, 31, 32, 0.8)' }} />
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'rgba(30, 31, 32, 0.8)',  alignItems: 'center' }} >
                       
                    </View>
                </View>
            </View>
        )
    }
}

