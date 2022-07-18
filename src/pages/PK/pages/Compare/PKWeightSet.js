import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import {isIphoneX, px} from '../../../../utils/appUtil';
import Mask from '~/components/Mask';
import Icon from 'react-native-vector-icons/AntDesign';
import {Font} from '~/common/commonStyle';
import PKSlider from '../../components/PKSlider';
import {weightDetail, weightReset} from '../../services';
import Toast from '~/components/Toast';
import {useSelector} from 'react-redux';

const PKWeightSet = ({total = 100, tickNum = 5, weightsState, setWeightsState}, ref) => {
    const pkProducts = useSelector((state) => state.pkProducts[global.pkEntry]);

    const [loading, setLoading] = useState(true);
    const [resetLoading, setResetLoading] = useState(false);
    const [sumbitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState(null);
    const [sliderRate, setSliderRate] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => {
            setModalVisible(true);
            getData();
        },
    }));

    const getData = () => {
        setLoading(true);
        weightDetail({source: global.pkEntry, weight: weightsState})
            .then((res) => {
                if (res.code === '000000') {
                    setData(res.result);
                    const obj = res.result?.item?.reduce?.((memo, cur) => {
                        memo[cur.weight_type] = cur.weight;
                        return memo;
                    }, {});
                    setSliderRate(obj || {});
                }
            })
            .finally((_) => {
                setLoading(false);
            });
    };

    const resetData = () => {
        setResetLoading(true);
        weightReset()
            .then((res) => {
                if (res.code === '000000') setSliderRate(res.result);
            })
            .finally((_) => {
                setResetLoading(false);
            });
    };

    const submitData = () => {
        setSubmitLoading(true);
        global.LogTool('setting_click', JSON.stringify(sliderRate), pkProducts.join());
        Toast.show('操作成功');
        cancel();
        setWeightsState(sliderRate);
        setSubmitLoading(false);
    };

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
                        {loading ? (
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <ActivityIndicator size={'large'} />
                            </View>
                        ) : (
                            <>
                                <View style={styles.header}>
                                    <Icon name={'close'} size={21} onPress={cancel} />
                                    <Text style={styles.title}>{data.title}</Text>
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
                                                    <Text
                                                        key={idx}
                                                        style={[styles.tickText, {transform: [{translateX}]}]}>
                                                        {val}
                                                    </Text>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    {/* slider list */}
                                    <View style={styles.sliderList}>
                                        {data.item.map((item, idx) => (
                                            <SliderItem
                                                key={idx + sliderRate}
                                                item={item}
                                                rate={sliderRate[item.weight_type]}
                                                onChange={(rate) => {
                                                    setSliderRate((val) => ({...val, [item.weight_type]: rate}));
                                                }}
                                                total={total}
                                                tickNum={tickNum}
                                            />
                                        ))}
                                    </View>
                                </View>
                                <View style={styles.btnWrap}>
                                    {data.reset_button ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={styles.leftBtn}
                                            disabled={resetLoading}
                                            onPress={() => {
                                                resetData();
                                            }}>
                                            {resetLoading && <ActivityIndicator />}
                                            <Text style={styles.leftBtnText}>{data.reset_button.text}</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                    {data.setting_button ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={sumbitLoading}
                                            style={styles.rightBtn}
                                            onPress={() => {
                                                submitData();
                                            }}>
                                            {sumbitLoading && <ActivityIndicator />}
                                            <Text style={styles.rightBtnText}>{data.setting_button.text} </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};
export default forwardRef(PKWeightSet);

const SliderItem = ({item, rate, onChange, total, tickNum}) => {
    return (
        <View style={styles.sliderItem}>
            <View style={styles.labelWrap}>
                <Text style={styles.labelName}>{item.weight_name}</Text>
                <Text style={styles.labelRate}>{rate}%</Text>
            </View>
            <PKSlider
                rate={rate}
                total={total}
                tickNum={tickNum}
                onChange={(val) => {
                    onChange(val);
                }}
            />
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
        minHeight: px(200),
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
        width: '100%',
    },
    leftBtn: {
        borderWidth: 1,
        borderColor: '#545968',
        backgroundColor: '#fff',
        borderRadius: px(6),
        paddingVertical: px(10),
        width: px(150),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingLeft: px(10),
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
