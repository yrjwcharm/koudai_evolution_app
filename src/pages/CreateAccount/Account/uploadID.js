/*
 * @Date: 2021-01-18 10:27:39
 * @Author: yhc
 * @LastEditors: yhc
 * @LastEditTime: 2021-01-19 11:42:22
 * @Description:上传身份证
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { px, deviceWidth, requestExternalStoragePermission } from '../../../utils/appUtil';
import { Colors, Font } from '../../../common/commonStyle';
import { FixedButton } from '../../../components/Button';
import { launchImageLibrary } from 'react-native-image-picker';
import { RNCamera } from 'react-native-camera'
import { Modal } from '../../../components/Modal'
export class uploadID extends Component {
    state = {
        canClick: true,
        avatarSource: {},
    }

    // 选择图片或相册
    onClickChoosePicture = async () => {
        const options = {
            maxWidth: 100,
            maxHeight: 100,
        };
        try {
            let res = await requestExternalStoragePermission()
            console.log(res)
        } catch (err) {
            console.warn(err);
        }
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    avatarSource: source,
                });
            }
        });
    }

    jumpPage = () => {
        // 从相机中选择
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
                .then(res => {
                    if (res !== 'granted') {
                        Modal.show({
                            content: '相机权限没打开,请在手机的“设置”选项中,允许访问您的摄像头'
                        })
                    }
                    else {
                        this.props.navigation.navigate('Camera')

                    };
                });
        } else {
            this.props.navigation.navigate('Camera')
        }

    }
    render() {
        const { canClick } = this.state
        return (
            <View style={styles.con}>
                <Text style={styles.text}> 根据反洗钱法律法规及证监会要求，需要您上传身份证照片，请如实完善身份信息 </Text>
                <TouchableOpacity onPress={() => this.onClickChoosePicture()}>
                    <Image source={require('../../../assets/img/account/Id1.png')} style={styles.id_image} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.jumpPage}>
                    <Image source={require('../../../assets/img/account/Id2.png')} style={styles.id_image} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>上传要求</Text>
                    <Image
                        style={styles.tip_img}
                        source={require('../../../assets/img/account/idTip.png')}
                    />
                </View>
                <FixedButton title={'下一步'} disabled={canClick} onPress={() => {
                    this.jumpPage('BankInfo')
                }} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    con: {
        paddingHorizontal: px(16),
        backgroundColor: '#fff',
        flex: 1,
    },
    text: {
        color: Colors.darkGrayColor,
        fontSize: Font.textH3,
        lineHeight: px(17),
        textAlign: 'center',
        marginVertical: px(20)
    },
    title: {
        fontSize: Font.textH1,
        fontWeight: '500'
    },
    id_image: {
        height: px(190),
        width: deviceWidth - px(32),
        resizeMode: 'contain',
        marginBottom: px(14),
    },

})
export default uploadID;
