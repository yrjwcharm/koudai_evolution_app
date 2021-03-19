/*
 * @Date: 2021-01-23 10:29:49
 * @Author: dx
 * @LastEditors: dx
 * @LastEditTime: 2021-03-18 17:56:27
 * @Description: 历史调仓记录
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput as Input} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import http from '../../services';
import {px as text, isIphoneX} from '../../utils/appUtil';
import {Style, Colors, Space, Font} from '../../common/commonStyle';
import {Chart} from '../../components/Chart';
import {basicPieChart} from './components/ChartOption';

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

const HistoryAdjust = ({navigation, route}) => {
    const [activeSections, setActiveSections] = useState([]);
    const [data, setData] = useState({});
    const [chart, setChart] = useState([]);
    useEffect(() => {
        http.get('/portfolio/adjust_history/20210101', {
            adjust_id: route.params?.adjust_id,
            upid: route.params?.upid,
            scene: route.params?.fr || 'portfolio',
        }).then((res) => {
            setData(res.result);
            // navigation.setOptions({title: res.result.title});
            setChart(
                res.result.deploy_detail
                    ?.filter((item) => item.ratio !== 0)
                    .map((item) => ({
                        a: '1',
                        name: item.name,
                        percent: (item.ratio * 100).toFixed(2) * 1,
                    }))
            );
        });
    }, [navigation, route]);
    const renderContent = useCallback(
        // 手风琴内容渲染
        (section) => {
            return (
                <>
                    {section?.items?.map((item, index) => {
                        return (
                            <View key={item.code} style={[styles.assets_l2, Style.flexBetween]}>
                                <View>
                                    <Text style={[styles.assets_l2_name]}>{item.name}</Text>
                                    <Text style={[styles.assets_l2_code]}>{item.code}</Text>
                                </View>
                                <View style={[styles.assets_l2_right, {flexDirection: 'row'}]}>
                                    <Text style={[styles.assets_l2_last_ratio, styles.assets_l2_right]}>
                                        {item.pre_percent}
                                    </Text>
                                    <Icon name={'arrow-right-alt'} size={20} color={Colors.darkGrayColor} />
                                    <Text style={[styles.assets_l2_ratio, styles.assets_l2_right]}>{item.percent}</Text>
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
                        <Text style={[styles.assets_l1_last_ratio, styles.rightPart]}>{section.pre_percent}</Text>
                        <Icon name={'arrow-right-alt'} size={20} color={Colors.darkGrayColor} />
                        <Text style={[styles.assets_l1_ratio, styles.rightPart]}>{section.percent}</Text>
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
                        <Text style={styles.topTitle}>{data.title}</Text>
                        {/* <View style={[styles.percent_bar, Style.flexRow]}>
                            {data.deploy_detail &&
                                data.deploy_detail.map((item, index) => (
                                    <View
                                        key={item.name}
                                        style={[
                                            styles.barPart,
                                            {
                                                backgroundColor: RatioColor[index],
                                                width: `${(item.ratio * 100).toFixed(2)}%`,
                                            },
                                        ]}
                                    />
                                ))}
                        </View> */}
                        <View style={{height: text(288)}}>
                            <Chart initScript={basicPieChart(chart)} data={chart} />
                        </View>
                        {data?.intros?.content && (
                            <View style={{marginTop: text(8)}}>
                                <Text style={[styles.intro_title]}>{data.intros.title}</Text>
                                <Text style={[styles.intro_content]}>{data.intros.content}</Text>
                            </View>
                        )}
                    </View>
                    <View style={[styles.deploy_detail]}>
                        <Accordion
                            activeSections={activeSections}
                            expandMultiple
                            onChange={updateSections}
                            renderContent={renderContent}
                            renderHeader={renderHeader}
                            sections={data.deploy_detail || []}
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
