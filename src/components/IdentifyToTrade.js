/*
 * @Description:
 * @Autor: wxp
 * @Date: 2022-12-22 15:07:51
 */
import React, {useImperativeHandle, useRef, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator} from 'react-native';
import {px} from '~/utils/appUtil';
import identifyTradeIcon from '~/assets/img/identify-trade.png';
import {captureScreen} from 'react-native-view-shot';

const IdentifyToTrade = ({style, onStart, onIdentify, onError, showFloatIcon = true, _ref}) => {
    const [uri, setUri] = useState('');
    const [floatIconVisible, setFloatIconVisible] = useState(true);
    const [identifyModalVisible, setIdentifyModalVisible] = useState(false);
    const flag = useRef(true);

    const handler = async () => {
        if (!flag.current) return false;
        flag.current = false;
        setFloatIconVisible(false);
        await onStart();
        captureScreen({
            format: 'jpg',
            quality: 0.8,
        })
            .then(
                (_uri) => {
                    setUri(_uri);
                    setIdentifyModalVisible(true);
                    onIdentify(() => setIdentifyModalVisible(false));
                    setFloatIconVisible(true);
                },
                (error) => {
                    console.log(error);
                    setIdentifyModalVisible(false);
                    onError(error);
                    setFloatIconVisible(true);
                }
            )
            .finally(() => {
                flag.current = true;
            });
    };
    useImperativeHandle(_ref, () => ({
        handler,
    }));
    return (
        <>
            {floatIconVisible && showFloatIcon ? (
                <TouchableOpacity style={[styles.container, style]} activeOpacity={0.8} onPress={handler}>
                    <Image source={identifyTradeIcon} style={{width: px(102), height: px(52)}} resizeMode={'contain'} />
                </TouchableOpacity>
            ) : null}
            <Modal visible={identifyModalVisible} transparent={true} animationType="fade" statusBarTranslucent={true}>
                <TouchableOpacity
                    style={{flex: 1, backgroundColor: 'rgba(30,30,32,0.8)', alignItems: 'center', paddingTop: px(122)}}
                    activeOpacity={1}
                    onPress={() => {}}>
                    <ActivityIndicator color={'#fff'} />
                    <Text style={styles.text}>正在识别图片...</Text>
                    <Image
                        source={{uri}}
                        style={{width: px(240), height: px(466), marginTop: px(16)}}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default IdentifyToTrade;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: px(10),
        bottom: px(100),
    },
    text: {
        marginTop: px(10),
        fontSize: px(16),
        lineHeight: px(22),
        color: '#fff',
    },
});
