import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BottomModal, PageModal} from '../../../components/Modal';
import {px} from '../../../utils/appUtil';
import checkBtnIcon from '../../../components/IM/app/source/image/check.png';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const PKCollectUserInterest = ({}) => {
    const tabBarHeight = useBottomTabBarHeight();

    const [data, setData] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setData([]);
            modalRef.current?.show();
        }, 1000);
    }, []);
    return data ? (
        <View style={styles.container}>
            <BottomModal header={<Header />} ref={(el) => (modalRef.current = el)} style={{height: px(512)}}>
                <ScrollView bounces={false} style={[styles.scrollWrap]} scrollIndicatorInsets={{right: 1}}>
                    {[1, 2, 3].map((item, idx) => (
                        <View key={idx} style={[styles.classifyWrap, {marginTop: idx > 0 ? px(40) : 0}]}>
                            <View style={styles.classifyTitleWrap}>
                                <View style={styles.classifyCircle} />
                                <Text style={styles.classifyTitle}>大分类标题</Text>
                            </View>
                            <View style={styles.checkOptionWrap}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, idx) => (
                                    <CheckBtn key={idx} style={{marginTop: idx > 2 ? px(20) : 0}} />
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
                {/* 垫脚 */}
            </BottomModal>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {},
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
    },
    scrollWrap: {
        paddingVertical: px(32),
        paddingHorizontal: px(36),
        backgroundColor: 'red',
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
        justifyContent: 'space-between',
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

const CheckBtn = ({style}) => {
    const [check, updCheck] = useState(false);
    const handlerPress = () => {
        updCheck((val) => !val);
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
