/*
 * @Date: 2021-01-18 20:37:31
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-03-24 10:46:39
 * @Description: 相机扫描
 */
import React, {Component} from 'react';
import {Text, View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {deviceWidth as width, deviceHeight as height, px} from '../../../utils/appUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import _ from 'lodash';
const color = '#61A8FF';
export default class camera extends Component {
    takePicture = async () => {
        if (this.camera) {
            const options = {quality: 0.5};
            const data = await this.camera.takePictureAsync(options);
            DeviceEventEmitter.emit('EventType', data.uri);
            this.props.navigation.goBack();
        }
    };
    render() {
        return (
            <View style={{flex: 1}}>
                <RNCamera
                    ref={(ref) => {
                        this.camera = ref;
                    }}
                    style={{
                        height: px(186),
                        width: px(300),
                        marginTop: px(120),
                        marginLeft: (width - px(300)) / 2,
                    }}
                    captureAudio={false}
                    autoFocus={RNCamera.Constants.AutoFocus.on} /*自动对焦*/
                    type={RNCamera.Constants.Type.back} /*切换前后摄像头 front前back后*/
                    flashMode={RNCamera.Constants.FlashMode.off} /*相机闪光模式*/
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                />
                <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
                    <View style={{height: px(120), backgroundColor: 'rgba(30, 31, 32, 0.8)'}}>
                        <Text style={{fontSize: px(16), textAlign: 'center', marginTop: px(80), color: '#fff'}}>
                            请将身份证放在扫描框内
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <View
                            style={{
                                height: px(186),
                                width: (width - px(300)) / 2,
                                backgroundColor: 'rgba(30, 31, 32, 0.8)',
                            }}
                        />
                        <View style={{height: px(186), width: px(300)}}>
                            <View style={{position: 'absolute', left: 0, top: 0}}>
                                <View style={{height: 2, width: px(40), backgroundColor: color}} />
                                <View style={{height: px(40), width: 2, backgroundColor: color}} />
                            </View>
                            <View style={{position: 'absolute', right: 1, top: -1, transform: [{rotate: '90deg'}]}}>
                                <View style={{height: 2, width: px(40), backgroundColor: color}} />
                                <View style={{height: px(40), width: 2, backgroundColor: color}} />
                            </View>
                            <View style={{position: 'absolute', left: 1, bottom: -1, transform: [{rotateZ: '-90deg'}]}}>
                                <View style={{height: 2, width: px(40), backgroundColor: color}} />
                                <View style={{height: px(40), width: 2, backgroundColor: color}} />
                            </View>
                            <View style={{position: 'absolute', right: 0, bottom: 0, transform: [{rotateZ: '180deg'}]}}>
                                <View style={{height: 2, width: px(40), backgroundColor: color}} />
                                <View style={{height: px(40), width: 2, backgroundColor: color}} />
                            </View>
                        </View>
                        <View
                            style={{
                                height: px(186),
                                width: (width - px(300)) / 2,
                                backgroundColor: 'rgba(30, 31, 32, 0.8)',
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={_.debounce(this.takePicture, 500)}
                        style={{position: 'absolute', zIndex: 100, bottom: px(160), left: width / 2 - px(30)}}>
                        <Icon name={'camerao'} size={px(60)} color="#fff" />
                    </TouchableOpacity>
                    <View style={{flex: 1, backgroundColor: 'rgba(30, 31, 32, 0.8)', alignItems: 'center'}} />
                </View>
            </View>
        );
    }
}
