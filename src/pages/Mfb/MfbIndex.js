/*
 * @Description:魔方宝详情
 * @Author: xjh
 * @Date: 2021-01-23 15:41:34
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-23 18:17:31
 */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Font, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../components/NavBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../../components/Button';
import Accordion from 'react-native-collapsible/Accordion';
import BottomDesc from '../../components/BottomDesc';

export default function MfbIndex() {
    const [data, setData] = useState({});
    const [activeSections, setActiveSections] = useState([0]);
    const updateSections = (activeSections) => setActiveSections(activeSections);
    const rightPress = () => {
        props.navigation.navigate(data.part4.url);
    };
    const bottom = {
        image: 'https://static.licaimofang.com/wp-content/uploads/2020/12/endorce_CMBC.png',
        desc: [
            {
                title: '基金销售服务由玄元保险提供',
            },
            {
                title: '基金销售资格证号:000000803',
                btn: {
                    text: '详情',
                    url: '/article_detail/79',
                },
            },
            {
                title: '市场有风险，投资需谨慎',
            },
        ],
    };
    useEffect(() => {
        Http.get('http://kapi-web.wanggang.mofanglicai.com.cn:10080/doc/wallet/holding/20210101').then((res) => {
            setData(res.result);
        });
    }, []);
    const jumpPage = (url) => {
        props.navigation.navigate(url);
    };

    const renderHeader = (section, index, isActive) => {
        const border = index < data.part2.funds.length - 1 ? 0.5 : 0;
        const paddingBottom = index < data.part2.funds.length - 1 ? text(18) : 0;
        return (
            <>
                <View style={[Style.flexRow, {marginTop: text(8)}]}>
                    <View style={{flex: 1}}>
                        <Text style={styles.hold_title_sty}>
                            {section.name} <Text style={styles.section_title_sty}>({section.code})</Text>
                        </Text>
                    </View>
                    <AntDesign name={`${isActive ? 'up' : 'down'}`} color={'#9095A5'} size={12} />
                </View>
                <View
                    style={[
                        styles.section_sty,
                        {
                            borderBottomWidth: border,
                            borderColor: Colors.borderColor,
                            paddingBottom: paddingBottom,
                        },
                    ]}>
                    <View style={Style.flexBetween}>
                        <View style={{flex: 1}}>
                            <Text style={styles.section_title_sty}>持有金额(元)</Text>
                            <Text style={[styles.section_num_sty]}>{section.amount}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.section_title_sty, {textAlign: 'center'}]}>日收益</Text>
                            <Text style={[styles.section_num_sty, {textAlign: 'center'}]}>{section.profit}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.section_title_sty, {textAlign: 'right'}]}>累计受益</Text>
                            <Text style={[styles.section_num_sty, {textAlign: 'right'}]}>{section.profit_acc}</Text>
                        </View>
                    </View>
                </View>
            </>
        );
    };
    const renderContent = (section) => {
        return (
            <View style={styles.section_sty}>
                <View style={Style.flexRow}>
                    <View style={{width: '33%'}}>
                        <Text style={styles.section_title_sty}>持有金额(元)</Text>
                        <Text style={[styles.section_num_sty]}>{section.amount}</Text>
                    </View>
                    <View style={{width: '33%'}}>
                        <Text style={[styles.section_title_sty, {textAlign: 'center'}]}>日收益</Text>
                        <Text style={[styles.section_num_sty, {textAlign: 'center'}]}>{section.profit}</Text>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <SafeAreaView edges={['bottom']}>
            <Header
                title={'魔方宝'}
                leftIcon="chevron-left"
                rightText={'交易记录'}
                rightPress={rightPress}
                rightTextStyle={styles.right_sty}
                fontStyle={{color: '#fff'}}
                style={{backgroundColor: '#0052CD'}}
            />
            {Object.keys(data).length > 0 && (
                <ScrollView>
                    <View style={styles.bg_sty}></View>
                    <View style={Style.containerPadding}>
                        <View style={[styles.card_sty, Style.flexCenter]}>
                            <Text style={Style.descSty}>总金额(元){data.part1.date}</Text>
                            <Text style={styles.amount_sty}>{data.part1.amount}</Text>
                            <View style={[Style.flexRowCenter, {marginTop: text(20)}]}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.top_text_sty}>日收益</Text>
                                    <Text style={styles.bottom_num_sty}>{data.part1.profit}</Text>
                                </View>
                                <View style={{flex: 1, textAlign: 'center'}}>
                                    <Text style={styles.top_text_sty}>累计受益</Text>
                                    <Text style={styles.bottom_num_sty}>{data.part1.profit_acc}</Text>
                                </View>
                            </View>
                            <View style={styles.btn_wrap_sty}>
                                <Button
                                    title={data.btns[0].text}
                                    style={styles.btn_st_sty}
                                    textStyle={{color: '#333'}}
                                    disables={data.btns[0].avail}
                                    onPress={() => jumpPage(data.btns[0].url)}
                                />
                                <Button
                                    title={data.btns[0].text}
                                    style={{flex: 1}}
                                    onPress={() => jumpPage(data.btns[1].url)}
                                    disables={data.btns[1].avail}
                                />
                            </View>
                        </View>
                        <View>
                            <Text style={styles.title_sty}>{data.part2.title}</Text>
                            <View style={styles.card_list_sty}>
                                <Accordion
                                    sections={data.part2.funds}
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
                        <View>
                            <View style={[Style.flexRow, {marginTop: text(20)}]}>
                                <Text style={[styles.title_sty, {flex: 1, marginTop: 0}]}>{data.part3.title}</Text>
                                <TouchableOpacity
                                    style={{color: '#0051CC', fontSize: text(11)}}
                                    onPress={() => jumpPage(data.part3.btn.url)}>
                                    <Text> {data.part3.btn.text}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.card_list_sty, {paddingVertical: text(8)}]}>
                                {data.part3.detail.map((_item, _index) => {
                                    return <Html key={_index + '_item'} html={_item} style={{lineHeight: 24}} />;
                                })}
                            </View>
                        </View>
                    </View>
                    <BottomDesc data={bottom} style={{paddingBottom: 100}} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    right_sty: {
        marginRight: text(16),
        color: '#fff',
    },
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
        fontWeight: 'bold',
        fontFamily: Font.numFontFamily,
        marginTop: text(10),
    },
});
