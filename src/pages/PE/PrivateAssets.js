/*
 * @Author: xjh
 * @Date: 2021-02-22 16:42:30
 * @Description:私募持仓
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-22 18:24:23
 */
import React, {useState, useCallback} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Header from '../../components/NavBar';
import TabBar from '../../components/TabBar.js';
import Video from '../../components/Video';
import FitImage from 'react-native-fit-image';
import {FixedButton} from '../../components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NumText from '../../components/NumText';
const deviceWidth = Dimensions.get('window').width;
const btnHeight = isIphoneX() ? text(90) : text(66);

export default function PrivateAssets() {
    const [showEye, setShowEye] = useState('true');
    const [data, setData] = useState({
        tabs: [
            {
                type: 'baseInfo',
                title: '基本信息',
                content: [
                    {title: '基本信息', desc: '安志魔方量化对冲私募证券投资基金FOF1号'},
                    {title: '基本信息', desc: '安志魔方量化对冲私募证券投资基金FOF1号'},
                ],
            },
            {
                type: 'video',
                title: '路演视频',
                content: {
                    title: '魔方私募对冲FOF1号路演视频',
                    subtitle: '107845人观看',
                    video: 'https://static.licaimofang.com/wp-content/themes/mf-themes/media/simu.mp4',
                },
            },
            {
                type: 'notice',
                title: '公告',
                content: [
                    {
                        title: '魔方私募对冲FOF1号产品成立公告',
                        publish_at: '2019-09-06',
                        url: 'https://static.licaimofang.com/wp-content/uploads/2019/09/产品成立公告.pdf',
                    },
                ],
            },
        ],
        tab_list: [
            {
                title: '净值',
                table: {
                    head: ['日期', '单位净值', '累计净值', '涨跌幅'],
                    body: [
                        ['2020/07/16', 1.23, 1.234, '+1.24'],
                        ['2020/07/16', 1.23, 1.234, '-1.24'],
                        ['2020/07/16', 1.23, 1.234, '+1.24'],
                        ['2020/07/16', 1.23, 1.234, '-1.24'],
                        ['2020/07/16', 1.23, 1.234, '+1.24'],
                        ['2020/07/16', 1.23, 1.234, '-1.24'],
                    ],
                },
            },
            {title: '风险指标'},
        ],
    });
    const [left, setLeft] = useState('100%');
    const rightPress = () => {};
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            setShowEye(show === 'true' ? 'false' : 'true');
            storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
        });
    }, []);
    const getColor = useCallback(() => {
        if (parseFloat(text.replaceAll(',', '')) < 0) {
            return Colors.green;
        } else if (parseFloat(text.replaceAll(',', '')) === 0) {
            return Colors.defaultColor;
        } else {
            return Colors.red;
        }
    }, [text]);
    const renderContent = (index, data) => {
        console.log(data);
        if (index === 0) {
            return <View style={{backgroundColor: '#fff'}}></View>;
        } else if (index === 1) {
            return (
                <>
                    <View style={[Style.flexRow, styles.item_list]}>
                        <Text style={{flex: 1}}>{data.content.title}</Text>
                        <Text>{data.content.subtitle}</Text>
                    </View>
                    <View style={[Style.flexCenter]}>
                        <Video url={data.content.video} />
                    </View>
                </>
            );
        } else if (index === 2) {
            return (
                <>
                    {data.content.map((_i, _d) => {
                        return (
                            <TouchableOpacity
                                style={[
                                    Style.flexRow,
                                    styles.item_list,
                                    {backgroundColor: _d % 2 == 0 ? '#fff' : '#F7F8FA'},
                                ]}
                                key={'list' + _d}>
                                <Text style={{flex: 1, fontSize: text(13)}}>{_i.title}</Text>
                                <Text style={{fontSize: text(13)}}>{_i.publish_at}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </>
            );
        }
    };
    const renderItem = (index, data) => {
        if (index === 0) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <View style={[Style.flexRow, {backgroundColor: '#F7F8FA'}]}>
                        {data.table.head.map((_head, _index) => {
                            return (
                                <Text
                                    style={[
                                        styles.table_title_sty,
                                        {
                                            textAlign:
                                                _index == 0
                                                    ? 'left'
                                                    : _index == data.table.head.length - 1
                                                    ? 'right'
                                                    : 'center',
                                            color: '#9095A5',
                                            flex: _index == 0 ? 1 : 0,
                                        },
                                    ]}
                                    key={_index + '_head'}>
                                    {_head}
                                </Text>
                            );
                        })}
                    </View>
                    <View>
                        {data.table.body.slice(0, 4).map((_body, _index) => {
                            return (
                                <View
                                    key={_index + '_body'}
                                    style={[Style.flexRow, {backgroundColor: _index % 2 == 0 ? '#fff' : '#F7F8FA'}]}>
                                    {_body.map((_td, _i) => {
                                        return (
                                            <Text
                                                key={_td + '_i'}
                                                style={[
                                                    styles.table_title_sty,
                                                    {
                                                        textAlign:
                                                            _i == 0
                                                                ? 'left'
                                                                : _i == _body.length - 1
                                                                ? 'right'
                                                                : 'center',
                                                        flex: _i == 0 ? 1 : 0,
                                                        color:
                                                            _i == _body.length - 1
                                                                ? parseFloat(_td.replaceAll(',', '')) < 0
                                                                    ? Colors.green
                                                                    : Colors.red
                                                                : '',
                                                    },
                                                ]}>
                                                {_td}
                                            </Text>
                                        );
                                    })}
                                </View>
                            );
                        })}
                        <Text style={styles.text_sty}>
                            更多净值
                            <AntDesign name={'right'} size={12} color={'#9095A5'} />
                        </Text>
                    </View>
                </View>
            );
        }
    };
    return (
        <View style={{flex: 1}}>
            <Header
                title={'魔方FOF'}
                leftIcon="chevron-left"
                style={{backgroundColor: '#D7AF74'}}
                fontStyle={{color: '#fff'}}
                rightText={'交易记录'}
                rightPress={() => rightPress()}
                rightTextStyle={styles.right_sty}
            />
            <ScrollView>
                <View style={styles.assets_card_sty}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <View style={[Style.flexRow, {marginBottom: text(15)}]}>
                                <Text style={styles.profit_text_sty}>总金额(元)</Text>
                                <TouchableOpacity onPress={toggleEye}>
                                    <Ionicons
                                        name={showEye === 'true' ? 'eye-outline' : 'eye-off-outline'}
                                        size={16}
                                        color={'rgba(255, 255, 255, 0.8)'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.profit_num_sty, {fontSize: text(24)}]}>4,364,000.70</Text>
                        </View>
                        <View>
                            <View style={[Style.flexRow, {marginBottom: text(15), alignSelf: 'flex-end'}]}>
                                <Text style={styles.profit_text_sty}>日收益</Text>
                                <Text style={styles.profit_num_sty}>-220.00</Text>
                            </View>
                            <View style={Style.flexRow}>
                                <Text style={styles.profit_text_sty}>累计收益</Text>
                                <Text style={styles.profit_num_sty}>-220.00</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ScrollableTabView
                    renderTabBar={() => <TabBar btnColor={'#D7AF74'} />}
                    initialPage={0}
                    style={{marginBottom: text(16)}}
                    tabBarActiveTextColor={'#D7AF74'}
                    tabBarInactiveTextColor={'#545968'}>
                    {data.tabs.map((item, index) => {
                        return (
                            <View tabLabel={item.title} key={index + 'tab'}>
                                {renderContent(index, item)}
                            </View>
                        );
                    })}
                </ScrollableTabView>
                <ScrollableTabView
                    renderTabBar={() => <TabBar btnColor={'#D7AF74'} />}
                    initialPage={0}
                    style={{marginBottom: text(16)}}
                    tabBarActiveTextColor={'#D7AF74'}
                    tabBarInactiveTextColor={'#545968'}>
                    {data.tab_list.map((item, index) => {
                        return (
                            <View tabLabel={item.title} key={index + 'tab'}>
                                {renderItem(index, item)}
                            </View>
                        );
                    })}
                </ScrollableTabView>
                <TouchableOpacity style={styles.list_sty}>
                    <Text style={{flex: 1}}>产品档案</Text>
                    <AntDesign name={'right'} size={12} color={'#9095A5'} />
                </TouchableOpacity>
            </ScrollView>
            <View
                style={[
                    Style.flexRow,
                    {
                        paddingBottom: isIphoneX() ? 34 : px(8),
                        backgroundColor: '#fff',
                        paddingHorizontal: text(16),
                        paddingTop: text(10),
                    },
                ]}>
                <TouchableOpacity
                    style={[styles.button_sty, {borderColor: '#4E556C', borderWidth: 0.5, marginRight: text(10)}]}>
                    <Text style={{textAlign: 'center', color: '#545968'}}>申请赎回</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button_sty, {backgroundColor: '#D7AF74'}]}>
                    <Text style={{textAlign: 'center', color: '#fff'}}>追加购买</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    assets_card_sty: {
        backgroundColor: '#D7AF74',
        paddingHorizontal: text(16),
        paddingVertical: text(15),
        paddingBottom: text(30),
    },
    profit_text_sty: {
        color: '#FFFFFF',
        opacity: 0.4,
        fontSize: Font.textH3,
        marginRight: text(5),
    },
    profit_num_sty: {
        color: '#fff',
        fontSize: text(17),
        fontFamily: Font.numFontFamily,
    },
    item_list: {
        paddingVertical: text(15),
        paddingHorizontal: Space.padding,
    },
    base_info_title: {
        minWidth: text(60),
        color: Colors.descColor,
    },
    base_info_content: {
        flex: 1,
        color: Colors.descColor,
    },
    backgroundVideo: {
        width: deviceWidth - 32,
        height: 200,
    },
    table_title_sty: {
        width: text(90),
        paddingHorizontal: text(16),
        paddingVertical: text(9),
    },
    text_sty: {
        textAlign: 'center',
        color: '#9095A5',
        fontSize: text(13),
        paddingVertical: text(8),
    },
    list_sty: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: text(16),
    },
    button_sty: {
        flex: 1,
        borderRadius: text(10),
        paddingVertical: text(12),
    },
});
