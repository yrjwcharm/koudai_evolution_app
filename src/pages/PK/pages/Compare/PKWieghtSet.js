import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import {isIphoneX, px} from '../../../../utils/appUtil';
import Mask from '~/components/Mask';
import Icon from 'react-native-vector-icons/AntDesign';
import {Font} from '~/common/commonStyle';
import PKSlider from '../../components/PKSlider';

const PKWeightSet = ({total = 100, tickNum = 5}) => {
    const [data, setData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            // setData([]);
            setModalVisible(true);
        }, 1000);
    }, []);

    const cancel = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* 底层蒙层 */}
            {modalVisible ? <Mask onClick={cancel} /> : null}
            {/* 弹出层 */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={cancel}>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    {/* 占位块 */}
                    <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={cancel} />
                    {/* 底部弹框 */}
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Icon name={'close'} size={21} onPress={cancel} />
                            <Text style={styles.title}>权重设置</Text>
                            <Icon style={{opacity: 0}} name={'close'} size={21} onPress={cancel} />
                        </View>
                        <View style={styles.middle}>
                            {/* 刻度 */}
                            <View style={styles.ticksWrap}>
                                <View style={styles.labelWrap} />
                                <View style={styles.sliderWrap}>
                                    {new Array(tickNum).fill('').map((item, idx) => {
                                        let step = total / (tickNum - 1);
                                        let val = step * idx;
                                        let xRate = (-50 + step * idx) / 100;
                                        let translateX = parseInt(px(32) * xRate, 10);
                                        return (
                                            <Text style={[styles.tickText, {transform: [{translateX}]}]}>{val}</Text>
                                        );
                                    })}
                                </View>
                            </View>
                            {/* slider list */}
                            <View style={styles.sliderList}>
                                {[1, 2, 3].map((item, idx) => (
                                    <View style={styles.sliderItem}>
                                        <View style={styles.labelWrap}>
                                            <Text style={styles.labelName}>业绩稳定性</Text>
                                            <Text style={styles.labelRate}> 50%</Text>
                                        </View>
                                        <PKSlider total={total} tickNum={tickNum} />
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.btnWrap}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.leftBtn}>
                                <Text style={styles.leftBtnText}> 一键均分</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} style={styles.rightBtn}>
                                <Text style={styles.rightBtnText}>保存设置 </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    content: {
        backgroundColor: '#fff',
        paddingBottom: isIphoneX() ? 34 : 20,
        borderTopLeftRadius: px(12),
        borderTopRightRadius: px(12),
    },
    header: {
        padding: px(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: 1,
    },
    title: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#1E2331',
        textAlign: 'center',
    },
    btnWrap: {
        paddingHorizontal: px(32),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: px(13),
    },
    leftBtn: {
        borderWidth: 1,
        borderColor: '#545968',
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingVertical: px(10),
        width: px(150),
    },
    leftBtnText: {
        textAlign: 'center',
        fontSize: px(14),
        lineHeight: px(20),
        color: '#545968',
    },
    rightBtn: {
        backgroundColor: '#0051CC',
        borderRadius: px(6),
        paddingVertical: px(10),
        width: px(150),
    },
    rightBtnText: {
        textAlign: 'center',
        fontSize: px(14),
        lineHeight: px(20),
        color: '#fff',
    },
    ticksWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px(14),
    },
    labelWrap: {
        width: px(100),
        paddingLeft: px(16),
        paddingVertical: px(6),
    },
    sliderWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: px(243),
        height: '100%',
    },
    tickText: {
        fontSize: px(11),
        lineHeight: px(22),
        color: '#3D3D3D',
        width: px(32),
        textAlign: 'center',
    },
    sliderItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelName: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#121D3A',
    },
    labelRate: {
        fontSize: px(14),
        lineHeight: px(22),
        color: '#121D3A',
        fontFamily: Font.numFontFamily,
    },
});
export default PKWeightSet;
