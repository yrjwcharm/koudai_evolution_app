/*
 * @Description:
 * @Autor: xjh
 * @Date: 2021-01-18 17:21:32
 * @LastEditors: xjh
 * @LastEditTime: 2021-01-19 12:15:37
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Linking,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Table from '../../components/Table';
const deviceWidth = Dimensions.get('window').width;
export default class PrivateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: ['重磅首发', '100万起投'],
            scroll_list: [
                {
                    title: '基本信息',
                },
                {title: '路演视频'},
                {
                    title: '公告',
                    data: [
                        {title: '理财魔方私募对冲FOF1号2019年半年', time: '2019-10'},
                        {title: '理财魔方私募对冲FOF1号2019年半年', time: '2019-10'},
                        {title: '理财魔方私募对冲FOF1号2019年半年', time: '2019-10'},
                    ],
                },
            ],
            process_lines: ['<span style="color:#fff;opacity:0.6">总额度(元)</span>5000万'],
        };
    }
    renderContent = (index, data) => {
        if (index === 0) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <View
                        style={[
                            Style.flexRow,
                            styles.item_list,
                            {borderBottomWidth: 0.5, borderColor: Colors.borderColor},
                        ]}>
                        <Text style={styles.base_info_title}>基金名称</Text>
                        <Text style={styles.base_info_content}>
                            安志安志安志安志安志安志安志理财魔方私募对冲FOF1号2019年半年理财魔方私募对冲FOF1号2019年安志安志安志安志安志安志安志理财魔方私募对冲FOF1号2019年半年理财魔方私募对冲FOF1号2019年半年理财魔方私募对冲FOF1号2019年半年半年理财魔方私募对冲FOF1号2019年半年
                        </Text>
                    </View>
                </View>
            );
        } else if (index === 1) {
            return (
                <>
                    <View style={[Style.flexRow, styles.item_list]}>
                        <Text style={{flex: 1}}>魔方量化黑天鹅1号</Text>
                        <Text>12692人观看</Text>
                    </View>
                </>
            );
        } else if (index == 2) {
            return (
                <>
                    {data.map((_i, _d) => {
                        return (
                            <View
                                style={[
                                    Style.flexRow,
                                    styles.item_list,
                                    {backgroundColor: _d % 2 == 0 ? '#fff' : '#F7F8FA'},
                                ]}
                                key={'list' + _d}>
                                <Text style={{flex: 1, fontSize: text(13)}}>{_i.title}</Text>
                                <Text style={{fontSize: text(13)}}>{_i.time}</Text>
                            </View>
                        );
                    })}
                </>
            );
        }
    };
    render() {
        const {label, process_lines, scroll_list} = this.state;
        return (
            <ScrollView style={Style.Container}>
                <View style={[styles.Wrapper, Style.flexCenter]}>
                    <View style={Style.flexRow}>
                        <Text style={styles.card_title}>魔方FOF1号</Text>
                        <View style={styles.card_tag}>
                            <Text style={{color: '#FF7D41', fontSize: Font.textSm}}>募集中</Text>
                        </View>
                    </View>
                    <Text style={styles.card_desc}>专家点评：一键投资多个顶级私募</Text>
                    <View style={Style.flexRow}>
                        {label.map((_label, _index) => {
                            return (
                                <Text key={_index} style={styles.card_label}>
                                    {_label}
                                </Text>
                            );
                        })}
                    </View>
                    <View style={styles.process_outer}>
                        <View style={styles.process_inner}></View>
                    </View>
                    <View style={[Style.flexBetween, {width: deviceWidth - 60}]}>
                        <Html html={process_lines[0]} style={{color: '#fff', fontWeight: 'bold'}} />
                        <Html html={process_lines[0]} style={{color: '#fff', fontWeight: 'bold'}} />
                    </View>
                </View>
                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar />}
                    initialPage={0}
                    tabBarTextStyle={styles.textBarStyle}
                    tabBarActiveTextColor={'#D7AF74'}
                    tabBarInactiveTextColor={'#545968'}
                    tabBarBackgroundColor="#fff"
                    // onChangeTab={(obj) => { this.setState({ curtime: obj.ref.props.tabLabel }, () => { this.init() }) }}
                    tabBarUnderlineStyle={styles.underLine}>
                    {scroll_list.map((item, index) => {
                        return (
                            <View tabLabel={item.title} key={index + 'tab'}>
                                {this.renderContent(index, item.data)}
                            </View>
                        );
                    })}
                </ScrollableTabView>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    Container: {
        backgroundColor: '#F7F8FA',
        flex: 1,
    },
    Wrapper: {
        backgroundColor: '#D7AF74',
        paddingBottom: text(20),
    },
    card_title: {
        color: '#fff',
        fontSize: Font.navTitleFont,
        paddingVertical: text(15),
        fontWeight: 'bold',
    },
    card_tag: {
        backgroundColor: '#fff',
        borderRadius: text(4),
        paddingHorizontal: text(8),
        paddingVertical: text(5),
        marginLeft: text(5),
    },
    card_desc: {
        opacity: 0.6,
        color: '#fff',
    },
    card_label: {
        color: '#fff',
        fontSize: Font.textSm,
        paddingHorizontal: text(6),
        paddingVertical: text(5),
        marginLeft: text(8),
        borderRadius: text(5),
        borderColor: '#fff',
        borderWidth: 0.5,
        marginVertical: text(15),
    },
    process_outer: {
        backgroundColor: '#BA9965',
        width: deviceWidth - 60,
        height: text(2),
        marginBottom: text(15),
        borderRadius: text(30),
    },
    process_inner: {
        backgroundColor: '#fff',
        width: '10%',
        height: text(2),
        borderRadius: text(30),
    },
    underLine: {
        backgroundColor: '#D7AF74',
        height: text(3),
        width: text(30),
        left: text(47),
        marginBottom: text(8),
        borderRadius: 50,
    },
    textBarStyle: {
        fontSize: text(14),
        marginBottom: text(-4),
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
});
