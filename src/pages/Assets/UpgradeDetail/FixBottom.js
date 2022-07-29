/*
 * @Date: 2022-07-21 14:16:18
 * @Description:
 */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useJump} from '~/components/hooks';
import {isIphoneX, px} from '~/utils/appUtil';

const FixBottom = ({button, button2}) => {
    const jump = useJump();
    const navigation = useNavigation();
    return (
        <>
            <View
                style={{
                    backgroundColor: '#ddd',
                    opacity: 0.1,
                    height: 1,
                }}
            />
            <View style={[styles.fixBottom, {paddingBottom: isIphoneX() ? 34 : px(8)}]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.btnLeft}>
                    <Text style={styles.btnLeftText}>{button2?.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => jump(button.url)} style={styles.btnRight}>
                    <Text style={styles.btnRightText}>{button?.text}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default FixBottom;

const styles = StyleSheet.create({
    fixBottom: {
        paddingVertical: px(10),
        paddingHorizontal: px(15),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnLeft: {
        width: px(124),
        height: px(44),
        borderRadius: px(6),
        borderWidth: 1,
        borderColor: '#545968',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLeftText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#545968',
    },
    btnRight: {
        width: px(208),
        height: px(44),
        borderRadius: px(6),
        backgroundColor: '#0051CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRightText: {
        fontSize: px(15),
        lineHeight: px(21),
        color: '#fff',
    },
});
