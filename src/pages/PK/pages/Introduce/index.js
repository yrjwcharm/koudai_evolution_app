import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Text, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavBar from '~/components/NavBar.js';
import {px} from '~/utils/appUtil';
import pkIcon from '~/assets/img/pk/pkIcon.png';
import {Font, Style} from '~/common/commonStyle';
import PKParamsRateOfSum from '../../components/PKParamsRateOfSum';
import PKParamRate from '../../components/PKParamRate';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '~/components/Button';
import {BoxShadow} from 'react-native-shadow';

const Introduce = () => {
    const [tableSize, setTableSize] = useState({});
    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <NavBar
                leftIcon="chevron-left"
                fontStyle={{
                    color: '#fff',
                }}
                style={{
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    zIndex: 20,
                }}
            />

            <ScrollView style={{flex: 1, backgroundColor: '#f5f6f8'}} scrollIndicatorInsets={{right: 1}}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-introduce-bg.png'}}
                    style={{width: '100%', height: px(272), position: 'absolute', top: 0}}
                    resizeMode="contain"
                />
                <View style={styles.content}>
                    <Text style={styles.title}>产品PK介绍</Text>
                    <ImageBackground
                        imageStyle={{width: px(343), height: px(136)}}
                        source={{
                            uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-introduce-card-bg.png',
                        }}
                        style={styles.card}>
                        <Text style={styles.questionTitle}>什么是产品PK?</Text>
                        <Text style={styles.questionAnswer}>
                            根据个人偏好设置六个板块对比权重进行产品PK，魔方将根据您选择的基金和设置的权重，计算出每个基金的总PK值，?
                        </Text>
                        <View style={styles.pkDetail}>
                            {/* pk info */}
                            <ImageBackground
                                source={{
                                    uri: 'http://wp0.licaimofang.com/wp-content/uploads/2022/06/pk-introduce-card-pk-bg.png',
                                }}
                                resizeMode="stretch"
                                style={styles.pkInfo}>
                                <View style={styles.pkInfoLeft}>
                                    <Text style={styles.pkInfoName}>嘉实中证基建ETF发起式联接A</Text>
                                    <Text style={styles.priceRate}>+19.12%</Text>
                                    <Text style={styles.priceDesc}>近一年涨跌幅</Text>
                                </View>
                                <View style={styles.pkInfoRight}>
                                    <Text style={[styles.pkInfoName, {textAlign: 'right'}]}>
                                        嘉实中证基建ETF发起式联接A
                                    </Text>
                                    <Text style={[styles.priceRate, {textAlign: 'right'}]}>+19.12%</Text>
                                    <Text style={[styles.priceDesc, {textAlign: 'right'}]}>近一年涨跌幅</Text>
                                </View>
                                <FastImage source={pkIcon} style={styles.pkIconStyle} />
                            </ImageBackground>
                            {/* pk params */}
                            <View
                                style={styles.paramsTable}
                                onLayout={(e) => {
                                    console.log(e.nativeEvent.layout);
                                    setTableSize(e.nativeEvent.layout);
                                }}>
                                {/* 总pk分 */}
                                <View style={styles.paramsRow}>
                                    <ParamsCellWrapOfSum style={{...styles.cellBorderR, width: px(82)}}>
                                        <Text style={styles.paramsLabelOfSum}>总PK分</Text>
                                    </ParamsCellWrapOfSum>
                                    <ParamsCellWrapOfSum status={true} style={styles.cellBorderR}>
                                        <PKParamsRateOfSum value={90} color="#E74949" />
                                    </ParamsCellWrapOfSum>
                                    <ParamsCellWrapOfSum>
                                        <PKParamsRateOfSum value={54} color="#545968" />
                                    </ParamsCellWrapOfSum>
                                </View>
                                {/* pk 参数 */}
                                {[
                                    {text: '短期爆发力', v1: 96, v2: 35},
                                    {text: '短期爆发力', v1: 96, v2: 35},
                                    {text: '短期爆发力', v1: 96, v2: 35},
                                    {text: '收益千里', v1: 75, v2: 35},
                                    {text: '收益千里', v1: 75, v2: 20},
                                    {text: '收益千里', v1: 75, v2: 45},
                                    {text: '业绩独特性', v1: 75, v2: 35},
                                    {text: '业绩独特性', v1: 20, v2: 99},
                                    {text: '业绩独特性', v1: 75, v2: 45},
                                ].map((item, idx) => (
                                    <View
                                        style={[
                                            styles.paramsRow,
                                            styles.rowBorderT,
                                            {backgroundColor: idx % 2 === 0 ? '#F5F6F8' : '#fff'},
                                        ]}
                                        key={idx}>
                                        <View style={[styles.paramsCell, {...styles.cellBorderR, width: px(82)}]}>
                                            <Text style={styles.paramsLabel}>{item.text}</Text>
                                        </View>
                                        <View style={[styles.paramsCell, styles.cellBorderR]}>
                                            <PKParamRate value={item.v1} color="#E74949" justifyContent="flex-end" />
                                        </View>
                                        <View style={[styles.paramsCell]}>
                                            <PKParamRate value={item.v2} color="#545968" justifyContent="flex-end" />
                                        </View>
                                    </View>
                                ))}
                            </View>
                            {/* box shadow */}
                            {tableSize.height && (
                                <View style={{position: 'absolute', left: 0, zIndex: 1}}>
                                    <BoxShadow
                                        setting={{
                                            color: '#aaa',
                                            border: 8,
                                            radius: px(6),
                                            opacity: 0.1,
                                            x: tableSize.x - 4,
                                            y: tableSize.y - 4,
                                            width: tableSize.width + 8,
                                            height: tableSize.height + 8,
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                    </ImageBackground>
                </View>
            </ScrollView>
            <View style={styles.btnWrap}>
                <Button title={'开始PK'} onPress={() => {}} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: px(26),
        lineHeight: px(36),
        color: '#fff',
    },
    content: {
        marginTop: px(84),
        marginBottom: px(32),
        paddingHorizontal: px(16),
    },
    card: {
        borderRadius: px(8),
        marginTop: px(17),
        backgroundColor: '#fff',
        padding: px(16),
    },
    questionTitle: {
        fontSize: px(16),
        lineHeight: px(22),
        color: '#000',
    },
    questionAnswer: {
        marginTop: px(12),
        fontSize: px(12),
        lineHeight: px(17),
        color: '#545968',
    },
    pkDetail: {
        marginTop: px(16),
    },
    pkInfo: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: px(309),
        height: px(116),
        position: 'relative',
        zIndex: 3,
    },
    pkInfoLeft: {
        flex: 1,
        padding: px(14),
        paddingRight: px(25),
        borderTopLeftRadius: px(6),
    },
    pkInfoRight: {
        flex: 1,
        padding: px(14),
        paddingLeft: px(25),
        borderTopRightRadius: px(6),
    },
    pkInfoName: {
        fontSize: px(13),
        color: '#fff',
        lineHeight: px(18),
        width: '100%',
    },
    priceRate: {
        marginTop: px(6),
        color: '#fff',
        lineHeight: px(25),
        fontWeight: '500',
        fontSize: px(18),
        fontFamily: Font.numFontFamily,
    },
    priceDesc: {
        fontSize: px(10),
        color: 'rgba(255, 255, 255, 0.69)',
        lineHeight: px(14),
    },
    pkIconStyle: {
        width: px(88),
        height: px(44),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{translateX: px(-44)}, {translateY: px(-22)}],
    },
    paramsTable: {
        marginHorizontal: px(16),
        borderRadius: px(6),
        position: 'relative',
        zIndex: 2,
        top: px(-15),
        backgroundColor: '#fff',
    },
    paramsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBorderT: {
        borderTopColor: '#E9EAEF',
        borderTopWidth: 1,
    },
    paramsLabelOfSum: {
        fontSize: px(13),
        lineHeight: px(18),
        color: '#e74949',
        textAlign: 'center',
    },
    paramsLabel: {
        fontSize: px(12),
        lineHeight: px(17),
        color: '#121d3a',
        textAlign: 'center',
    },
    paramsCellOfSum: {
        padding: px(8),
        flex: 1,
    },
    paramsCell: {
        paddingHorizontal: px(8),
        paddingVertical: px(11),
        flex: 1,
    },
    highStamp: {
        alignSelf: 'flex-start',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderBottomRightRadius: px(4),
        alignItems: 'center',
        backgroundColor: '#E74949',
        position: 'relative',
        left: px(-8),
        flexDirection: 'row',
    },
    highStampText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#fff',
    },
    recommendDesc: {
        backgroundColor: '#fff2f2',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 2,
    },
    recommendDescText: {
        fontSize: px(10),
        lineHeight: px(14),
        color: '#e74949',
    },
    cellBorderR: {
        borderRightColor: '#E9EAEF',
        borderRightWidth: 1,
    },
    btnWrap: {
        paddingVertical: px(8),
        paddingHorizontal: px(16),
    },
});
export default Introduce;

const ParamsCellWrapOfSum = ({children, style, status = false}) => {
    return (
        <View style={[styles.paramsCellOfSum, style]}>
            <View style={[styles.highStamp, {opacity: +status}]}>
                <FastImage
                    source={{uri: 'http://static.licaimofang.com/wp-content/uploads/2022/06/pk-table-good.png'}}
                    style={{width: px(10), height: px(10), marginRight: px(2)}}
                />
                <Text style={styles.highStampText}>优选推荐</Text>
            </View>
            {children}
            {['推荐理由文案推荐理由文案', '推荐理由文案'].map((item, idx) => (
                <View key={idx} style={[styles.recommendDesc, {opacity: +status, marginTop: idx > 0 ? 4 : 0}]}>
                    <Text style={styles.recommendDescText}>{item}</Text>
                </View>
            ))}
        </View>
    );
};
