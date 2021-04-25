/*
 * @Description:魔方宝详情
 * @Author: xjh
 * @Date: 2021-01-23 15:41:34
 * @LastEditors: xjh
 * @LastEditTime: 2021-03-31 17:56:56
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Style} from '../../common/commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/NavBar';
import {Button} from '../../components/Button';
import Accordion from 'react-native-collapsible/Accordion';
import BottomDesc from '../../components/BottomDesc';
import {useJump} from '../../components/hooks';
import {useFocusEffect} from '@react-navigation/native';
const btnHeight = isIphoneX() ? text(90) : text(66);
export default function MfbIndex(props) {
    const [data, setData] = useState({});
    const [activeSections, setActiveSections] = useState([0]);
    const updateSections = (activeSections) => setActiveSections(activeSections);
    const jump = useJump();
    const rightPress = () => {
        props.navigation.navigate('TradeRecord', {fr: 'mfb'});
    };
    useFocusEffect(
        useCallback(() => {
            Http.get('/wallet/holding/20210101').then((res) => {
                setData(res.result);
            });
        }, [])
    );
    const getColor = useCallback((t) => {
        if (!t) {
            return Colors.defaultColor;
        }
        if (parseFloat(t.replace(/,/g, '')) < 0) {
            return Colors.green;
        } else if (parseFloat(t.replace(/,/g, '')) > 0) {
            return Colors.red;
        } else {
            return Colors.defaultColor;
        }
    }, []);
    // const jumpPage = (url, params) => {
    //     props.navigation.navigate(url, params);
    // };
    const renderHeader = (section, index, isActive) => {
        return (
            <>
                <View style={[Style.flexRow, {marginTop: text(8)}]}>
                    <View style={{flex: 1}}>
                        <Text style={styles.hold_title_sty}>{section.name}</Text>
                    </View>
                    <AntDesign name={`${isActive ? 'up' : 'down'}`} color={'#9095A5'} size={12} />
                </View>
                <View style={[styles.section_sty]}>
                    <View style={Style.flexBetween}>
                        <View style={{flex: 1}}>
                            <Text style={styles.section_title_sty}>持有金额</Text>
                            <Text style={[styles.section_num_sty]}>{section.amount}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.section_title_sty, {textAlign: 'center'}]}>日收益</Text>
                            <Text
                                style={[
                                    styles.section_num_sty,
                                    {textAlign: 'center', color: getColor(section.profit)},
                                ]}>
                                {section.profit}
                            </Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.section_title_sty, {textAlign: 'right'}]}>累计收益</Text>
                            <Text
                                style={[
                                    styles.section_num_sty,
                                    {textAlign: 'right', color: getColor(section.profit_acc)},
                                ]}>
                                {section.profit_acc}
                            </Text>
                        </View>
                    </View>
                </View>
            </>
        );
    };
    const renderContent = (section, index) => {
        const border = index < data.funds.length - 1 ? 0.5 : 0;
        const paddingBottom = index < data.funds.length - 1 ? text(18) : 0;
        return (
            <View
                style={[
                    styles.section_sty,
                    {borderBottomWidth: border, paddingBottom: paddingBottom, borderColor: Colors.borderColor},
                ]}>
                <View style={Style.flexRow}>
                    <View style={{width: '33%'}}>
                        <Text style={styles.section_title_sty}>七日年化(%)</Text>
                        <Text style={[styles.section_num_sty]}>{section.return_week}</Text>
                    </View>
                    <View style={{width: '33%'}}>
                        <Text style={[styles.section_title_sty, {textAlign: 'center'}]}>万份收益(元)</Text>
                        <Text style={[styles.section_num_sty, {textAlign: 'center'}]}>{section.return_daily}</Text>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <View style={{flex: 1, backgroundColor: Colors.bgColor}}>
            <Header
                title={'魔方宝'}
                leftIcon="chevron-left"
                rightText={'交易记录'}
                rightPress={rightPress}
                rightTextStyle={{color: '#fff', marginRight: text(6)}}
                fontStyle={{color: '#fff'}}
                titleStyle={{marginRight: text(-20)}}
                style={{backgroundColor: '#0052CD'}}
            />
            {Object.keys(data).length > 0 && (
                <ScrollView style={{flex: 1}} bounces={false} scrollIndicatorInsets={{right: 1}}>
                    <View style={styles.bg_sty} />
                    <View style={[Style.containerPadding]}>
                        <View style={[styles.card_sty, Style.flexCenter]}>
                            <Text style={Style.descSty}>总金额(元){data.holding.date}</Text>
                            <Text style={styles.amount_sty}>{data.holding.amount}</Text>
                            <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.top_text_sty}>日收益</Text>
                                    <Text style={[styles.bottom_num_sty, {color: getColor(data?.holding?.profit)}]}>
                                        {data?.holding?.profit}
                                    </Text>
                                </View>
                                <View style={{flex: 1, textAlign: 'center'}}>
                                    <Text style={styles.top_text_sty}>累计收益</Text>
                                    <Text style={[styles.bottom_num_sty, {color: getColor(data?.holding?.profit_acc)}]}>
                                        {data?.holding?.profit_acc}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.btn_wrap_sty}>
                                <Button
                                    title={data.buttons[0].text}
                                    style={styles.btn_st_sty}
                                    textStyle={{color: '#333'}}
                                    disables={data.buttons[0].avail}
                                    onPress={() => jump(data.buttons[0].url)}
                                    color={'#fff'}
                                />
                                <Button
                                    title={data.buttons[1].text}
                                    style={{flex: 1}}
                                    onPress={() => jump(data.buttons[1].url)}
                                    disables={data.buttons[1].avail}
                                />
                            </View>
                        </View>
                        {data?.funds?.length > 0 && (
                            <View>
                                <Text style={styles.title_sty}>持有信息</Text>
                                <View style={styles.card_list_sty}>
                                    <Accordion
                                        sections={data.funds}
                                        expandMultiple
                                        touchableProps={{activeOpacity: 1}}
                                        activeSections={activeSections}
                                        renderHeader={renderHeader}
                                        renderContent={renderContent}
                                        onChange={updateSections}
                                        sectionContainerStyle={{marginBottom: text(12)}}
                                        touchableComponent={TouchableOpacity}
                                    />
                                </View>
                            </View>
                        )}
                        <View>
                            <View style={[Style.flexRow, {marginTop: text(20)}]}>
                                <Text style={[styles.title_sty, {flex: 1, marginTop: 0}]}>魔方宝</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{color: '#0051CC', fontSize: text(11)}}
                                    onPress={() => props.navigation.navigate('MfbIntro')}>
                                    <Text style={{color: '#0051CC', fontSize: text(11)}}>查看更多</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.card_list_sty, {paddingVertical: text(16)}]}>
                                {data.intro.map((_item, _index) => {
                                    return (
                                        <Html
                                            key={_index + '_item'}
                                            html={_item}
                                            style={{lineHeight: 22, color: '#4E556C', fontSize: text(12)}}
                                        />
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                    <BottomDesc />
                </ScrollView>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    bg_sty: {
        backgroundColor: '#0052CD',
        height: text(120),
        width: '100%',
    },
    card_sty: {
        backgroundColor: '#fff',
        paddingVertical: text(25),
        marginTop: text(-130),
        borderRadius: text(10),
        paddingHorizontal: text(16),
    },
    amount_sty: {
        color: '#1F2432',
        fontSize: text(36),
        fontFamily: Font.numFontFamily,
        paddingTop: text(5),
    },
    top_text_sty: {
        fontSize: text(12),
        color: '#9095A5',
        textAlign: 'center',
    },
    bottom_num_sty: {
        color: '#1F2432',
        fontSize: text(18),
        fontFamily: Font.numFontFamily,
        textAlign: 'center',
        marginTop: text(8),
    },
    btn_wrap_sty: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: text(30),
    },
    btn_st_sty: {
        flex: 1,
        marginRight: text(10),
        backgroundColor: '#fff',
        borderWidth: 0.5,
    },
    card_list_sty: {
        paddingVertical: text(10),
        paddingHorizontal: text(16),
        backgroundColor: '#fff',
        borderRadius: text(10),
        marginTop: text(12),
    },
    title_sty: {
        color: Colors.defaultColor,
        fontSize: Font.textH1,
        fontWeight: 'bold',
        marginTop: text(24),
    },
    hold_title_sty: {
        color: '#1F2432',
    },
    section_sty: {
        marginTop: text(18),
    },
    section_title_sty: {
        color: '#9095A5',
        fontSize: Font.textH3,
    },
    section_num_sty: {
        color: '#1F2432',
        fontSize: Font.textH2,
        // fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
        marginTop: text(10),
    },
});
