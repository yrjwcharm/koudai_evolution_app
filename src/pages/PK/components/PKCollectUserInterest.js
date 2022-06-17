import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import FastImage from 'react-native-fast-image';
import {isIphoneX, px} from '../../../utils/appUtil';
import checkBtnIcon from '../../../components/IM/app/source/image/check.png';
import Mask from '~/components/Mask';
import {Button} from '~/components/Button';

const PKCollectUserInterest = ({}) => {
    const [data, setData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [checkedBtns, setCheckedBtns] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setData([]);
            setModalVisible(true);
        }, 1000);
    }, []);

    const cancel = () => {
        setModalVisible(false);
    };

    const handlerCheckBtnsChange = (item) => {
        let arr = [...checkedBtns];
        let idx = arr.indexOf(item);
        if (idx > -1) arr.splice(idx, 1);
        else arr.push(item);
        setCheckedBtns(arr);
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
                        <Header />
                        <ScrollView style={styles.scrollWrap} scrollIndicatorInsets={{right: 1}}>
                            <View style={{paddingVertical: px(28), paddingHorizontal: px(36)}}>
                                {[1, 2, 3].map((itm, idx) => (
                                    <View key={idx} style={[styles.classifyWrap, {marginTop: idx > 0 ? px(40) : 0}]}>
                                        <View style={styles.classifyTitleWrap}>
                                            <View style={styles.classifyCircle} />
                                            <Text style={styles.classifyTitle}>大分类标题</Text>
                                        </View>
                                        <View style={styles.checkOptionWrap}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                                                <View>
                                                    {index > 2 ? (
                                                        <View
                                                            style={{
                                                                height: px(20),
                                                            }}
                                                        />
                                                    ) : null}
                                                    <CheckBtn
                                                        key={index}
                                                        onChange={() => handlerCheckBtnsChange(item)}
                                                        style={{
                                                            marginLeft: index % 3 === 0 ? 0 : px(19),
                                                        }}
                                                    />
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                        <View style={styles.btnWrap}>
                            <Button
                                title={checkedBtns.length < 3 ? '至少选择3个类型/完成' : '确定'}
                                disabled={checkedBtns.length < 3}
                                onPress={() => {}}
                            />
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
        height: px(512),
    },
    headerWrap: {
        marginTop: px(38),
    },
    headerTitle: {
        color: '#292D39',
        fontSize: px(22),
        lineHeight: px(31),
        textAlign: 'center',
    },
    headerSubTitle: {
        color: '#545968',
        fontSize: px(14),
        lineHeight: px(24),
        textAlign: 'center',
        marginVertical: px(4),
    },
    scrollWrap: {
        flex: 1,
    },
    classifyWrap: {},
    classifyTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classifyTitle: {
        fontSize: px(16),
        color: '#121D3A',
        lineHeight: px(24),
    },
    classifyCircle: {
        width: 6,
        height: 6,
        borderRadius: px(6),
        marginRight: px(8),
        backgroundColor: '#0051CC',
    },
    checkOptionWrap: {
        marginTop: px(20),
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    checkBtnWrap: {
        width: px(88),
        paddingVertical: px(10),
        borderRadius: px(20),
    },
    checkBtnText: {
        fontSize: px(14),
        lineHeight: px(20),
        alignSelf: 'center',
        textAlign: 'center',
    },
    checkBtnIconWrap: {
        width: px(16),
        height: px(16),
        borderRadius: px(16),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: px(-3),
        right: px(-3),
    },
    checkBtnIcon: {
        width: px(8),
        height: px(6),
    },
    btnWrap: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
    },
});
export default PKCollectUserInterest;

const Header = () => {
    return (
        <View style={styles.headerWrap}>
            <Text style={styles.headerTitle}>选择你感兴趣的类型</Text>
            <Text style={styles.headerSubTitle}>为你推荐更多精彩内容</Text>
        </View>
    );
};

const CheckBtn = ({style, onChange}) => {
    const [check, updCheck] = useState(false);
    const handlerPress = () => {
        updCheck((val) => !val);
        onChange?.();
    };
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.checkBtnWrap,
                check ? {backgroundColor: '#DEE8FF'} : {borderColor: '#BDC2CC', borderWidth: 1},
                style,
            ]}
            onPress={handlerPress}>
            {/* check icon */}
            <View style={[styles.checkBtnIconWrap, {backgroundColor: check ? '#0051CC' : '#E9EAEF'}]}>
                <FastImage source={checkBtnIcon} style={styles.checkBtnIcon} />
            </View>
            {/* text */}
            <Text style={[styles.checkBtnText, check ? {color: '#0051CC'} : {color: '#121D3A'}]}>资金储蓄</Text>
        </TouchableOpacity>
    );
};
