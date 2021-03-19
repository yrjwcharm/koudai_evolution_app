/*
 * @Autor: xjh
 * @Date: 2021-01-18 17:21:32
 * @LastEditors: yhc
 * @Desc:私募产品公告
 * @LastEditTime: 2021-03-19 15:31:43
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
            data: {},
            fund_code: props.route?.params?.fund_code || '',
        };
    }
    componentDidMount() {
        this.init();
    }
    init() {
        Http.get('/pe/product_detail/20210101', {
            fund_code: this.state.fund_code,
        }).then((res) => {
            this.setState({
                data: res.result,
            });
        });
    }
    _handleTabHeight = (obj) => {
        console.log(obj);
        //页面切换时跳到顶部
        this.refs.totop.scrollTo({x: 0, y: 0, animated: false});
        //通过ref获得当前页面的高度计算方法
        console.log(this.refs[obj.ref.props.tabLabel]);
        // this.refs[obj.ref.props.tabLabel].measure(this._setTabHeight.bind(this));
        this.LrState = obj.ref.props.tabLabel;
    };

    _setTabHeight = (ox, oy, width, height, px, py) => {
        //高度不为零时才进行高度计算
        if (height != 0) {
            //获取左右的高度
            if (this.LrState === 'Left' && this.state.LTabSwitch) {
                this.setState((prevState, props) => ({
                    Lheight: height,
                    LTabSwitch: false,
                }));
            } else if (this.LrState === 'Right' && this.state.RTabSwitch) {
                this.setState((prevState, props) => ({
                    Rheight: height,
                    RTabSwitch: false,
                }));
            }
            //判断是否是第一次取高度
            if (!this.state.firstTabSwitch) {
                //动态更改view的高度
                if (this.LrState === 'Left') {
                    this.setState((prevState, props) => ({
                        tabViewStyle: {height: this.state.Lheight + 40},
                    }));
                } else {
                    this.setState((prevState, props) => ({
                        tabViewStyle: {height: this.state.Rheight + 40},
                    }));
                }
            } else {
                this.setState({
                    firstTabSwitch: false,
                });
            }
        }
    };

    renderContent = (index, data) => {
        if (index === 0) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <View style={{paddingHorizontal: text(16), flex: 1}} ref="Left">
                        {data?.content && <Html html={data?.content} />}
                    </View>
                </View>
            );
        } else if (index === 1) {
            return (
                <>
                    <View style={[Style.flexRow, styles.item_list]} ref="right">
                        <Text style={{flex: 1}}>{data?.content?.title}</Text>
                        <Text>{data?.content?.subtitle}</Text>
                    </View>
                    <View style={[Style.flexCenter]}>
                        <Video url={data?.content?.video} />
                    </View>
                </>
            );
        } else if (index == 2) {
            return (
                <>
                    {data?.content.map((_i, _d) => {
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
        const {url, countdown} = this.state.data.button;
        if (countdown) {
            Modal.show({
                content: countdown,
                // confirm: true,
                // confirmText: data.tip.button[0].title,
                // cancelText: data.tip.button[1].title,
                confirmCallBack: () => {
                    this.init();
                },
            });
        } else {
            this.props.navigation.navigate(url.path, url.params);
        }
    };
    render() {
        const {data} = this.state;
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
                        <ScrollView style={{marginBottom: btnHeight}} ref="totop">
                            <View style={[styles.Wrapper, Style.flexCenter]}>
                                <View style={[Style.flexRow, {paddingTop: text(15), paddingBottom: text(5)}]}>
                                    <Text style={styles.card_title}>{data.fund_name}</Text>
                                    <View style={styles.card_tag}>
                                        <Text style={{color: '#FF7D41', fontSize: Font.textSm}}>{data.fund_stage}</Text>
                                    </View>
                                </View>
                                <Text style={styles.card_desc}>{data.fund_remark}</Text>
                                <View style={Style.flexRow}>
                                    {data?.tags &&
                                        data?.tags.map((_label, _index) => {
                                            return (
                                                <Text key={_index} style={styles.card_label}>
                                                    {_label}
                                                </Text>
                                            );
                                        })}
                                </View>
                                {data?.progress && (
                                    <View style={styles.process_outer}>
                                        <View
                                            style={[styles.process_inner, {width: data?.progress?.percent * 100 + '%'}]}
                                        />
                                    </View>
                                )}
                                {data.progress && (
                                    <View style={[Style.flexBetween, {width: deviceWidth - 60}]}>
                                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: text(13)}}>
                                            {data?.progress?.left_amount?.name}
                                            {data?.progress?.left_amount?.val}
                                        </Text>
                                        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: text(13)}}>
                                            {data?.progress?.total_amount?.name}
                                            {data?.progress?.total_amount?.val}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View>
                                {data?.introduce.map((_img, _i) => {
                                    return <FitImage key={_i + '_img'} source={{uri: _img}} resizeMode="contain" />;
                                })}
                            </View>
                            <ScrollableTabView
                                renderTabBar={() => <TabBar btnColor={'#D7AF74'} />}
                                initialPage={0}
                                onChangeTab={(obj) => {
                                    this._handleTabHeight(obj);
                                }}
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
                            disabled={data.button.avail == 0}
                            title={data.button.text}
                            style={{backgroundColor: '#CEA26B'}}
                            onPress={this.submitOrder}
                            disabledColor={'#ddd'}
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
        borderRadius: text(3),
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
