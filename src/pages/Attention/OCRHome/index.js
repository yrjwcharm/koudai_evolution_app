/*
 * @Date: 2022-06-23 19:34:31
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2022-06-27 16:20:30
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, PermissionsAndroid, Platform} from 'react-native';
import React from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import {px} from '~/utils/appUtil';
import {Button} from '~/components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {requestAuth} from '../../../utils/appUtil';
import {Modal} from '../../../components/Modal';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadFile} from './services';
const index = () => {
    // 选择相册
    const handleUpload = async () => {
        try {
            if (Platform.OS == 'android') {
                requestAuth(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, openPicker, blockCal);
            } else {
                requestAuth(PERMISSIONS.IOS.PHOTO_LIBRARY, openPicker, blockCal);
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const openPicker = () => {
        setTimeout(() => {
            launchImageLibrary({quality: 0.5}, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else if (response.assets) {
                    uploadImage(response.assets[0]);
                }
            });
        }, 100);
    };
    const uploadImage = async (data) => {
        const params = {
            ...data,
            name: data.fileName,
        };
        let res = await uploadFile(params);
        console.log(res);
    };
    const blockCal = () => {
        Modal.show({
            title: '权限申请',
            content: '权限没打开,请前往手机的“设置”选项中,允许该权限',
            confirm: true,
            confirmText: '前往',
            confirmCallBack: () => {
                openSettings().catch(() => console.warn('cannot open settings'));
            },
        });
    };
    return (
        <ScrollView style={styles.con}>
            <View style={[Style.flexRow, {alignItems: 'flex-start', marginBottom: px(15)}]}>
                <TouchableOpacity style={{height: px(20), marginTop: px(2), width: px(24)}}>
                    <AntDesign name={'checkcircle'} size={px(14)} color={Colors.btnColor} />
                </TouchableOpacity>
                <View>
                    <Text style={{fontSize: px(14), color: Colors.defaultColor}}>广发多因子灵活配置</Text>
                    <Text style={{fontSize: px(11), color: Colors.lightGrayColor, marginTop: px(4)}}>123455</Text>
                </View>
            </View>
            <Button onPress={handleUpload} />
        </ScrollView>
    );
};

export default index;

const styles = StyleSheet.create({
    con: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        padding: px(16),
    },
    title: {
        fontSize: px(16),
        marginBottom: px(6),
        color: Colors.defaultColor,
        fontWeight: '700',
    },
    title_desc: {
        color: Colors.lightBlackColor,
        lineHeight: px(18),
        fontSize: px(12),
    },
});
