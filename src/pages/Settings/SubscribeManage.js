import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '~/utils/appUtil';
import * as WeChat from 'react-native-wechat-lib';
import Toast from '~/components/Toast';
import Clipboard from '@react-native-community/clipboard';

const SubscribeManage = () => {
    const copyToFollow = () => {
        Clipboard.setString('123');
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                try {
                    WeChat.openWXApp();
                } catch (e) {
                    if (e instanceof WeChat.WechatError) {
                        console.error(e.stack);
                    } else {
                        throw e;
                    }
                }
            } else {
                Toast.show('请安装微信');
            }
        });
    };

    const handlerCellSwitch = (val) => {
        console.log(val);
    };

    return (
        <View style={styles.container}>
            <View style={styles.topHintWrap}>
                <Text style={styles.topHintText}>可通过APP和微信公众号查看买卖信号提醒消息</Text>
            </View>
            <View style={styles.copyCell}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/07/wx-icon.png'}}
                    style={styles.wxImg}
                />
                <Text style={styles.copyText}>消息将通过“理财魔方”公众号发送</Text>
                <TouchableOpacity activeOpacity={0.8} style={styles.copyBtn} onPress={copyToFollow}>
                    <Text style={styles.copyBtnText}>复制去关注</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.switchCells}>
                {[1, 2, 3].map((item, idx) => (
                    <View key={idx} style={[styles.switchCell, idx > 0 ? styles.borderTop : {}]}>
                        <View style={styles.switchCellLeft}>
                            <Text style={styles.switchCellTitle}>全部直属</Text>
                            <Text style={styles.switchCellDesc}>一键订阅</Text>
                        </View>
                        <View>
                            <Switch
                                ios_backgroundColor={'#CCD0DB'}
                                thumbColor={'#fff'}
                                trackColor={{false: '#CCD0DB', true: '#0051CC'}}
                                value={true}
                                onChange={handlerCellSwitch}
                            />
                        </View>
                    </View>
                ))}
            </View>
            <View style={{height: px(50)}} />
        </View>
    );
};

export default SubscribeManage;

const styles = StyleSheet.create({
    container: {},
    topHintWrap: {
        paddingVertical: px(12),
        paddingHorizontal: px(16),
    },
    topHintText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
    },
    copyCell: {
        backgroundColor: '#fff',
        padding: px(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    wxImg: {
        width: px(32),
        height: px(32),
    },
    copyText: {
        marginLeft: px(8),
        fontSize: px(14),
        lineHeight: px(20),
        color: '#3d3d3d',
    },
    copyBtn: {
        marginLeft: px(10),
        backgroundColor: '#0051CC',
        paddingVertical: px(6),
        paddingHorizontal: px(12),
        borderRadius: px(6),
    },
    copyBtnText: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#fff',
    },
    switchCells: {
        marginTop: px(12),
    },
    switchCell: {
        backgroundColor: '#fff',
        paddingHorizontal: px(16),
        paddingVertical: px(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    switchCellLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchCellTitle: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#121d3a',
    },
    switchCellDesc: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#9aa0b1',
        marginLeft: px(5),
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#E9EAEF',
    },
});
