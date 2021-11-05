/*
 * @Date: 2021-11-04 15:53:11
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-11-05 16:38:16
 * @Description: 挑选基金
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View, Text, Platform, TouchableOpacity} from 'react-native';
import http from '../../services';
import {px, px as text} from '../../utils/appUtil';
import {Style, Colors, Space, Font} from '../../common/commonStyle';
import BottomDesc from '../../components/BottomDesc';
import FixedBtn from './components/FixedBtn';
import Loading from './components/PageLoading';

const RatioColor = [
    '#E1645C',
    '#6694F3',
    '#F8A840',
    '#CC8FDD',
    '#5DC162',
    '#C7AC6B',
    '#62C4C7',
    '#E97FAD',
    '#C2E07F',
    '#B1B4C5',
    '#E78B61',
    '#8683C9',
    '#EBDD69',
];

export default ({navigation, route}) => {
    const [data, setData] = useState({
        title: '挑选基金',
        desc: '理财魔方已优选市场业绩领先的基金，请您按照大类资产配置进行挑选，默认为平均分配。',
        deploy_detail: [
            {
                color: '#5DC162',
                name: '优质债券',
                ratio: 0.4455,
                percent: '44.55%',
                pre_ration: 0.42999999999999994,
                pre_percent: '43.00%',
                items: [
                    {
                        ratio: 0,
                        pre_ratio: '0.0860',
                        code: '000149',
                        name: '华安双债添利A',
                        percent: '0.00%',
                        pre_percent: '8.60%',
                    },
                    {
                        ratio: '0.1485',
                        pre_ratio: '0.0860',
                        code: '040040',
                        name: '华安纯债A',
                        percent: '14.85%',
                        pre_percent: '8.60%',
                    },
                    {
                        ratio: '0.1485',
                        pre_ratio: '0.0860',
                        code: '000024',
                        name: '大摩双利增强A',
                        percent: '14.85%',
                        pre_percent: '8.60%',
                    },
                    {
                        ratio: '0.1485',
                        pre_ratio: '0.0860',
                        code: '000420',
                        name: '大摩优质信价纯债C',
                        percent: '14.85%',
                        pre_percent: '8.60%',
                    },
                    {
                        ratio: 0,
                        pre_ratio: '0.0860',
                        code: '006015',
                        name: '华安信用四季红C',
                        percent: '0.00%',
                        pre_percent: '8.60%',
                    },
                ],
            },
            {
                color: '#E1645C',
                name: '大盘股票',
                ratio: 0.1927,
                percent: '19.27%',
                pre_ration: 0.19240000000000002,
                pre_percent: '19.24%',
                items: [
                    {
                        ratio: 0,
                        pre_ratio: '0.0384',
                        code: '481017',
                        name: '工银瑞信量化策略A',
                        percent: '0.00%',
                        pre_percent: '3.84%',
                    },
                    {
                        ratio: 0,
                        pre_ratio: '0.0385',
                        code: '450003',
                        name: '国富潜力组合A人民币',
                        percent: '0.00%',
                        pre_percent: '3.85%',
                    },
                    {
                        ratio: '0.0386',
                        pre_ratio: '0.0385',
                        code: '001043',
                        name: '工银瑞信美丽城镇主题A',
                        percent: '3.86%',
                        pre_percent: '3.85%',
                    },
                    {
                        ratio: '0.0385',
                        pre_ratio: '0.0385',
                        code: '002340',
                        name: '富国价值优势',
                        percent: '3.85%',
                        pre_percent: '3.85%',
                    },
                    {
                        ratio: 0,
                        pre_ratio: '0.0385',
                        code: '003857',
                        name: '前海开源周期优选A',
                        percent: '0.00%',
                        pre_percent: '3.85%',
                    },
                    {
                        ratio: '0.0386',
                        pre_ratio: 0,
                        code: '001054',
                        name: '工银瑞信新金融A',
                        percent: '3.86%',
                        pre_percent: '0.00%',
                    },
                    {
                        ratio: '0.0385',
                        pre_ratio: 0,
                        code: '005739',
                        name: '富国转型机遇',
                        percent: '3.85%',
                        pre_percent: '0.00%',
                    },
                    {
                        ratio: '0.0385',
                        pre_ratio: 0,
                        code: '004788',
                        name: '富荣沪深300增强A',
                        percent: '3.85%',
                        pre_percent: '0.00%',
                    },
                ],
            },
            {
                color: '#5687EB',
                name: '科技创新股票',
                ratio: 0.16699999999999998,
                percent: '16.70%',
                pre_ration: 0.17600000000000002,
                pre_percent: '17.60%',
                items: [
                    {
                        ratio: 0,
                        pre_ratio: '0.0352',
                        code: '000124',
                        name: '华宝服务优选',
                        percent: '0.00%',
                        pre_percent: '3.52%',
                    },
                    {
                        ratio: '0.0334',
                        pre_ratio: '0.0352',
                        code: '000793',
                        name: '工银瑞信高端制造行业',
                        percent: '3.34%',
                        pre_percent: '3.52%',
                    },
                    {
                        ratio: 0,
                        pre_ratio: '0.0352',
                        code: '001701',
                        name: '中融产业升级',
                        percent: '0.00%',
                        pre_percent: '3.52%',
                    },
                    {
                        ratio: 0,
                        pre_ratio: '0.0352',
                        code: '003145',
                        name: '中融竞争优势',
                        percent: '0.00%',
                        pre_percent: '3.52%',
                    },
                    {
                        ratio: 0,
                        pre_ratio: '0.0352',
                        code: '519778',
                        name: '交银经济新动力',
                        percent: '0.00%',
                        pre_percent: '3.52%',
                    },
                    {
                        ratio: '0.0334',
                        pre_ratio: 0,
                        code: '000409',
                        name: '鹏华环保产业',
                        percent: '3.34%',
                        pre_percent: '0.00%',
                    },
                    {
                        ratio: '0.0334',
                        pre_ratio: 0,
                        code: '481015',
                        name: '工银瑞信主题策略A',
                        percent: '3.34%',
                        pre_percent: '0.00%',
                    },
                    {
                        ratio: '0.0334',
                        pre_ratio: 0,
                        code: '001245',
                        name: '工银瑞信生态环境',
                        percent: '3.34%',
                        pre_percent: '0.00%',
                    },
                    {
                        ratio: '0.0334',
                        pre_ratio: 0,
                        code: '002939',
                        name: '广发创新升级',
                        percent: '3.34%',
                        pre_percent: '0.00%',
                    },
                ],
            },
            {
                color: '#E18A31',
                name: '香港优质资产',
                ratio: 0.0936,
                percent: '9.36%',
                pre_ration: 0.0852,
                pre_percent: '8.52%',
                items: [
                    {
                        ratio: '0.0234',
                        pre_ratio: '0.0213',
                        code: '100055',
                        name: '富国全球科技互联网',
                        percent: '2.34%',
                        pre_percent: '2.13%',
                    },
                    {
                        ratio: '0.0234',
                        pre_ratio: '0.0213',
                        code: '457001',
                        name: '国富亚洲机会',
                        percent: '2.34%',
                        pre_percent: '2.13%',
                    },
                    {
                        ratio: 0,
                        pre_ratio: '0.0213',
                        code: '164906',
                        name: '中概互联网LOF',
                        percent: '0.00%',
                        pre_percent: '2.13%',
                    },
                    {
                        ratio: '0.0234',
                        pre_ratio: '0.0213',
                        code: '001691',
                        name: '南方香港成长',
                        percent: '2.34%',
                        pre_percent: '2.13%',
                    },
                    {
                        ratio: '0.0234',
                        pre_ratio: 0,
                        code: '100061',
                        name: '富国中国中小盘人民币',
                        percent: '2.34%',
                        pre_percent: '0.00%',
                    },
                ],
            },
            {
                color: '#E18A31',
                name: '美国创新股票',
                ratio: 0.0714,
                percent: '7.14%',
                pre_ration: 0.07919999999999999,
                pre_percent: '7.92%',
                items: [
                    {
                        ratio: '0.0238',
                        pre_ratio: '0.0264',
                        code: '000834',
                        name: '大成纳斯达克100',
                        percent: '2.38%',
                        pre_percent: '2.64%',
                    },
                    {
                        ratio: '0.0238',
                        pre_ratio: '0.0264',
                        code: '040046',
                        name: '华安纳斯达克100人民币',
                        percent: '2.38%',
                        pre_percent: '2.64%',
                    },
                    {
                        ratio: '0.0238',
                        pre_ratio: '0.0264',
                        code: '001668',
                        name: '汇添富全球移动互联',
                        percent: '2.38%',
                        pre_percent: '2.64%',
                    },
                ],
            },
            {
                color: '#62B4C7',
                name: '避险资产',
                ratio: 0.0298,
                percent: '2.98%',
                pre_ration: 0.0372,
                pre_percent: '3.72%',
                items: [
                    {
                        ratio: '0.0149',
                        pre_ratio: '0.0186',
                        code: '000217',
                        name: '华安易富黄金ETF联接C',
                        percent: '1.49%',
                        pre_percent: '1.86%',
                    },
                    {
                        ratio: '0.0149',
                        pre_ratio: '0.0186',
                        code: '002611',
                        name: '博时黄金ETF联接C',
                        percent: '1.49%',
                        pre_percent: '1.86%',
                    },
                ],
            },
        ],
        btns: [
            {
                title: '咨询',
                icon: 'https://static.licaimofang.com/wp-content/uploads/2021/04/ke_fu_1@3x.png',
                url: '',
                subs: [
                    {
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2021/03/kefu_phone@3x.png',
                        title: '电话咨询专家',
                        desc: '与专家电话，问题解答更明白',
                        recommend: 0,
                        btn: {
                            title: '拨打电话',
                        },
                        type: 'tel',
                        sno: '4000808208',
                    },
                    {
                        icon: 'https://static.licaimofang.com/wp-content/uploads/2021/03/kefu@3x.png',
                        title: '在线咨询',
                        desc: '专家在线解决问题，10秒内回复',
                        recommend: 0,
                        btn: {
                            title: '立即咨询',
                        },
                        type: 'im',
                    },
                ],
            },
            {
                title: '立即购买',
                icon: '',
                url: {
                    path: 'TradeBuy',
                    type: 1,
                    params: {
                        poid: 'X00F448659',
                    },
                },
                desc: '',
            },
        ],
    });

    useEffect(() => {
        console.log('route.params----', route.params);
    }, [route]);

    return (
        <>
            {Object.keys(data).length > 0 ? (
                <ScrollView style={styles.container} scrollIndicatorInsets={{right: 1}}>
                    <View style={styles.topPart}>
                        <View style={[Style.flexRow, styles.percent_bar]}>
                            {data?.deploy_detail.map((item, index) => (
                                <View
                                    key={item + index}
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
                        <Text style={styles.desc}>{data?.desc}</Text>
                    </View>
                    <View style={{marginTop: px(8)}}>
                        {data?.deploy_detail?.map?.((asset, index) => {
                            return (
                                <View
                                    key={asset + index}
                                    style={{borderTopWidth: index === 0 ? 0 : Space.borderWidth, ...styles.asset_box}}>
                                    <View style={[Style.flexBetween, {paddingVertical: Space.padding}]}>
                                        <View style={Style.flexRow}>
                                            <View style={[styles.circle, {backgroundColor: RatioColor[index]}]} />
                                            <Text style={styles.assetName}>
                                                {asset.name} {asset.percent}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() =>
                                                navigation.navigate('FundAdjust', {
                                                    color: RatioColor[index],
                                                    name: asset.name,
                                                })
                                            }>
                                            <Text style={styles.updateSty}>调整比例</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {asset.items?.map?.((fund, idx) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                key={fund + idx}
                                                onPress={() =>
                                                    navigation.navigate('FundDetail', {
                                                        code: fund.code || fund.fund_code,
                                                    })
                                                }
                                                style={[Style.flexBetween, styles.fund_box]}>
                                                <View>
                                                    <Text style={styles.fundName}>{fund.name}</Text>
                                                    <Text style={styles.fundCode}>{fund.code}</Text>
                                                </View>
                                                <Text style={styles.fundPercent}>{fund.percent}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>
                    <BottomDesc />
                </ScrollView>
            ) : (
                <Loading />
            )}
            {Object.keys(data).length > 0 && data.btns && <FixedBtn btns={data.btns} />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    topPart: {
        padding: Space.padding,
        paddingTop: text(12),
        backgroundColor: '#fff',
    },
    percent_bar: {
        width: '100%',
        height: text(24),
    },
    barPart: {
        height: '100%',
    },
    desc: {
        marginTop: text(8),
        fontSize: text(13),
        lineHeight: text(22),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    asset_box: {
        paddingHorizontal: Space.padding,
        borderColor: Colors.borderColor,
        backgroundColor: '#fff',
    },
    circle: {
        width: text(10),
        height: text(10),
        borderRadius: text(5),
        marginRight: text(8),
    },
    assetName: {
        fontSize: text(15),
        lineHeight: text(21),
        color: Colors.defaultColor,
        fontWeight: Platform.select({android: '700', ios: '500'}),
    },
    updateSty: {
        fontSize: Font.textH3,
        lineHeight: text(17),
        color: Colors.brandColor,
    },
    fund_box: {
        paddingVertical: text(12),
        paddingRight: text(2),
        paddingLeft: text(18),
        borderTopWidth: Space.borderWidth,
        borderColor: Colors.borderColor,
    },
    fundName: {
        fontSize: text(13),
        lineHeight: text(18),
        color: Colors.defaultColor,
    },
    fundCode: {
        marginTop: text(4),
        fontSize: Font.textSm,
        lineHeight: text(12),
        color: Colors.lightGrayColor,
    },
    fundPercent: {
        fontSize: Font.textH3,
        lineHeight: text(15),
        color: Colors.defaultColor,
        fontFamily: Font.numMedium,
    },
});
