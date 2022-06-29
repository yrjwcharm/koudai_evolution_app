/*
 * @Date: 2022-06-23 19:34:31
 * @Author: yhc
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-29 21:44:39
 * @Description:
 */
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, PermissionsAndroid, Platform, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Style} from '~/common/commonStyle';
import {PERMISSIONS, openSettings} from 'react-native-permissions';
import {px} from '~/utils/appUtil';
import {Button} from '~/components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {requestAuth} from '../../../utils/appUtil';
import {Modal} from '../../../components/Modal';
import {launchImageLibrary} from 'react-native-image-picker';
import {getInfo, uploadFile} from './services';
import Toast from '~/components/Toast';
import {useDispatch} from 'react-redux';
import {updateFundList} from '~/redux/actions/ocrFundList';
import RenderHtml from '~/components/RenderHtml';
import FitImage from 'react-native-fit-image';
const Index = ({navigation}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState(data);
    const _getData = async () => {
        let res = await getInfo();
        navigation.setOptions({title: res.result?.title || '识图导入'});
        setData(res.result);
    };
    useEffect(() => {
        _getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
        let toast = Toast.showLoading();
        let res = await uploadFile(data, (e) => {
            console.log(e);
        });
        Toast.hide(toast);
        Toast.show(res.message);
        if (res.code === '000000') {
            if (res.result?.type == 'self_select') {
                dispatch(updateFundList({ocrOptionalList: res.result.list}));
                navigation.navigate('ImportOptionalFund');
            } else {
                dispatch(updateFundList({ocrOwernList: res.result.list}));
                navigation.navigate('ImportOwnerFund');
            }
        }
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
            {data?.list?.map((item, index) => (
                <View key={index} style={{marginBottom: px(20)}}>
                    <RenderHtml style={styles.title} html={item.title} />
                    <Text style={styles.title_desc}>{item.content}</Text>
                    {item?.imgUrl ? <FitImage source={{uri: item?.imgUrl}} /> : null}
                </View>
            ))}
            <Button onPress={handleUpload} title="上传图片" />
        </ScrollView>
    );
};

export default Index;

const styles = StyleSheet.create({
    con: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        padding: px(16),
    },
    title: {
        fontSize: px(16),
        color: Colors.defaultColor,
        fontWeight: '700',
    },
    title_desc: {
        color: Colors.lightBlackColor,
        lineHeight: px(18),
        fontSize: px(12),
        marginBottom: px(12),
        marginTop: px(4),
    },
});
