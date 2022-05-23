/*
 * @Date: 2022-05-23 15:43:21
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2022-05-23 16:23:10
 * @Description: 逐项确认
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
    DeviceEventEmitter,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {Colors, Font, Space, Style} from '../../common/commonStyle';
import {Button} from '../../components/Button';
import {useJump} from '../../components/hooks';
import Loading from '../Portfolio/components/PageLoading';
import http from '../../services';
import {isIphoneX, px} from '../../utils/appUtil';
import {debounce} from 'lodash';
import Toast from '../../components/Toast';
import {NativeSignManagerEmitter, MethodObj} from './PEBridge';

export default ({navigation}) => {
    const jump = useJump();
    const [data, setData] = useState({});
    const {button = {}, list = [], desc: tips} = data;

    useEffect(() => {
        const listener = NativeSignManagerEmitter.addListener(MethodObj.signFileSuccess, (res) => {
            http.post('/file_sign/sign_done/20220510', {file_id: res.fileId}).then((resp) => {
                if (resp.code === '000000') {
                    Toast.show(resp.message || '签署成功');
                    navigation.goBack();
                } else {
                    Toast.show(resp.message || '签署失败');
                }
            });
        });
        return () => {
            listener.remove();
        };
    }, []);

    return Object.keys(data).length > 0 ? (
        <View style={styles.container}>
            {button.text ? (
                <Button
                    color="#EDDBC5"
                    disabled={button.avail === 0}
                    disabledColor="#EDDBC5"
                    onPress={() => jump(button.url)}
                    style={styles.button}
                    title={button.text}
                />
            ) : null}
        </View>
    ) : (
        <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Space.padding,
    },
    tips: {
        marginTop: Space.marginVertical,
        fontSize: Font.textH3,
        lineHeight: px(17),
        color: Colors.descColor,
    },
    partBox: {
        marginTop: px(12),
        marginBottom: isIphoneX() ? 34 + px(45) + px(16) : px(45) + px(16) * 2,
        paddingHorizontal: Space.padding,
        borderRadius: Space.borderRadius,
        backgroundColor: '#fff',
    },
    button: {
        position: 'absolute',
        right: px(16),
        bottom: isIphoneX() ? 34 : px(16),
        left: px(16),
        backgroundColor: '#D7AF74',
    },
});
