import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {px} from '~/utils/appUtil';

const ConfirmPurpose = (props, ref) => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(true);

    const size = useRef(false ? {width: px(280), height: px(243)} : {width: px(280), height: px(320)}).current;
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={[styles.wrap]}>
                <View style={size}>
                    <FastImage
                        source={{
                            uri: false
                                ? 'https://static.licaimofang.com/wp-content/uploads/2022/10/confirm-purpose.png'
                                : 'https://static.licaimofang.com/wp-content/uploads/2022/10/confirm-purpose2.png',
                        }}
                        style={size}
                    />
                    <View style={styles.bottom}>
                        <TouchableOpacity
                            style={styles.leftBtn}
                            activeOpacity={0.8}
                            onPress={() => {
                                setVisible(false);
                                navigation.goBack();
                            }}>
                            <Text style={styles.leftBtnText}>不符合意向</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rightBtn}
                            activeOpacity={0.8}
                            onPress={() => {
                                setVisible(false);
                            }}>
                            <Text style={styles.rightBtnText}>符合我的意向</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmPurpose;

const styles = StyleSheet.create({
    container: {},
    wrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    bottom: {
        position: 'absolute',
        bottom: px(20),
        left: 0,
        width: '100%',
        paddingHorizontal: px(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftBtn: {
        borderWidth: 0.5,
        borderColor: '#0051CC',
        paddingVertical: px(9),
        width: px(120),
        borderRadius: px(18),
    },
    leftBtnText: {
        fontSize: px(14),
        lineHeight: px(21),
        color: '#0051CC',
        textAlign: 'center',
    },
    rightBtn: {
        paddingVertical: px(9),
        width: px(120),
        borderRadius: px(18),
        backgroundColor: '#0051CC',
    },
    rightBtnText: {
        fontSize: px(14),
        lineHeight: px(21),
        color: '#fff',
        textAlign: 'center',
    },
});
