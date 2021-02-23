/*
 * @Autor: xjh
 * @Date: 2021-01-18 17:21:32
 * @LastEditors: xjh
 * @Desc:私募产品公告
 * @LastEditTime: 2021-02-22 16:34:21
 */
import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Header from '../../components/NavBar';
import Video from '../../components/Video';
import FitImage from 'react-native-fit-image';
import {FixedButton} from '../../components/Button';
const deviceWidth = Dimensions.get('window').width;
const btnHeight = isIphoneX() ? text(90) : text(66);
export default class PrivateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            process_lines: ['<span style="color:#fff;opacity:0.6">总额度(元)</span>5000万'],
            data: {
                title: '魔方FOF1号',
                fund_name: '魔方FOF1号',
                fund_code: 'SGX499',
                fund_stage: '预约中',
                fund_remark: '产品亮点：一键投资多个顶级私募',
                tags: ['高端用户专享', ' 百万起投', '低风险高收益'],
                introduce: [
                    'https://static.licaimofang.com/wp-content/uploads/2019/08/11811566543757_.pic_hd.png',
                    'https://static.licaimofang.com/wp-content/uploads/2020/05/20200526140622.png',
                    'https://static.licaimofang.com/wp-content/uploads/2019/08/11831566543773_.pic_hd.png',
                ],
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
                tips: [],
                button: {
                    text: '开始预约',
                    avail: 1,
                    url: '/fofapply?fr=apply&ids=10&code=SGX499&accountid=SGX499',
                    countdown: '',
                },
            },
        };
    }
    renderContent = (index, data) => {
        if (index === 0) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    {data.content.map((_c, _idx) => {
                        return (
                            <View
                                key={_idx + '_c'}
                                style={[
                                    Style.flexBetween,
                                    styles.item_list,
                                    {
                                        borderBottomWidth: 0.5,
                                        borderColor: Colors.borderColor,
                                        backgroundColor: _idx % 2 == 0 ? '#fff' : '#F7F8FA',
                                    },
                                ]}>
                                <Text style={styles.base_info_title}>{_c.title}</Text>
                                <Html style={styles.base_info_content} html={_c.desc} />
                            </View>
                        );
                    })}
                </View>
            );
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
        } else if (index == 2) {
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
    render() {
        const {label, process_lines, scroll_list, data} = this.state;
        return (
            <View style={styles.Container}>
                <Header
                    title={data.title}
                    leftIcon="chevron-left"
                    style={{backgroundColor: '#D7AF74'}}
                    fontStyle={{color: '#fff'}}
                />
                <ScrollView style={{marginBottom: btnHeight}}>
                    <View style={[styles.Wrapper, Style.flexCenter]}>
                        <View style={[Style.flexRow, {paddingTop: text(15), paddingBottom: text(5)}]}>
                            <Text style={styles.card_title}>{data.fund_name}</Text>
                            <View style={styles.card_tag}>
                                <Text style={{color: '#FF7D41', fontSize: Font.textSm}}>{data.fund_stage}</Text>
                            </View>
                        </View>
                        <Text style={styles.card_desc}>{data.fund_remark}</Text>
                        <View style={Style.flexRow}>
                            {data.tags.map((_label, _index) => {
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
                    <View>
                        {data.introduce.map((_img, _i) => {
                            return <FitImage key={_i + '_img'} source={{uri: _img}} resizeMode="contain" />;
                        })}
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
                        {data.tabs.map((item, index) => {
                            return (
                                <View tabLabel={item.title} key={index + 'tab'}>
                                    {this.renderContent(index, item)}
                                </View>
                            );
                        })}
                    </ScrollableTabView>
                </ScrollView>
                <FixedButton title={data.button.text} style={{backgroundColor: '#CEA26B'}} onPress={this.submitOrder} />
            </View>
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
        paddingHorizontal: text(5),
        paddingVertical: text(3),
        marginLeft: text(8),
        borderRadius: text(5),
        borderColor: '#fff',
        borderWidth: 0.5,
        marginVertical: text(18),
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
    backgroundVideo: {
        width: deviceWidth - 32,
        height: 200,
    },
});
