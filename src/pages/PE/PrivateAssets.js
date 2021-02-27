/*
 * @Author: xjh
 * @Date: 2021-02-22 16:42:30
 * @Description:私募持仓
 * @LastEditors: xjh
 * @LastEditTime: 2021-02-27 13:58:47
 */
import React, {useState, useCallback, useEffect, useRef} from 'react';
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
import Http from '../../services';
import {Modal, SelectModal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import {BottomModal} from '../../components/Modal';
const deviceWidth = Dimensions.get('window').width;
const btnHeight = isIphoneX() ? text(90) : text(66);

export default function PrivateAssets(props) {
    const [showEye, setShowEye] = useState('true');
    const [data, setData] = useState({});
    const passwordModal = useRef(null);
    const bottomModal = React.useRef(null);
    const [left, setLeft] = useState('100%');
    const [qa, setQa] = useState({});
    const rightPress = () => {
        props.navigation.navigate('TradeRecord');
    };
    const toggleEye = useCallback(() => {
        setShowEye((show) => {
            setShowEye(show === 'true' ? 'false' : 'true');
            storage.save('myAssetsEye', show === 'true' ? 'false' : 'true');
        });
    }, []);

    useEffect(() => {
        Http.get('http://kmapi.huangjianquan.mofanglicai.com.cn:10080/pe/asset_detail/20210101', {
            fund_code: 'SGX499',
        }).then((res) => {
            setData(res.result);
        });
    }, []);
    const redeemBtn = () => {
        Modal.show({
            confirm: true,
            content: data.buttons[1].pop.content,
            title: data.buttons[1].pop.title,
            confirmText: '继续赎回',
            confirmCallBack: passwordInput,
        });
    };
    const passwordInput = () => {
        passwordModal.show();
        setShowMask(true);
    };
    const submitData = () => {
        //赎回提交记录
    };
    const tipShow = (q, a) => {
        qa['q'] = q;
        qa['a'] = a;
        setQa(qa);
        bottomModal.current.show();
    };
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
                        {data?.table?.th?.map((_head, _index) => {
                            return (
                                <Text
                                    style={[
                                        styles.table_title_sty,
                                        {
                                            textAlign:
                                                _index == 0
                                                    ? 'left'
                                                    : _index == data.table.th.length - 1
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
                        {data?.table?.tr_list?.slice(0, 6).map((_body, _index) => {
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
                                                                ? parseFloat(_td.text.replaceAll(',', '')) < 0
                                                                    ? Colors.green
                                                                    : Colors.red
                                                                : '',
                                                    },
                                                ]}>
                                                {_td.text}
                                            </Text>
                                        );
                                    })}
                                </View>
                            );
                        })}
                        <TouchableOpacity style={styles.text_sty} onPress={() => props.navigation.navigate('AssetNav')}>
                            <Text>更多净值</Text>
                            <AntDesign name={'right'} size={12} color={'#9095A5'} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Text style={styles.list_item_sty}>{data.table.th}</Text>
                    <View>
                        {data?.table?.tr_list?.map((_tr, _index) => {
                            return (
                                <TouchableOpacity
                                    style={[Style.flexRow, {backgroundColor: _index % 2 == 0 ? '#fff' : '#F7F8FA'}]}
                                    onPress={() => tipShow(_tr.q, _tr.a)}>
                                    <Text
                                        style={[
                                            styles.list_item_sty,
                                            {
                                                color: '#121D3A',
                                                flex: 1,
                                                backgroundColor: 'transparent',
                                            },
                                        ]}
                                        key={_index + '_tr1'}>
                                        {_tr.text}
                                    </Text>
                                    <AntDesign
                                        name={'questioncircleo'}
                                        size={15}
                                        color={'#9095A5'}
                                        style={{marginRight: text(16)}}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        }
    };
    return (
        <View style={{flex: 1}}>
            {Object.keys(data).length > 0 && (
                <>
                    <Header
                        title={data.title}
                        leftIcon="chevron-left"
                        style={{backgroundColor: '#D7AF74'}}
                        fontStyle={{color: '#fff'}}
                        rightText={'交易记录'}
                        rightPress={() => rightPress()}
                        rightTextStyle={styles.right_sty}
                    />
                    <ScrollView style={{marginBottom: btnHeight}}>
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
                                    <Text style={[styles.profit_num_sty, {fontSize: text(24)}]}>
                                        {data?.total_amount}
                                    </Text>
                                </View>
                                <View>
                                    <View style={[Style.flexRow, {marginBottom: text(15), alignSelf: 'flex-end'}]}>
                                        <Text style={styles.profit_text_sty}>日收益</Text>
                                        <Text style={styles.profit_num_sty}>{data?.total_share}</Text>
                                    </View>
                                    <View style={Style.flexRow}>
                                        <Text style={styles.profit_text_sty}>累计收益</Text>
                                        <Text style={styles.profit_num_sty}>{data?.profit_acc}</Text>
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
                            {data?.tabs1.map((item, index) => {
                                return (
                                    <View tabLabel={item?.title} key={index + 'tab'}>
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
                            {data?.tabs2?.map((item, index) => {
                                return (
                                    <View tabLabel={item?.title} key={index + 'tab'}>
                                        {renderItem(index, item)}
                                    </View>
                                );
                            })}
                        </ScrollableTabView>
                        {data?.cards?.map((_item, _index) => {
                            return (
                                <TouchableOpacity style={styles.list_sty} key={_index + '_item'}>
                                    <Text style={{flex: 1}}>{_item?.text}</Text>
                                    <AntDesign name={'right'} size={12} color={'#9095A5'} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <PasswordModal
                        onDone={submitData}
                        onClose={() => {
                            setShowMask(false);
                        }}
                    />
                    <BottomModal ref={bottomModal} confirmText={'确认'}>
                        <View style={{padding: text(16)}}>
                            <Text style={[styles.tips_sty, {marginBottom: text(10)}]}>{qa?.q}</Text>
                            <Text style={styles.tips_sty}>{qa?.a}</Text>
                        </View>
                    </BottomModal>
                    <View
                        style={[
                            Style.flexRow,
                            {
                                paddingBottom: isIphoneX() ? 34 : text(8),
                                backgroundColor: '#fff',
                                paddingHorizontal: text(16),
                                paddingTop: text(10),
                                position: 'absolute',
                                bottom: 0,
                            },
                        ]}>
                        <TouchableOpacity
                            style={[
                                styles.button_sty,
                                {borderColor: '#4E556C', borderWidth: 0.5, marginRight: text(10)},
                            ]}
                            onPress={redeemBtn}>
                            <Text style={{textAlign: 'center', color: '#545968'}}>{data?.buttons[1]?.text}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button_sty, {backgroundColor: '#D7AF74'}]}>
                            <Text style={{textAlign: 'center', color: '#fff'}}>{data?.buttons[0]?.text}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
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
        paddingVertical: text(12),
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
    list_item_sty: {
        fontSize: text(13),
        color: '#9095A5',
        textAlign: 'center',
        paddingVertical: text(12),
        backgroundColor: '#F7F8FA',
    },
    tips_sty: {
        color: '#545968',
        fontSize: text(13),
        lineHeight: text(18),
    },
});
