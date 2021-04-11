/*
 * @Autor: xjh
 * @Date: 2021-01-18 17:21:32
 * @LastEditors: yhc
 * @Desc:私募产品公告
 * @LastEditTime: 2021-04-11 18:15:44
 */
import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {Colors, Font, Space, Style} from '../../common//commonStyle';
import {px as text, isIphoneX} from '../../utils/appUtil';
import Html from '../../components/RenderHtml';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Header from '../../components/NavBar';
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
            curIndex: 0,
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
                        {/* <Videoplayer
                            url={data?.content?.video}
                            navigation={this.props.navigation} //路由 用于小屏屏播放的返回按钮
                            ref={(ref) => (this.player = ref)}
                            poster={
                                'https://static.licaimofang.com/wp-content/uploads/2020/05/151590048433_.pic_hd.png'
                            } //视频封面
                        /> */}

                        {/* <Video url={data?.content?.video} /> */}
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
        const {url, countdown} = this.state.data.button;
        if (countdown) {
            Modal.show({
                content: countdown,
                confirmCallBack: () => {
                    this.init();
                },
            });
        } else {
            this.props.navigation.navigate(url.path, url.params);
        }
    };
    ChangeTab = (i) => {
        this.setState({
            curIndex: i,
        });
    };
    render() {
        const {data, curIndex} = this.state;
        return (
            <>
                {Object.keys(data).length > 0 && (
                    <>
                        <Header
                            title={data.title}
                            leftIcon="chevron-left"
                            style={{backgroundColor: '#D7AF74'}}
                            fontStyle={{color: '#fff'}}
                        />
                        <View style={styles.Container}>
                            <ScrollView style={{marginBottom: btnHeight}} ref="totop">
                                <View style={[styles.Wrapper, Style.flexCenter]}>
                                    <View style={[Style.flexRow, {paddingTop: text(15), paddingBottom: text(5)}]}>
                                        <Text style={styles.card_title}>{data.fund_name}</Text>
                                        <View style={styles.card_tag}>
                                            <Text style={{color: '#FF7D41', fontSize: Font.textSm}}>
                                                {data.fund_stage}
                                            </Text>
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
                                                style={[
                                                    styles.process_inner,
                                                    {width: data?.progress?.percent * 100 + '%'},
                                                ]}
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
                                    // onChangeTab={(obj) => {
                                    //     this._handleTabHeight(obj);
                                    // }}

                                    onChangeTab={(obj) => this.ChangeTab(obj.i)}
                                    tabBarActiveTextColor={'#D7AF74'}
                                    tabBarInactiveTextColor={'#545968'}>
                                    {data.tabs.map((item, index) => {
                                        return (
                                            <View tabLabel={item.title} key={index + 'tab'}>
                                                {/* {this.renderContent(index, item)} */}
                                            </View>
                                        );
                                    })}
                                </ScrollableTabView>
                                {this.renderContent(curIndex, data.tabs[curIndex])}
                            </ScrollView>
                            <FixedButton
                                disabled={data.button.avail == 0}
                                title={data.button.text}
                                style={{backgroundColor: '#CEA26B'}}
                                onPress={this.submitOrder}
                                disabledColor={'#ddd'}
                                color={'#CEA26B'}
                            />
                        </View>
                    </>
                )}
            </>
        );
    }
}
const styles = StyleSheet.create({
    Container: {
        backgroundColor: '#F7F8FA',
        flex: 1,
        borderColor: '#fff',
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
