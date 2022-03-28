/*
 * @Date: 2022-03-28 14:08:46
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-03-28 16:40:30
 * @Description: 直播落地页
 */
import React, {useEffect, useState} from 'react';
import {AppState, Image, ScrollView, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {openSettings, checkNotifications, requestNotifications} from 'react-native-permissions';
import {Colors, Space} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {Modal} from '../../components/Modal';
import NavBar from '../../components/NavBar';
import http from '../../services';
import {deviceWidth, isIphoneX, px} from '../../utils/appUtil';

export default ({navigation, route}) => {
    const [button, setButton] = useState({});
    const [image, setImage] = useState({});

    useEffect(() => {
        route.params.land_image &&
            Image.getSize(
                route.params.land_image,
                (width, height) => {
                    setImage({
                        height: (deviceWidth * height) / width,
                        url: route.params.land_image,
                    });
                },
                (error) => {
                    console.log(error);
                }
            );
        setButton({
            disabled: route.params.reserved,
            title: route.params.reserved ? '已预约' : '预约',
        });
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 监听APP前后台状态变化
    const _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active' && !button.disabled) {
            _checkNotifications(
                () => {
                    postReserve(() => {
                        setButton({
                            disabled: true,
                            title: '已预约',
                        });
                    });
                },
                () => {
                    AppState.removeEventListener('change', _handleAppStateChange);
                    setButton({
                        disabled: false,
                        title: '预约',
                    });
                }
            );
        }
    };
    // 检查推送权限是否打开
    const _checkNotifications = (sucess, fail) => {
        checkNotifications().then(({status}) => {
            if (status == 'denied' || status == 'blocked') {
                fail();
            } else {
                sucess();
            }
        });
    };
    // 上报预约
    const postReserve = (sucess) => {
        http.post('/live/reserve/202202015', {id: route.params.id}).then((res) => {
            if (res.code === '000000') {
                AppState.removeEventListener('change', _handleAppStateChange);
                sucess();
                //弹窗
                if (res.result?.title) {
                    Modal.show({title: res.result?.title, content: res.result?.desc});
                }
            }
        });
    };
    // 点击预约
    const subscription = () => {
        _checkNotifications(
            () => {
                postReserve(() => {
                    setButton({
                        disabled: true,
                        title: '已预约',
                    });
                });
            },
            () => {
                openLink();
            }
        );
    };
    // 请求推送权限
    const openLink = () => {
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {
            if (status == 'granted') {
                postReserve(() => {
                    setButton({
                        disabled: true,
                        title: '已预约',
                    });
                });
            } else {
                blockCal();
            }
        });
    };
    //权限提示弹窗
    const blockCal = () => {
        Modal.show({
            title: '权限申请',
            content: '我们将在直播前10分钟为您推送提醒，请开启通知权限',
            confirm: true,
            confirmText: '前往',
            confirmCallBack: () => {
                AppState.addEventListener('change', _handleAppStateChange);
                openSettings().catch(() => console.warn('cannot open settings'));
            },
        });
    };

    return (
        <View style={styles.container}>
            <NavBar
                rightIcon="x"
                title={''}
                fontStyle={{color: '#fff', fontSize: 20}}
                rightPress={() => {
                    navigation.goBack();
                }}
                style={{backgroundColor: 'transparent', position: 'absolute', zIndex: 20}}
            />
            <ScrollView bounces={false} style={{flex: 1}}>
                {image.url ? (
                    <FastImage source={{uri: image.url}} style={{width: deviceWidth, height: image.height}} />
                ) : null}
            </ScrollView>
            {button.title ? (
                <Button disabled={button.disabled} onPress={subscription} style={styles.button} title={button.title} />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    button: {
        position: 'absolute',
        right: Space.padding,
        bottom: isIphoneX() ? 34 : px(16),
        left: Space.padding,
    },
});
