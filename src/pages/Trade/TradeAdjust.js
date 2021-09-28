/*
 * @Description:调仓
 * @Autor: xjh
 * @Date: 2021-01-18 11:17:19
 * @LastEditors: yhc
 * @LastEditTime: 2021-09-28 18:58:30
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {px as text, isIphoneX} from '../../utils/appUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Style, Colors, Font, Space} from '../../common/commonStyle';
import Html from '../../components/RenderHtml';
import Http from '../../services';
import {FixedButton} from '../../components/Button';
import BottomDesc from '../../components/BottomDesc';
import Icon from 'react-native-vector-icons/AntDesign';
import {Modal} from '../../components/Modal';
import {PasswordModal} from '../../components/Password';
import Toast from '../../components/Toast';
import {useJump} from '../../components/hooks';
import {useSelector} from 'react-redux';
const btnHeight = isIphoneX() ? text(90) : text(66);
class TradeAdjust extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: [true, false],
            password: '',
            data: {},
            poid: this.props?.route?.params?.poid,
            mode: this.props?.route?.params?.mode || 0,
        };
    }
    init = () => {
        Http.get('/trade/adjust/plan/20210101', {
            poid: this.state.poid,
            mode: this.state.mode,
        }).then((res) => {
            if (res.code === '000000') {
                this.setState({
                    data: res.result,
                });
            }
        });
    };
    toggleChange = (index) => {
        const toggle = this.state.toggle;
        toggle[index] = !toggle[index];
        this.setState({
            toggle,
        });
    };
    confirmBtn = () => {
        global.LogTool('confirmAdjustmentEnd', this.state.poid);
        if (this.state.data.notice) {
            Modal.show({
                confirm: true,
                content: this.state.data.notice,
                cancelText: '取消调仓',
                confirmText: '确认调仓',
                confirmCallBack: this.passwordInput,
            });
        } else {
            this.passwordInput();
        }
    };
    submit = (password) => {
        let toast = Toast.showLoading();
        const {data} = this.state;
        Http.post('/trade/adjust/do/20210101', {
            adjust_id: data.adjust_id,
            mode: data.mode,
            password: password,
            poid: this.state.poid,
        }).then((res) => {
            Toast.hide(toast);
            if (res.code === '000000') {
                this.props.navigation.navigate('TradeProcessing', {txn_id: res.result.txn_id});
            } else {
                Toast.show(res.message);
            }
        });
    };
    passwordInput = () => {
        this.passwordModal.show();
    };
    render() {
        const {toggle, data} = this.state;
        return (
            <View style={{backgroundColor: Colors.bgColor, flex: 1}}>
                <Focus init={this.init} />
                {Object.keys(data).length > 0 && (
                    <>
                        <ScrollView style={styles.container}>
                            <View style={{marginBottom: text(10)}}>
                                <TouchableOpacity
                                    style={[styles.list_head, Style.flexRow]}
                                    onPress={() => this.toggleChange(0)}
                                    activeOpacity={1}>
                                    <View style={[Style.flexRow, styles.list_content]}>
                                        <View style={[{flex: 1}, Style.flexRow]}>
                                            <Text>{data?.adjust_compare?.title}</Text>
                                        </View>
                                        <AntDesign name={toggle[0] ? 'up' : 'down'} size={12} color={'#9095A5'} />
                                    </View>
                                </TouchableOpacity>
                                {toggle[0] && (
                                    <View
                                        style={{
                                            paddingBottom: text(15),
                                            backgroundColor: '#fff',
                                            paddingHorizontal: text(15),
                                        }}>
                                        <View style={{borderTopWidth: 0.5, borderColor: Colors.borderColor}}>
                                            {data?.adjust_compare?.fund_list?.map((_item, _index) => {
                                                return (
                                                    <View key={_index + '_item'}>
                                                        <View style={[Style.flexRow]}>
                                                            <View
                                                                style={[
                                                                    Style.flexRow,
                                                                    {flex: 1, alignItems: 'baseline'},
                                                                ]}>
                                                                <View
                                                                    style={[
                                                                        styles.circle,
                                                                        {backgroundColor: _item?.color},
                                                                    ]}
                                                                />
                                                                <Text style={{color: '#9AA1B2', fontSize: text(12)}}>
                                                                    {_item?.title}
                                                                </Text>
                                                            </View>
                                                            <Text style={styles.content_head_title}>
                                                                {_index == 0 && data?.adjust_compare?.header?.ratio_src}
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    styles.content_head_title,
                                                                    {textAlign: 'right'},
                                                                ]}>
                                                                {_index == 0 && data?.adjust_compare.header?.ratio_dst}
                                                            </Text>
                                                        </View>
                                                        {_item.funds.map((_i, _d) => {
                                                            const _color =
                                                                _i.compare == 'gt'
                                                                    ? Colors.red
                                                                    : _i.compare == 'lt'
                                                                    ? Colors.green
                                                                    : '#4E556C';
                                                            return (
                                                                <View style={Style.flexRow} key={_i + _d}>
                                                                    <Text
                                                                        style={[
                                                                            styles.content_item_text,
                                                                            {flex: 1, textAlign: 'left'},
                                                                        ]}>
                                                                        {_i?.name}
                                                                    </Text>
                                                                    <Text style={styles.content_item_text}>
                                                                        {(Number(_i?.ratio_src) * 100).toFixed(2)}%
                                                                    </Text>
                                                                    <View style={[Style.flexRow, styles.fund_text_sty]}>
                                                                        <Text
                                                                            style={{
                                                                                fontSize: Font.textH3,
                                                                                color: _color,
                                                                            }}>
                                                                            {(Number(_i?.ratio_dst) * 100).toFixed(2)}%
                                                                        </Text>
                                                                        {_i.compare != 'et' && (
                                                                            <Icon
                                                                                name={
                                                                                    _i?.compare == 'gt'
                                                                                        ? 'arrowup'
                                                                                        : 'arrowdown'
                                                                                }
                                                                                color={_color}
                                                                            />
                                                                        )}
                                                                    </View>
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                )}
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={[styles.list_head, Style.flexRow]}
                                    onPress={() => this.toggleChange(1)}
                                    activeOpacity={1}>
                                    <View style={[Style.flexRow, styles.list_content]}>
                                        <View style={[{flex: 1}, Style.flexRow]}>
                                            <Text>{data?.adjust_hold?.title}</Text>
                                            {/* <AntDesign
                                      name={'questioncircleo'}
                                      size={14}
                                      color={'#9095A5'}
                                      style={{marginLeft: text(5)}}
                                  /> */}
                                        </View>
                                        <AntDesign name={toggle[1] ? 'up' : 'down'} size={12} color={'#9095A5'} />
                                    </View>
                                </TouchableOpacity>
                                {toggle[1] && (
                                    <View
                                        style={{
                                            paddingBottom: text(15),
                                            backgroundColor: '#fff',
                                            paddingHorizontal: text(15),
                                        }}>
                                        <View style={{borderTopWidth: 0.5, borderColor: Colors.borderColor}}>
                                            {data?.adjust_hold?.fund_list?.map((_item, _index) => {
                                                return (
                                                    <View key={_index + '_item'}>
                                                        <View style={[Style.flexRow]}>
                                                            <View
                                                                style={[
                                                                    Style.flexRow,
                                                                    {flex: 1, alignItems: 'baseline'},
                                                                ]}>
                                                                <View
                                                                    style={[
                                                                        styles.circle,
                                                                        {backgroundColor: _item.color},
                                                                    ]}
                                                                />
                                                                <Text style={{color: '#9AA1B2', fontSize: text(12)}}>
                                                                    {_item?.title}
                                                                </Text>
                                                            </View>
                                                            <Text style={styles.content_head_title}>
                                                                {_index == 0 && data?.adjust_hold?.header?.percent}
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    styles.content_head_title,
                                                                    {textAlign: 'right'},
                                                                ]}>
                                                                {_index == 0 && data?.adjust_hold?.header?.amount}
                                                            </Text>
                                                        </View>
                                                        {_item?.funds?.map((_i, _d) => {
                                                            return (
                                                                <View style={Style.flexRow} key={_i + _d}>
                                                                    <Text
                                                                        style={[
                                                                            styles.content_item_text,
                                                                            {flex: 1, textAlign: 'left'},
                                                                        ]}>
                                                                        {_i.name}
                                                                    </Text>
                                                                    <Text style={styles.content_item_text}>
                                                                        {_i.percent}
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styles.content_item_text,
                                                                            {textAlign: 'right'},
                                                                        ]}>
                                                                        {_i.amount}
                                                                    </Text>
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                )}
                            </View>
                            <PasswordModal
                                ref={(ref) => {
                                    this.passwordModal = ref;
                                }}
                                onDone={this.submit}
                            />
                            <View style={{margin: Space.marginAlign}}>
                                <Html html={data?.fee_desc} style={styles.tips_sty} />
                            </View>
                            <BottomDesc />
                        </ScrollView>
                        <FixedButton title="确认调仓" onPress={this.confirmBtn} />
                    </>
                )}
            </View>
        );
    }
}
function Focus({init}) {
    useFocusEffect(
        React.useCallback(() => {
            init();
        }, [init])
    );
    return null;
}
function WithHooks(props) {
    const jump = useJump();
    const userInfo = useSelector((state) => state.userInfo);
    useFocusEffect(
        React.useCallback(() => {
            const {anti_pop} = userInfo.toJS();
            if (anti_pop) {
                Modal.show({
                    title: anti_pop.title,
                    content: anti_pop.content,
                    confirm: true,
                    isTouchMaskToClose: false,
                    cancelCallBack: () => props.navigation.goBack(),
                    confirmCallBack: () => jump(anti_pop.confirm_action?.url),
                    cancelText: anti_pop.cancel_action?.text,
                    confirmText: anti_pop.confirm_action?.text,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userInfo])
    );
    return <TradeAdjust {...props} jump={jump} />;
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        marginBottom: btnHeight,
    },
    list_head: {
        color: Colors.defaultColor,
        backgroundColor: '#FFF',
        paddingHorizontal: text(15),
        paddingTop: text(18),
        borderColor: '#F5F6F8',
        borderTopWidth: 0.5,
    },
    list_content: {
        // borderColor: Colors.borderColor,
        // borderBottomWidth: 0.5,
        // paddingTop: text(20),
        paddingBottom: text(18),
    },
    circle: {
        width: text(8),
        height: text(8),
        // backgroundColor: '#E1645C',
        borderRadius: 50,
        marginRight: text(5),
        marginTop: text(15),
    },
    content_head_title: {
        color: Colors.lightGrayColor,
        fontSize: Font.textH3,
        minWidth: text(90),
        textAlign: 'center',
        paddingTop: text(15),
    },
    content_item_text: {
        color: Colors.descColor,
        fontSize: Font.textH3,
        minWidth: text(90),
        textAlign: 'center',
        paddingTop: text(10),
    },
    tips_sty: {
        color: Colors.lightGrayColor,
        fontSize: text(12),
        margin: text(10),
        lineHeight: text(18),
    },
    fund_text_sty: {
        width: text(90),
        justifyContent: 'flex-end',
        paddingTop: text(15),
    },
});

export default WithHooks;
