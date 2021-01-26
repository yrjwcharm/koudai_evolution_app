/*
 * @Date: 2021-01-23 10:29:49
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-01-23 11:34:34
 * @Description: 历史调仓记录
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput as Input} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import http from '../../services';
import {px as text, isIphoneX} from '../../utils/appUtil';
import {Style, Colors, Space, Font} from '../../common/commonStyle';

const RatioColor = [
    '#E1645C',
    '#5687EB',
    '#ECB351',
    '#CC8FDD',
    '#E4C084',
    '#5DC162',
    '#DE79AE',
    '#967DF2',
    '#62B4C7',
    '#B8D27E',
    '#F18D60',
    '#5E71E8',
    '#EBDD69',
];

const HistoryAdjust = (props) => {
    const {account_id} = props.route.params || {};
    const navigation = useNavigation();
    const [activeSections, setActiveSections] = useState([]);
    const [data, setData] = useState({});
    useEffect(() => {
        // http.get('portfolio/adjust_history/20210101', {account_id}).then((res) => {
        //     setData(res.result);
        //     navigation.setOptions({title: res.result.title});
        // });
        setData({
            title: '历史配比方案',
            deploy_detail: [
                {
                    type: 12102,
                    color: '#E4C084',
                    name: '信用债',
                    ratio: 0.2736,
                    last_ratio: 0.1308,
                    items: [
                        {
                            id: 33035355,
                            name: '鹏华丰达',
                            code: '003209',
                            ratio: 0.1368,
                            last_ratio: 0.1144,
                        },
                        {
                            id: 30001979,
                            name: '华安信用四季红A',
                            code: '040026',
                            ratio: 0.1368,
                            last_ratio: 0.1592,
                        },
                    ],
                },
                {
                    type: 13101,
                    color: '#C5518D',
                    name: '货币',
                    ratio: 0.2222,
                    last_ratio: 0.4442,
                    items: [
                        {
                            id: 32023647,
                            name: '创金合信货币A',
                            code: '001909',
                            ratio: 0.1111,
                            last_ratio: 0.2221,
                        },
                        {
                            id: 33057587,
                            name: '博时合惠B',
                            code: '004137',
                            ratio: 0.1111,
                            last_ratio: 0.2221,
                        },
                    ],
                },
                {
                    type: 11101,
                    color: '#E1645C',
                    name: '大盘股票',
                    ratio: 0.1628,
                    last_ratio: 0.3262,
                    items: [
                        {
                            id: 30076303,
                            name: '华夏沪深300指数增强A',
                            code: '001015',
                            ratio: 0.0731,
                            last_ratio: 0.1468,
                        },
                        {
                            id: 30378281,
                            name: '博时沪港深优质企业A',
                            code: '001215',
                            ratio: 0.02,
                            last_ratio: 0.04,
                        },
                        {
                            id: 30000702,
                            name: '华宝中证银行ETF联接A',
                            code: 240019,
                            ratio: 0.0196,
                            last_ratio: 0.0392,
                        },
                        {
                            id: 33035332,
                            name: '创金合信医疗保健行业A',
                            code: '003230',
                            ratio: 0.0147,
                            last_ratio: 0.0294,
                        },
                        {
                            id: 30002645,
                            name: '申万菱信消费增长',
                            code: 310388,
                            ratio: 0.0133,
                            last_ratio: 0.0266,
                        },
                        {
                            id: 30002864,
                            name: '景顺长城新兴成长',
                            code: 260108,
                            ratio: 0.012,
                            last_ratio: 0.024,
                        },
                        {
                            id: 30667951,
                            name: '长盛中证金融地产',
                            code: 160814,
                            ratio: 0.0101,
                            last_ratio: 0.0202,
                        },
                    ],
                },
                {
                    type: 11102,
                    color: '#5687EB',
                    name: '小盘股票',
                    ratio: 0.1138,
                    last_ratio: 0.2274,
                    items: [
                        {
                            id: 30110706,
                            name: '工银瑞信战略转型主题',
                            code: '000991',
                            ratio: 0.0569,
                            last_ratio: 0.1137,
                        },
                        {
                            id: 30171952,
                            name: '博时产业新动力A',
                            code: '000936',
                            ratio: 0.0569,
                            last_ratio: 0.1137,
                        },
                    ],
                },
                {
                    type: 12101,
                    color: '#C08FDD',
                    name: '利率债',
                    ratio: 0.0771,
                    last_ratio: 0.01542,
                    items: [
                        {
                            id: 39128278,
                            name: '富荣富开1-3年国开债纯债A',
                            code: '006488',
                            ratio: 0.0771,
                            last_ratio: 0.01542,
                        },
                    ],
                },
                {
                    type: 14001,
                    color: '#62B4C7',
                    name: '黄金',
                    ratio: 0.0669,
                    last_ratio: 0.01338,
                    items: [
                        {
                            id: 30000727,
                            name: '华安易富黄金ETF联接C',
                            code: '000217',
                            ratio: 0.0669,
                            last_ratio: 0.01338,
                        },
                    ],
                },
                {
                    type: 11205,
                    color: '#E18A31',
                    name: '香港股票',
                    ratio: 0.0443,
                    last_ratio: 0.00886,
                    items: [
                        {
                            id: 39183133,
                            name: '中华300',
                            code: 160925,
                            ratio: 0.0443,
                            last_ratio: 0.00886,
                        },
                    ],
                },
                {
                    type: 11202,
                    color: '#5DC162',
                    name: '美国股票',
                    ratio: 0.0393,
                    last_ratio: 0.00786,
                    items: [
                        {
                            id: 33057685,
                            name: '汇添富全球移动互联',
                            code: '001668',
                            ratio: 0.0393,
                            last_ratio: 0.00786,
                        },
                    ],
                },
            ],
            intros: {
                title: 'A股基金池调整，同时增加债券比例',
                content:
                    '这里是配置依据文案，这里是置依据文案，这里是配置依据文案这里是配置依据文案，这里是配置依据文案，这里是配置依据文案，这里是配置依据文案',
            },
        });
    }, [account_id, navigation]);
    const renderContent = useCallback(
        // 手风琴内容渲染
        (section) => {
            return (
                <>
                    {section.items &&
                        section.items.map((item, index) => {
                            return (
                                <View key={item.code} style={[styles.assets_l2, Style.flexBetween]}>
                                    <View>
                                        <Text style={[styles.assets_l2_name]}>{item.name}</Text>
                                        <Text style={[styles.assets_l2_code]}>{item.code}</Text>
                                    </View>
                                    <View style={[styles.assets_l2_right, {flexDirection: 'row'}]}>
                                        <Text style={[styles.assets_l2_last_ratio, styles.assets_l2_right]}>
                                            {`${(item.last_ratio * 100).toFixed(2)}%`}
                                        </Text>
                                        <Icon name={'arrow-right-alt'} size={20} color={Colors.darkGrayColor} />
                                        <Text style={[styles.assets_l2_ratio, styles.assets_l2_right]}>
                                            {`${(item.ratio * 100).toFixed(2)}%`}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                </>
            );
        },
        []
    );
    const renderHeader = useCallback(
        // 手风琴头部渲染
        (section, index, isActive) => {
            return (
                <View
                    style={[
                        styles.assets_l1,
                        Style.flexBetween,
                        {borderTopWidth: index === 0 ? 0 : Space.borderWidth},
                    ]}>
                    <View style={[styles.leftPart, Style.flexRow]}>
                        <View style={[styles.circle, {backgroundColor: RatioColor[index]}]} />
                        <Text style={[styles.assets_l1_name]}>{section.name}</Text>
                    </View>
                    <View style={[styles.rightPart, Style.flexRow]}>
                        <Text style={[styles.assets_l1_last_ratio, styles.rightPart]}>
                            {`${(section.last_ratio * 100).toFixed(2)}%`}
                        </Text>
                        <Icon name={'arrow-right-alt'} size={20} color={Colors.darkGrayColor} />
                        <Text style={[styles.assets_l1_ratio, styles.rightPart]}>
                            {`${(section.ratio * 100).toFixed(2)}%`}
                        </Text>
                        <FontAwesome color={Colors.descColor} size={20} name={isActive ? 'angle-up' : 'angle-down'} />
                    </View>
                </View>
            );
        },
        []
    );
    const updateSections = useCallback((sections) => {
        setActiveSections(sections);
    }, []);
    return (
        <>
            {Object.keys(data).length > 0 && (
                <ScrollView style={{backgroundColor: Colors.bgColor}} scrollIndicatorInsets={{right: 1}}>
                    <View style={styles.topPart}>
                        <Text style={styles.topTitle}>{'2020/12/25 10万元配比方案'}</Text>
                        <View style={[styles.percent_bar, Style.flexRow]}>
                            {data.deploy_detail &&
                                data.deploy_detail.map((item, index) => (
                                    <View
                                        key={item.type}
                                        style={[
                                            styles.barPart,
                                            {
                                                backgroundColor: RatioColor[index],
                                                width: `${(item.ratio * 100).toFixed(2)}%`,
                                            },
                                        ]}
                                    />
                                ))}
                        </View>
                        <View style={[styles.intros]}>
                            <Text style={[styles.intro_title]}>{data.intros.title}</Text>
                            <Text style={[styles.intro_content]}>{data.intros.content}</Text>
                        </View>
                    </View>
                    <View style={[styles.deploy_detail]}>
                        <Accordion
                            activeSections={activeSections}
                            expandMultiple
                            onChange={updateSections}
                            renderContent={renderContent}
                            renderHeader={renderHeader}
                            sections={data.deploy_detail}
                            touchableComponent={TouchableOpacity}
                            touchableProps={{activeOpacity: 1}}
                        />
                    </View>
                </ScrollView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topPart: {
        paddingHorizontal: Space.marginAlign,
        paddingTop: text(26),
        paddingBottom: Space.marginVertical,
        backgroundColor: '#fff',
    },
    topTitle: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.defaultColor,
        fontWeight: '500',
        textAlign: 'center',
    },
    percent_bar: {
        marginVertical: text(20),
        width: '100%',
        height: text(24),
    },
    barPart: {
        height: '100%',
    },
    intros: {
        fontSize: text(13),
        lineHeight: text(22),
        textAlign: 'justify',
    },
    intro_title: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.descColor,
        fontWeight: '500',
    },
    intro_content: {
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.darkGrayColor,
        marginTop: text(4),
    },
    deploy_detail: {
        marginVertical: Space.marginVertical,
        marginHorizontal: Space.marginAlign,
        backgroundColor: '#fff',
        borderRadius: Space.borderRadius,
        paddingHorizontal: Space.marginAlign,
    },
    assets_l1: {
        height: text(50),
        borderTopColor: Colors.borderColor,
        borderStyle: 'solid',
        flexDirection: 'row',
    },
    circle: {
        width: text(12),
        height: text(12),
        borderRadius: text(6),
        marginRight: text(8),
    },
    assets_l1_name: {
        fontSize: Font.textH2,
        lineHeight: text(20),
        color: Colors.descColor,
    },
    rightPart: {
        fontSize: Font.textH2,
        lineHeight: text(17),
        fontFamily: Font.numFontFamily,
    },
    assets_l1_last_ratio: {
        marginRight: text(4),
        color: Colors.darkGrayColor,
    },
    assets_l1_ratio: {
        textAlign: 'right',
        marginRight: text(12),
        width: text(40),
        color: Colors.defaultColor,
    },
    assets_l2: {
        flexDirection: 'row',
        height: text(49),
        borderTopWidth: Space.borderWidth,
        borderTopColor: Colors.borderColor,
        borderStyle: 'solid',
        paddingRight: text(24),
    },
    assets_l2_name: {
        fontSize: Font.textH2,
        lineHeight: text(16),
        color: Colors.descColor,
        marginBottom: text(4),
    },
    assets_l2_code: {
        fontSize: Font.textSm,
        lineHeight: text(12),
        color: Colors.darkGrayColor,
        fontFamily: Font.numFontFamily,
        fontWeight: 'bold',
    },
    assets_l2_right: {
        fontSize: text(13),
        lineHeight: text(16),
        fontFamily: Font.numFontFamily,
    },
    assets_l2_ratio: {
        textAlign: 'right',
        width: text(40),
        color: Colors.defaultColor,
    },
    assets_l2_last_ratio: {
        marginRight: text(4),
        color: Colors.darkGrayColor,
    },
});

export default HistoryAdjust;
