/*
 * @Autor: xjh
 * @Date: 2021-01-18 17:21:32
 * @LastEditors: xjh
 * @Desc:私募产品公告
 * @LastEditTime: 2021-02-24 16:21:15
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
import Http from '../../services';
import TabBar from '../../components/TabBar.js';
import {Modal} from '../../components/Modal';
const deviceWidth = Dimensions.get('window').width;
const btnHeight = isIphoneX() ? text(90) : text(66);
export default class PrivateProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            process_lines: ['<span style="color:#fff;opacity:0.6">总额度(元)</span>5000万'],
            data: {},
        };
    }
    componentDidMount() {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/pe/product_detail/20210101', {
            fund_code: 'SGX499',
        }).then((res) => {
            this.setState({
                data: res.result,
            });
        });
    }
    renderContent = (index, data) => {
        if (index === 0) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <View style={{paddingHorizontal: text(16)}}>
                        <Html html={data.content} />
                    </View>
                    {/* {data.content.map((_c, _idx) => {
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
                                <Html
                                    style={styles.base_info_content}
                                    html={
                                        "<div style='display:flex;align-items:center;justify-content:space-between' >\n  <span>基金名称</span>\n  <p>安志魔方量化对冲私募证券投资基金FOF1号</p>\n</div>\n"
                                    }
                                />
                            </View>
                        );
                    })} */}
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
    submitOrder = () => {
        const {data} = this.state;
        Modal.show({
            title: data.tip.title,
            content: data.tip.content,
            confirm: true,
            confirmText: data.tip.button[0].title,
            cancleText: data.tip.button[1].title,
            confirmCallBack: () => {
                this.props.navigation.navigate(this.state.data.button.url);
            },
        });
    };
    render() {
        const {label, process_lines, scroll_list, data} = this.state;
        return (
            <>
                {Object.keys(data).length > 0 && (
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
                                renderTabBar={() => <TabBar btnColor={'#D7AF74'} />}
                                initialPage={0}
                                tabBarActiveTextColor={'#D7AF74'}
                                tabBarInactiveTextColor={'#545968'}>
                                {data.tabs.map((item, index) => {
                                    return (
                                        <View tabLabel={item.title} key={index + 'tab'}>
                                            {this.renderContent(index, item)}
                                        </View>
                                    );
                                })}
                            </ScrollableTabView>
                        </ScrollView>
                        <FixedButton
                            title={data.button.text}
                            style={{backgroundColor: '#CEA26B'}}
                            onPress={this.submitOrder}
                        />
                    </View>
                )}
            </>
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
